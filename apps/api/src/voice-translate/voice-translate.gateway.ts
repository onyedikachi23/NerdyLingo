/** @format */

import { Logger } from "@nestjs/common";
import {
	GatewayMetadata,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
} from "@nestjs/websockets";

import type {
	AuthenticatedSocket,
	RecievedEventData,
	RecievedEventResponse,
} from "./types";
import { TypedSubscribeMessage } from "./voice-translate.decorator";
import { VoiceTranslationService } from "./voice-translation.service";
import { WSAuthGuard } from "./ws-auth-guard";
import { randomUUID } from "crypto";

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

		// Start Deepgram connection for this conversation
		const { id: conversationId } = await this.vtService.startConversation(
			client.data.user.id,
		);

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
		const finalUtterance = await this.vtService.stopConversation(
			data.conversationId,
		);
		if (finalUtterance) {
			client.emit("utterance:result", finalUtterance);
		}

		return {
			success: true,
			message: "Conversation stopped",
		};
	}

	@TypedSubscribeMessage("utterance:start")
	handleStartUtterance(
		_client: AuthenticatedSocket,
		data: RecievedEventData<"utterance:start">,
	): RecievedEventResponse<"utterance:start"> {
		const utteranceId = randomUUID();
		this.logger.log(`Utterance started: ${utteranceId}`);

		this.vtService.startUtterance(data.conversationId, utteranceId);

		return {
			success: true,
			message: "Utterance started",
			data: {
				utteranceId,
			},
		};
	}

	@TypedSubscribeMessage("utterance:stop")
	async handleStopUtterance(
		client: AuthenticatedSocket,
		{ conversationId, utteranceId }: RecievedEventData<"utterance:stop">,
	): Promise<RecievedEventResponse<"utterance:stop">> {
		this.logger.log(
			`Utterance stopped by ${client.data.user.name}: ${conversationId}`,
		);

		// Close Deepgram, get transcript
		const result = await this.vtService.stopUtterance(
			conversationId,
			utteranceId,
		);

		this.logger.log(`Transcription: ${result.sourceText}`);

		client.emit("utterance:result", result);

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
