/* @format */

import {
	createClient,
	LiveTranscriptionEvents,
	type DeepgramClient,
	type ListenLiveClient,
	type LiveTranscriptionEvent,
} from "@deepgram/sdk";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync, writeFileSync } from "fs";

type LiveConnection = {
	connection: ListenLiveClient;
	transcripts: Map<string, string[]>;
	currentUtteranceId: string | null;
} & (
	| { isOpen: true; keepAliveInterval: NodeJS.Timeout }
	| { isOpen: false; keepAliveInterval: null }
);

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
			transcripts: new Map(),
			currentUtteranceId: null,
			isOpen: false,
			keepAliveInterval: null,
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
					const conn = this.liveConnections.get(conversationId);
					const utteranceId = conn?.currentUtteranceId;
					if (utteranceId) {
						if (!conn.transcripts.has(utteranceId)) {
							conn.transcripts.set(utteranceId, []);
						}
						conn.transcripts.get(utteranceId)?.push(transcript);
					}
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

				const existingConnection =
					this.liveConnections.get(conversationId);
				if (!existingConnection) {
					throw new Error(
						"There must be an existing connection to mark as opened",
					);
				}
				const keepAliveInterval = setInterval(() => {
					const conn = this.liveConnections.get(conversationId);
					if (!conn?.isOpen) {
						clearInterval(keepAliveInterval);
						return;
					}

					conn.connection.send(JSON.stringify({ type: "KeepAlive" }));
					this.logger.debug(`KeepAlive sent: ${conversationId}`);
				}, 4000);
				this.liveConnections.set(conversationId, {
					...existingConnection,
					isOpen: true,
					keepAliveInterval,
				});
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
								{ cause: error },
							),
				);
			});
		});
	}

	startUtterance(conversationId: string, utteranceId: string): void {
		const conn = this.liveConnections.get(conversationId);

		if (!conn) {
			throw new Error(`No Deepgram connection for ${conversationId}`);
		}

		conn.currentUtteranceId = utteranceId;
		conn.transcripts.set(utteranceId, []);
		this.logger.debug(
			`Started utterance ${utteranceId} for conversation ${conversationId}`,
		);
	}

	getCurrentUtteranceId(
		conversationId: string,
	): LiveConnection["currentUtteranceId"] {
		const conn = this.liveConnections.get(conversationId);
		if (!conn) {
			throw new Error(
				`No Deepgram connection found for ${conversationId}`,
			);
		}
		return conn.currentUtteranceId;
	}

	sendAudioChunk(conversationId: string, audioChunk: string): void {
		const liveConn = this.liveConnections.get(conversationId);

		if (!liveConn?.isOpen) {
			throw new Error(
				`No active Deepgram connection for ${conversationId}`,
			);
		}

		const audioBuffer = Buffer.from(audioChunk, "base64");
		this.logger.debug(
			`Sending audio chunk for ${conversationId}: ${audioBuffer.length} bytes`,
		);

		liveConn.connection.send(audioBuffer.buffer);
	}

	async finalizeUtterance(
		conversationId: string,
		utteranceId: string,
	): Promise<string> {
		const conn = this.liveConnections.get(conversationId);

		if (!conn) {
			throw new Error(
				`No Deepgram connection found for ${conversationId}`,
			);
		}

		// Send Finalize message to flush pending audio
		conn.connection.send(JSON.stringify({ type: "Finalize" }));

		// Wait for finalized transcripts with timeout
		await new Promise<void>((resolve) => {
			const timeout = setTimeout(() => resolve(), 1000);

			const transcriptHandler = (data: LiveTranscriptionEvent) => {
				// Check if this is a response from Finalize
				if (data.from_finalize === true) {
					this.logger.debug(
						"final transcript received - temporary handler",
					);
					clearTimeout(timeout);
					resolve();
				}
			};

			conn.connection.once(
				LiveTranscriptionEvents.Transcript,
				transcriptHandler,
			);
		});

		const utteranceTranscripts = conn.transcripts.get(utteranceId) || [];
		const fullTranscript = utteranceTranscripts.join(" ");
		this.logger.log(`Transcription: "${fullTranscript}"`);

		// Clean up
		conn.transcripts.delete(utteranceId);
		if (conn.currentUtteranceId === utteranceId) {
			conn.currentUtteranceId = null;
		}

		return fullTranscript;
	}

	async closeConnection(conversationId: string): Promise<void> {
		const conn = this.liveConnections.get(conversationId);

		if (!conn) {
			this.logger.warn(
				`No Deepgram connection found for ${conversationId}`,
			);
			return;
		}

		if (conn.isOpen) {
			clearInterval(conn.keepAliveInterval);
			this.liveConnections.set(conversationId, {
				...conn,
				isOpen: false,
				keepAliveInterval: null,
			});
		}

		conn.connection.requestClose();

		// Wait for close with timeout
		await new Promise((resolve) => {
			const timeout = setTimeout(resolve, 1000);
			conn.connection.on("close", () => {
				clearTimeout(timeout);
				resolve(null);
			});
		});

		this.liveConnections.delete(conversationId);
		this.logger.log(`Deepgram connection closed: ${conversationId}`);
	}
}
