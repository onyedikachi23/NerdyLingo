/** @format */

import { Module } from "@nestjs/common";
import { VoiceTranslateGateway } from "./voice-translate.gateway";
import { WSAuthGuard } from "./ws-auth-guard";
import { AudioBufferService } from "./audio-buffer.service";
import { VoiceTranslationService } from "./voice-translation.service";
import { DeepgramService } from "./providers/deepgram.service";
import { DrizzleModule } from "@/drizzle/drizzle.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [DrizzleModule, ConfigModule, JwtModule],
	providers: [
		VoiceTranslateGateway,
		WSAuthGuard,
		AudioBufferService,
		VoiceTranslationService,
		DeepgramService,
	],
})
export class VoiceTranslateModule {}
