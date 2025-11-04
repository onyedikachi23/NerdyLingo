/** @format */

import { ApiErrorResponse, ApiSuccessResponse } from "../index.js";

interface ClientToServerEvents {
	"conversation:start": (
		callback: (
			response:
				| ApiSuccessResponse<{ data: { conversationId: string } }>
				| ApiErrorResponse
		) => void
	) => void;
	"conversation:stop": (data: { conversationId: string }) => void;
}

type CTSEventResponse<E extends keyof ClientToServerEvents> =
	ClientToServerEvents[E] extends (...args: infer Args) => void
		? Args extends [
				...rest: unknown[],
				callback: (response: infer Response) => void,
			]
			? Response
			: never
		: never;

type CTSEventData<E extends keyof ClientToServerEvents> =
	ClientToServerEvents[E] extends (...args: infer Args) => void
		? Args extends [data: infer Data, ...rest: unknown[]]
			? Data
			: never
		: never;

interface ServerToClientEvents {
	"utterance:result": () => void;
	error: (data: ApiErrorResponse) => void;
}

export type {
	ClientToServerEvents,
	ServerToClientEvents,
	CTSEventData,
	CTSEventResponse,
};
