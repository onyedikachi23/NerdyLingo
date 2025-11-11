/** @format */

import { toast } from "@/components/ui/toast";
import { useEffectEvent } from "@/hooks/use-effect-event";
import { EVENT_EMIT_TIMEOUT } from "../../../constants";
import { useConversationRoom } from "../../../conversation-room-context";
import { vtSocket } from "../../../vt-socket-manager";
import { useAudioControls } from "../../audio-controls-context";

export const useStreamSpeech = () => {
	const { roomId } = useConversationRoom();
	const { utteranceStateRef } = useAudioControls();

	const onSpeaking = useEffectEvent(async (audioChunk: string) => {
		const currentState = utteranceStateRef.current;
		const isSpeaking = currentState === "speaking";

		console.log(
			"[DEBUG] useStreamSpeech guard check:",
			"roomId:",
			roomId,
			"utteranceState:",
			currentState,
			"at",
			new Date().toISOString(),
		);

		if (!(roomId && isSpeaking)) {
			console.log("[DEBUG] useStreamSpeech: Guard blocked audio chunk");
			return;
		}

		console.log(
			"[DEBUG] useStreamSpeech: Guard passed, emitting audio:speech",
		);
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
