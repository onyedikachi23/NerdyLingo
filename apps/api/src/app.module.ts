/** @format */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { VoiceTranslateModule } from './voice-translate/voice-translate.module';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		DrizzleModule,
		ConfigModule.forRoot({
			envFilePath: [".env", ".env.local"],
		}),
		VoiceTranslateModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
