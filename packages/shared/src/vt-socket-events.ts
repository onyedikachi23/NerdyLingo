/** @format */

import type { ApiErrorResponse, ApiSuccessResponse } from "../index.js";
import type { Utterance } from "api/src/voice-translate/voice-translate.schema.js";

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
		callback: (
			response:
				| ApiSuccessResponse<{ data: { utteranceId: string } }>
				| ApiErrorResponse
		) => void
	) => void;
	"utterance:stop": (
		data: {
			conversationId: string;
			utteranceId: string;
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
	"utterance:result": (data: Utterance) => void;
	error: (data: ApiErrorResponse) => void;
}

type STCEventData<E extends keyof ServerToClientEvents> =
	ServerToClientEvents[E] extends (data: infer Data) => void ? Data : never;

export type {
	ClientToServerEvents,
	CTSEventData,
	CTSEventResponse,
	ServerToClientEvents,
	STCEventData,
};
