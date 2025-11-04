/** @format */

import { User } from "@/users/users.schema";
import {
	ClientToServerEvents,
	CTSEventData,
	CTSEventResponse,
	ServerToClientEvents,
} from "@repo/shared";
import { Socket } from "socket.io";

type Handshake = Socket["handshake"];
interface AuthHandShake extends Handshake {
	auth: {
		accessToken: string;
	};
}

interface AuthenticatedSocket
	extends Socket<ClientToServerEvents, ServerToClientEvents> {
	data: {
		user: User;
	};
	handshake: AuthHandShake;
}

type RecievedEventResponse<E extends keyof ClientToServerEvents> =
	CTSEventResponse<E> extends infer R
		? [R] extends [never]
			? void
			: R
		: void;

type RecievedEventData<E extends keyof ClientToServerEvents> = CTSEventData<E>;

export type { AuthenticatedSocket, RecievedEventData, RecievedEventResponse };
