/** @format */

import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import jwtConfig from "./config/jwt.config";
import { JwtStrategy } from "./jwt.strategy";

@Module({
	providers: [AuthService, JwtStrategy],
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.registerAsync(jwtConfig.asProvider()),
	],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
