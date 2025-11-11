/* @format */

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	createClient,
	LiveTranscriptionEvents,
	type DeepgramClient,
	type ListenLiveClient,
	type LiveTranscriptionEvent,
} from "@deepgram/sdk";
import { writeFileSync, readFileSync } from "fs";

interface LiveConnection {
	connection: ListenLiveClient;
	transcripts: string[];
	isOpen: boolean;
}

@Injectable()
export class DeepgramService {
	private readonly logger = new Logger(DeepgramService.name);
	private readonly deepgram: DeepgramClient;
	private liveConnections = new Map<string, LiveConnection>();

	constructor(private readonly configService: ConfigService) {
		const apiKey = this.configService.get<string>("DEEPGRAM_API_KEY");
		if (typeof apiKey !== "string") {
			throw new Error("DEEPGRAM_API_KEY is not configured");
		}
		this.deepgram = createClient(apiKey);
		this.logger.log("DeepgramService initialized");
	}

	async transcribe(audioBuffer: Buffer): Promise<string> {
		try {
			this.logger.debug(
				`Transcribing audio buffer of size: ${audioBuffer.length} bytes`,
			);

			// DEBUG: Save audio buffer to disk for inspection
			const timestamp = Date.now();
			const debugFilePath = `/tmp/debug-audio-${timestamp}.wav`;
			writeFileSync(debugFilePath, audioBuffer);
			this.logger.debug(`Audio saved to: ${debugFilePath}`);
			this.logger.debug(
				`First 44 bytes (WAV header): ${audioBuffer.slice(0, 44).toString("hex")}`,
			);

			// Read the saved file and send to Deepgram
			const fileBuffer = readFileSync(debugFilePath);
			this.logger.debug(`File buffer size: ${fileBuffer.length} bytes`);
			const { result, error } =
				await this.deepgram.listen.prerecorded.transcribeFile(
					fileBuffer,
					{
						model: "nova-2",
						smart_format: true,
						language: "en",
					},
				);

			if (error) {
				this.logger.error("Deepgram transcription error:", error);
				throw new Error(`Transcription failed: ${error.message}`);
			}

			const transcript =
				result.results?.channels[0]?.alternatives[0]?.transcript || "";

			if (!transcript) {
				this.logger.warn(
					"No transcription result returned from Deepgram",
				);
				return "";
			}

			this.logger.log(`Transcription successful: "${transcript}"`);
			return transcript;
		} catch (error) {
			this.logger.error("Error during transcription:", error);
			throw error;
		}
	}

	async startLiveTranscription(conversationId: string): Promise<void> {
		const connection = this.deepgram.listen.live({
			model: "nova-2",
			language: "en",
			smart_format: true,
			encoding: "linear16",
			sample_rate: 16000,
			channels: 1,
			interim_results: false, // only final transcription
		});

		const liveConn: LiveConnection = {
			connection,
			transcripts: [],
			isOpen: false,
		};

		// Store connection early
		this.liveConnections.set(conversationId, liveConn);

		// Register persistent error handler for runtime errors
		connection.on(LiveTranscriptionEvents.Error, (error) => {
			this.logger.error(
				`Deepgram runtime error for ${conversationId}:`,
				error,
			);
		});

		connection.on(
			LiveTranscriptionEvents.Transcript,
			(data: LiveTranscriptionEvent) => {
				if (data.is_final && data.channel.alternatives[0]?.transcript) {
					const transcript = data.channel.alternatives[0].transcript;
					liveConn.transcripts.push(transcript);
				}
			},
		);

		connection.on(LiveTranscriptionEvents.Close, () => {
			liveConn.isOpen = false;
		});

		// Wait for connection to open
		await new Promise<void>((resolve, reject) => {
			const timeout = setTimeout(() => {
				reject(new Error("Deepgram connection timeout"));
			}, 5000);

			connection.on(LiveTranscriptionEvents.Open, () => {
				clearTimeout(timeout);
				this.logger.log(
					`Deepgram connection opened: ${conversationId}`,
				);
				liveConn.isOpen = true;
				resolve();
			});

			connection.once(LiveTranscriptionEvents.Error, (error) => {
				clearTimeout(timeout);
				reject(
					error instanceof Error
						? error
						: new Error(
								typeof error === "string"
									? error
									: String(error),
							),
				);
			});
		});
	}

	sendAudioChunk(conversationId: string, audioChunk: string): void {
		const liveConn = this.liveConnections.get(conversationId);

		if (!liveConn?.isOpen) {
			throw new Error(
				`No active Deepgram connection for ${conversationId}`,
			);
		}

		const audioBuffer = Buffer.from(audioChunk, "base64");
		liveConn.connection.send(audioBuffer.buffer);
	}

	async finalizeUtterance(conversationId: string): Promise<string> {
		const liveConn = this.liveConnections.get(conversationId);

		if (!liveConn) {
			throw new Error(
				`No Deepgram connection found for ${conversationId}`,
			);
		}

		// Send Finalize message to flush pending audio
		liveConn.connection.send(JSON.stringify({ type: "Finalize" }));

		// Wait for finalized transcripts with timeout
		await new Promise<void>((resolve) => {
			const timeout = setTimeout(() => resolve(), 1000);

			const transcriptHandler = (data: LiveTranscriptionEvent) => {
				// Check if this is a response from Finalize
				if (data.from_finalize === true) {
					clearTimeout(timeout);
					// Remove this one-time handler
					liveConn.connection.off(
						LiveTranscriptionEvents.Transcript,
						transcriptHandler,
					);
					resolve();
				}
			};

			liveConn.connection.on(
				LiveTranscriptionEvents.Transcript,
				transcriptHandler,
			);
		});

		const fullTranscript = liveConn.transcripts.join(" ");
		this.logger.log(`Transcription: "${fullTranscript}"`);

		// Clear transcripts for next utterance
		liveConn.transcripts = [];

		return fullTranscript;
	}

	async closeConnection(conversationId: string): Promise<void> {
		const liveConn = this.liveConnections.get(conversationId);

		if (!liveConn) {
			this.logger.warn(
				`No Deepgram connection found for ${conversationId}`,
			);
			return;
		}

		liveConn.connection.requestClose();

		// Wait for close with timeout
		await new Promise((resolve) => {
			const timeout = setTimeout(resolve, 1000);
			liveConn.connection.on("close", () => {
				clearTimeout(timeout);
				resolve(null);
			});
		});

		this.liveConnections.delete(conversationId);
		this.logger.log(`Deepgram connection closed: ${conversationId}`);
	}

	async stopLiveTranscription(conversationId: string): Promise<string> {
		const liveConn = this.liveConnections.get(conversationId);

		if (!liveConn) {
			throw new Error(
				`No Deepgram connection found for ${conversationId}`,
			);
		}

		liveConn.connection.requestClose();

		// Wait for close with timeout
		await new Promise((resolve) => {
			const timeout = setTimeout(resolve, 1000);
			liveConn.connection.on("close", () => {
				clearTimeout(timeout);
				resolve(null);
			});
		});

		const fullTranscript = liveConn.transcripts.join(" ");
		this.logger.log(`Transcription: "${fullTranscript}"`);

		this.liveConnections.delete(conversationId);
		return fullTranscript;
	}
}
