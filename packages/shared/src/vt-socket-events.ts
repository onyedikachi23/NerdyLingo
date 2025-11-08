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
	"conversation:stop": (
		data: { conversationId: string },
		callback: (response: ApiSuccessResponse | ApiErrorResponse) => void
	) => void;
	"utterance:start": (
		data: {
			conversationId: string;
		},
		callback: (response: ApiSuccessResponse | ApiErrorResponse) => void
	) => void;
	"utterance:stop": (
		data: {
			conversationId: string;
		},
		callback: (response: ApiSuccessResponse | ApiErrorResponse) => void
	) => void;
	"audio:speech": (
		data: {
			conversationId: string;
			/**A base64 string */
			audioChunk: string;
		},
		callback: (response: ApiSuccessResponse | ApiErrorResponse) => void
	) => void;
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
