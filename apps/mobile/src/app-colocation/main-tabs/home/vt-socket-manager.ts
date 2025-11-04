/** @format */

import type { ClientToServerEvents, ServerToClientEvents } from "@repo/shared";
import { io, Socket } from "socket.io-client";
import * as z from "zod";

const baseApiURL = z
	.url({ error: "EXPO_PUBLIC_API_URL env is invalid" })
	.parse(process.env.EXPO_PUBLIC_API_URL);

interface VTSocket extends Socket<ServerToClientEvents, ClientToServerEvents> {
	auth: {
		accessToken: string;
	};
}

const vtSocket = io(baseApiURL + "/voice-translate", {
	autoConnect: false,
}) as VTSocket;

export { vtSocket };
