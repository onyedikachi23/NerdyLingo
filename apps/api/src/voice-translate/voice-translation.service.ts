/** @format */

import { Injectable } from "@nestjs/common";
import { AudioBufferService } from "./audio-buffer.service";
import { DeepgramService } from "./providers/deepgram.service";

@Injectable()
export class VoiceTranslationService {
	constructor(
		private readonly audioBufferService: AudioBufferService,
		private readonly deepgramService: DeepgramService,
	) {}

	appendAudioChunk(conversationId: string, audioChunk: string): void {
		this.audioBufferService.appendChunk(conversationId, audioChunk);
	}

	clearBuffer(conversationId: string): void {
		this.audioBufferService.clearBuffer(conversationId);
	}

	async processUtterance(conversationId: string) {
		const audioBuffer =
			this.audioBufferService.getFullAudio(conversationId);

		// Call Deepgram STT
		const originalText = await this.deepgramService.transcribe(audioBuffer);

		// TODO: Call DeepL translation
		// TODO: Call Deepgram TTS

		this.audioBufferService.clearBuffer(conversationId);

		return {
			originalText,
			translatedText: "TODO: Implement translation",
		};
	}

	async startUtterance(conversationId: string): Promise<void> {
		await this.deepgramService.startLiveTranscription(conversationId);
	}

	processAudioChunk(conversationId: string, audioChunk: string): void {
		this.deepgramService.sendAudioChunk(conversationId, audioChunk);
	}

	async stopUtterance(
		conversationId: string,
	): Promise<{ originalText: string; translatedText: string }> {
		const originalText =
			await this.deepgramService.stopLiveTranscription(conversationId);

		// TODO: Call DeepL translation
		// TODO: Call Deepgram TTS

		return {
			originalText,
			translatedText: "TODO: Implement translation",
		};
	}
}
