/** @format */

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
import { WSAuthGuard } from "./ws-auth-guard";

@WebSocketGateway({
	namespace: "voice-translate",
} satisfies GatewayMetadata)
export class VoiceTranslateGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private readonly wsAuthGuard: WSAuthGuard) {}

	async handleConnection(client: AuthenticatedSocket) {
		try {
			// Manually authenticate since guards don't run on connection
			await this.wsAuthGuard.authenticateConnection(client);
			console.log("client connected", client.data.user.name);
		} catch (error) {
			console.error("Couldn't connect client", error);

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
		console.log("Client disconnected", client.id);
	}

	@TypedSubscribeMessage("conversation:start")
	async handleStartConversation(
		client: AuthenticatedSocket,
	): Promise<RecievedEventResponse<"conversation:start">> {
		console.log("conversation started by client: " + client.data.user.name);

		return {
			success: true,
			message: "Conversation started",
			data: {
				conversationId: "fuckkkk",
			},
		};
	}

	@TypedSubscribeMessage("conversation:stop")
	async handleStopConversation(
		client: AuthenticatedSocket,
		data: RecievedEventData<"conversation:stop">,
	): Promise<RecievedEventResponse<"conversation:stop">> {
		console.log(
			"coversation stopped: ",
			client.data.user.name,
			data.conversationId,
		);
		return {
			success: true,
			message: "Conversation stopped",
		};
	}

	@TypedSubscribeMessage("utterance:start")
	async handleStartUtterance(
		client: AuthenticatedSocket,
		data: RecievedEventData<"utterance:start">,
	): Promise<RecievedEventResponse<"utterance:start">> {
		console.log(
			"Utterance started by client: " + client.data.user.name,
			data.conversationId,
		);
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
		console.log(
			"Utterance stopped by client: " + client.data.user.name,
			data.conversationId,
		);
		return {
			success: true,
			message: "Utterance started",
		};
	}

	@TypedSubscribeMessage("audio:speech")
	async handleSpeechAudio(
		client: AuthenticatedSocket,
		data: RecievedEventData<"audio:speech">,
	): Promise<RecievedEventResponse<"audio:speech">> {
		console.log(
			"Utterance stopped by client: " + client.data.user.name,
			data.conversationId,
		);
		console.log("audio chunk", data.audioChunk);

		return {
			success: true,
			message: "Utterance started",
		};
	}
}
