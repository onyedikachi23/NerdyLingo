/** @format */

import {
	GatewayMetadata,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { randomUUID } from "crypto";

import type {
	AuthenticatedSocket,
	RecievedEventData,
	RecievedEventResponse,
} from "./types";
import { TypedSubscribeMessage } from "./voice-translate.decorator";
import { WSAuthGuard } from "./ws-auth-guard";
import { VoiceTranslationService } from "./voice-translation.service";

@WebSocketGateway({
	namespace: "voice-translate",
} satisfies GatewayMetadata)
export class VoiceTranslateGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(VoiceTranslateGateway.name);

	constructor(
		private readonly wsAuthGuard: WSAuthGuard,
		private readonly vtService: VoiceTranslationService,
	) {}

	async handleConnection(client: AuthenticatedSocket) {
		try {
			// Manually authenticate since guards don't run on connection
			await this.wsAuthGuard.authenticateConnection(client);
			this.logger.log(`Client connected: ${client.data.user.name}`);
		} catch (error) {
			this.logger.error("Couldn't connect client", error);

			client.emit("error", {
				success: false,
				message:
					error instanceof Error
						? error.message
						: "Authentication failed",
			});
			client.disconnect(true);
		}
	}

	handleDisconnect(client: AuthenticatedSocket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@TypedSubscribeMessage("conversation:start")
	async handleStartConversation(
		client: AuthenticatedSocket,
	): Promise<RecievedEventResponse<"conversation:start">> {
		this.logger.log(`Conversation started by: ${client.data.user.name}`);

		const conversationId = randomUUID();

		// Start Deepgram connection for this conversation
		await this.vtService.startConversation(conversationId);

		return {
			success: true,
			message: "Conversation started",
			data: {
				conversationId,
			},
		};
	}

	@TypedSubscribeMessage("conversation:stop")
	async handleStopConversation(
		client: AuthenticatedSocket,
		data: RecievedEventData<"conversation:stop">,
	): Promise<RecievedEventResponse<"conversation:stop">> {
		this.logger.log(
			`Conversation stopped by ${client.data.user.name}: ${data.conversationId}`,
		);

		// Close Deepgram connection and clear buffers
		await this.vtService.stopConversation(data.conversationId);

		return {
			success: true,
			message: "Conversation stopped",
		};
	}

	@TypedSubscribeMessage("utterance:start")
	handleStartUtterance(
		client: AuthenticatedSocket,
		data: RecievedEventData<"utterance:start">,
	): RecievedEventResponse<"utterance:start"> {
		this.logger.log(
			`Utterance started by ${client.data.user.name}: ${data.conversationId}`,
		);

		// Connection already open from conversation:start, nothing to do here

		return {
			success: true,
			message: "Utterance started",
		};
	}

	@TypedSubscribeMessage("utterance:stop")
	async handleStopUtterance(
		client: AuthenticatedSocket,
		data: RecievedEventData<"utterance:stop">,
	): Promise<RecievedEventResponse<"utterance:stop">> {
		this.logger.log(
			`Utterance stopped by ${client.data.user.name}: ${data.conversationId}`,
		);

		// Close Deepgram, get transcript
		const result = await this.vtService.stopUtterance(data.conversationId);

		this.logger.log(`Transcription: ${result.originalText}`);

		return {
			success: true,
			message: "Utterance stopped",
		};
	}

	@TypedSubscribeMessage("audio:speech")
	async handleSpeechAudio(
		_client: AuthenticatedSocket,
		data: RecievedEventData<"audio:speech">,
	): Promise<RecievedEventResponse<"audio:speech">> {
		// Forward chunk to Deepgram (don't buffer)
		this.vtService.processAudioChunk(data.conversationId, data.audioChunk);

		return {
			success: true,
			message: "Audio chunk received",
		};
	}
}
