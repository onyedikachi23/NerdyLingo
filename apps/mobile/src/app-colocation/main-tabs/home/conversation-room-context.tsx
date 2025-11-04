/** @format */

import React from "react";
import { EVENT_EMIT_TIMEOUT } from "./constants";
import { vtSocket } from "./vt-socket-manager";

type ConversationRoomId = string | null;

interface ConversationRoomContextType {
	/**
	 * Separates the user's intended `chatId` from the server-confirmed
	 * `chatId` (state). This decouples UI intent from network reality,
	 * ensuring listeners activate only after the asynchronous Socket.IO ACK
	 * confirms the room switch is complete.
	 */
	roomId: ConversationRoomId;
	setRoomId: React.Dispatch<React.SetStateAction<ConversationRoomId>>;
}

const ConversationRoomContext =
	React.createContext<ConversationRoomContextType | null>(null);

export const ConversationRoomProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [roomId, setRoomId] = React.useState<ConversationRoomId>(null);

	React.useEffect(() => {
		return () => {
			if (roomId) {
				vtSocket
					.timeout(EVENT_EMIT_TIMEOUT)
					.emit("conversation:stop", { conversationId: roomId });
			}
		};
	}, [roomId]);

	const ctxValue: ConversationRoomContextType = React.useMemo(
		() => ({ roomId, setRoomId }),
		[roomId],
	);

	return (
		<ConversationRoomContext value={ctxValue}>
			{children}
		</ConversationRoomContext>
	);
};

export const useConversationRoom = () => {
	const ctx = React.use(ConversationRoomContext);
	if (!ctx) {
		throw new Error(
			"useConversationRoom must be used within a ConversationRoomProvider.",
		);
	}
	return ctx;
};
