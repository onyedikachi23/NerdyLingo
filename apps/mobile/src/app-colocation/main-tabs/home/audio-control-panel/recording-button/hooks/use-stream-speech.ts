/** @format */

import React from "react";
import { useConversationRoom } from "../../../conversation-room-context";
import { vtSocket } from "../../../vt-socket-manager";
import { EVENT_EMIT_TIMEOUT } from "../../../constants";
import { toast } from "@/components/ui/toast";
import { useAudioControls } from "../../audio-controls-context";
import { useEffectEvent } from "@/hooks/use-effect-event";

export const useStreamSpeech = () => {
	const { roomId } = useConversationRoom();
	const { isParticipantSpeaking } = useAudioControls();

	// useEffectEvent solves the issue of isParticipantSpeaking being stale
	const onSpeaking = useEffectEvent(async (audioChunk: string) => {
		if (!(roomId && isParticipantSpeaking)) {
			return;
		}

		toast.info("Streaming speech", {
			id: "speech-stream",
		});
		await vtSocket.timeout(EVENT_EMIT_TIMEOUT).emitWithAck("audio:speech", {
			conversationId: roomId,
			audioChunk,
		});
	});

	return onSpeaking;
};
