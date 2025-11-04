/** @format */

import { DRIZZLE_KEY } from "@/drizzle/constants";
import { type DrizzleDB } from "@/drizzle/types";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { AuthenticatedSocket } from "./types";
import { eq } from "drizzle-orm";
import { users } from "@/users/users.schema";
import * as z from "zod";

export class WSAuthGuard implements CanActivate {
	constructor(
		private readonly config: ConfigService,
		private readonly jwtService: JwtService,
		@Inject(DRIZZLE_KEY) private readonly db: DrizzleDB,
	) {}

	async canActivate(context: ExecutionContext) {
		const client: AuthenticatedSocket = context.switchToWs().getClient();
		await this.authenticateConnection(client);
		return true;
	}

	async authenticateConnection(client: AuthenticatedSocket): Promise<void> {
		const accessToken = this.extractTokenFromHandshake(client);
		if (!accessToken) {
			throw new WsException("Authentication failed");
		}

		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const JWT_SECRET = this.config.get("JWT_SECRET");
			if (typeof JWT_SECRET !== "string") {
				throw new Error("JWT_SECRET is invalid", {
					cause: JWT_SECRET,
				});
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const payload = this.jwtService.verify(accessToken, {
				secret: JWT_SECRET,
			});
			const payloadSchema = z.object({ sub: z.number() });
			const payloadValidation = payloadSchema.safeParse(payload);
			if (!payloadValidation.success) {
				throw new Error("Invalid jwt secret or access token.");
			}

			const user = await this.db.query.users.findFirst({
				where: eq(users.id, payloadValidation.data.sub),
			});
			if (!user) {
				throw new WsException("User not found");
			}

			client.data.user = user;
		} catch (error) {
			console.error("Couldn't authenticate ws client", error);
			throw new WsException("Authentication failed");
		}
	}

	private extractTokenFromHandshake(
		client: AuthenticatedSocket,
	): string | null {
		const authObj = client.handshake.auth;
		if (!!authObj && typeof authObj === "object") {
			return authObj.accessToken;
		}
		return null;
	}
}
