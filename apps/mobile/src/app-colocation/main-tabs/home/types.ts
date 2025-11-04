/** @format */

import type { ClientToServerEvents, CTSEventResponse } from "@repo/shared";

type EventEmitResponse<E extends keyof ClientToServerEvents> =
	CTSEventResponse<E>;

export type { EventEmitResponse };
