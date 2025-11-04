/** @format */

import { Module } from "@nestjs/common";
import { VoiceTranslateGateway } from "./voice-translate.gateway";
import { WSAuthGuard } from "./ws-auth-guard";
import { DrizzleModule } from "@/drizzle/drizzle.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [DrizzleModule, ConfigModule, JwtModule],
	providers: [VoiceTranslateGateway, WSAuthGuard],
})
export class VoiceTranslateModule {}
