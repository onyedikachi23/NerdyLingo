/** @format */

import type {
	ClientToServerEvents,
	CTSEventResponse,
	ServerToClientEvents,
	STCEventData,
} from "@repo/shared";

type EmittedEventResponse<E extends keyof ClientToServerEvents> =
	CTSEventResponse<E>;

type ReceivedEventData<E extends keyof ServerToClientEvents> = STCEventData<E>;

export type { EmittedEventResponse, ReceivedEventData };
