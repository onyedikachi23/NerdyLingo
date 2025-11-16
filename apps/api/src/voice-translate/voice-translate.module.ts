/** @format */

import { DrizzleModule } from "@/drizzle/drizzle.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { DeepgramService } from "./providers/deepgram.service";
import { VoiceTranslateGateway } from "./voice-translate.gateway";
import { VoiceTranslationService } from "./voice-translation.service";
import { WSAuthGuard } from "./ws-auth-guard";

@Module({
	imports: [DrizzleModule, ConfigModule, JwtModule],
	providers: [
		VoiceTranslateGateway,
		WSAuthGuard,
		VoiceTranslationService,
		DeepgramService,
	],
})
export class VoiceTranslateModule {}
