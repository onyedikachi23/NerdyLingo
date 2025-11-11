/** @format */

import { Injectable } from "@nestjs/common";

@Injectable()
export class AudioBufferService {
	private readonly buffers = new Map<string, string[]>();

	appendChunk(conversationId: string, base64Chunk: string): void {
		if (!this.buffers.has(conversationId)) {
			this.buffers.set(conversationId, []);
		}
		this.buffers.get(conversationId)!.push(base64Chunk);
	}

	getFullAudio(conversationId: string): Buffer {
		const chunks = this.buffers.get(conversationId) || [];
		const audioBuffers = chunks.map((chunk) => Buffer.from(chunk, "base64"));
		return Buffer.concat(audioBuffers);
	}

	clearBuffer(conversationId: string): void {
		this.buffers.delete(conversationId);
	}
}
