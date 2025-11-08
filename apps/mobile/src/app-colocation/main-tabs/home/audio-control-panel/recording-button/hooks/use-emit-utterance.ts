/** @format */

import {
	useSharedAudioRecorder,
	type DataPoint,
} from "@siteed/expo-audio-studio";
import React from "react";
import { SILENCE_WINDOW_COUNT, UTTERANCE_THRESHOLD } from "../constants";
import { useEffectEvent } from "@/hooks/use-effect-event";
import { useConversationRoom } from "../../../conversation-room-context";
import { vtSocket } from "../../../vt-socket-manager";
import { EVENT_EMIT_TIMEOUT } from "../../../constants";
import { useAudioControls } from "../../audio-controls-context";
import { toast } from "@/components/ui/toast";

export const useEmitUtterance = () => {
	const { analysisData } = useSharedAudioRecorder();
	const { isParticipantSpeaking, setIsParticipantSpeaking } =
		useAudioControls();

	const { roomId } = useConversationRoom();
	const onDataPointsChange = useEffectEvent(
		async (dataPoints: DataPoint[]) => {
			if (!roomId) {
				return;
			}

			const latestAmplitude = dataPoints.at(-1)?.amplitude ?? 0;

			// Utterance START detection
			if (
				!isParticipantSpeaking &&
				latestAmplitude > UTTERANCE_THRESHOLD
			) {
				toast.info("Start speaking", {
					id: "start-speaking",
				});
				// Speech detected
				setIsParticipantSpeaking(true);

				await vtSocket
					.timeout(EVENT_EMIT_TIMEOUT)
					.emitWithAck("utterance:start", {
						conversationId: roomId,
					});
				return;
			}

			// Utterance STOP detection (Silence Window)
			if (
				isParticipantSpeaking &&
				latestAmplitude < UTTERANCE_THRESHOLD
			) {
				// Check the last N data points for silence
				const recentData = dataPoints.slice(-SILENCE_WINDOW_COUNT);
				const isSilentWindow =
					recentData.length === SILENCE_WINDOW_COUNT &&
					recentData.every(
						(point) => point.amplitude < UTTERANCE_THRESHOLD,
					);

				if (isSilentWindow) {
					toast.info("Stop speaking", {
						id: "stop-speaking",
					});
					// Utterance stopped
					setIsParticipantSpeaking(false);

					await vtSocket
						.timeout(EVENT_EMIT_TIMEOUT)
						.emitWithAck("utterance:stop", {
							conversationId: roomId,
						});
				}
			}
		},
	);
	React.useEffect(() => {
		void onDataPointsChange(analysisData?.dataPoints ?? []);
	}, [analysisData?.dataPoints, onDataPointsChange]);
};
