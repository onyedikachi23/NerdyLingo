/** @format */

import { DRIZZLE_KEY } from "@/drizzle/constants";
import type { DrizzleDB } from "@/drizzle/types";
import { User } from "@/users/users.schema";
import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { DeepgramService } from "./providers/deepgram.service";
import {
	Conversation,
	conversations,
	Utterance,
	utterances,
} from "./voice-translate.schema";

@Injectable()
export class VoiceTranslationService {
	constructor(
		private readonly deepgramService: DeepgramService,
		@Inject(DRIZZLE_KEY) private readonly db: DrizzleDB,
	) {}

	async startConversation(userId: User["id"]): Promise<Conversation> {
		const conversationId = randomUUID();
		await this.deepgramService.startLiveTranscription(conversationId);
		const [newConversation] = await this.db
			.insert(conversations)
			.values({ id: conversationId, userId })
			.returning();

		if (!newConversation) {
			throw new Error("Couldn't create conversation in to the database");
		}
		return newConversation;
	}

	processAudioChunk(conversationId: string, audioChunk: string): void {
		this.deepgramService.sendAudioChunk(conversationId, audioChunk);
	}

	startUtterance(conversationId: string, utteranceId: string): void {
		this.deepgramService.startUtterance(conversationId, utteranceId);
	}

	async stopUtterance(
		conversationId: string,
		utteranceId: string,
	): Promise<Utterance> {
		const sourceText = await this.deepgramService.finalizeUtterance(
			conversationId,
			utteranceId,
		);

		void this.db
			.insert(utterances)
			.values({
				conversationId,
				speaker: "user", // TODO: Add speaker detection
				sourceText,
				translatedText: "TODO: Implement translation",
			})
			.returning()
			.then((result) => {
				const [newUtterance] = result;
				if (!newUtterance) {
					throw new Error("Couldn't save utterance to database");
				}
			});

		// TODO: Call DeepL translation
		// TODO: Call Deepgram TTS

		return {
			id: randomUUID(),
			conversationId,
			speaker: "user",
			createdAt: new Date().toISOString(),
			sourceText,
			translatedText: "Coming soon",
		};
	}

	async stopConversation(conversationId: string): Promise<Utterance | null> {
		let finalUtterance: Utterance | null = null;
		const currentUtteranceId =
			this.deepgramService.getCurrentUtteranceId(conversationId);
		if (currentUtteranceId) {
			finalUtterance = await this.stopUtterance(
				conversationId,
				currentUtteranceId,
			);
		}

		await this.deepgramService.closeConnection(conversationId);
		return finalUtterance;
	}
}
