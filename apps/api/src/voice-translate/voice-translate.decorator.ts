/** @format */

import { SubscribeMessage } from "@nestjs/websockets";
import { ClientToServerEvents } from "@repo/shared";

type ClientToServerEvent = keyof ClientToServerEvents;
/**
 * Custom decorator that wraps {@link SubscribeMessage} to provide type-checking
 * for the event name against the defined SocketEvent types.
 */
export const TypedSubscribeMessage = (event: ClientToServerEvent) => {
	return SubscribeMessage(event);
};
