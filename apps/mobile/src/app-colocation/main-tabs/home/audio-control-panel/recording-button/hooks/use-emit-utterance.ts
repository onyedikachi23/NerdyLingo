/** @format */

import {
	useSharedAudioRecorder,
	type DataPoint,
} from "@siteed/expo-audio-studio";
import React from "react";
import { SILENCE_WINDOW_COUNT, UTTERANCE_THRESHOLD } from "../constants";
import { toast } from "@/components/ui/toast";
import { useEffectEvent } from "@/hooks/use-effect-event";
import { useConversationRoom } from "../../../conversation-room-context";
import { vtSocket } from "../../../vt-socket-manager";
import { EVENT_EMIT_TIMEOUT } from "../../../constants";

export const useEmitUtterance = () => {
	const { isRecording, analysisData } = useSharedAudioRecorder();

	const isUtteringRef = React.useRef(false);

	const { roomId } = useConversationRoom();
	const onDataPointsChange = useEffectEvent(
		async (dataPoints: DataPoint[]) => {
			if (!roomId) {
				toast.error("Room not ready to emit utternace");
				return;
			}

			const latestAmplitude = dataPoints.at(-1)?.amplitude ?? 0;

			// Utterance START detection
			if (
				!isUtteringRef.current &&
				latestAmplitude > UTTERANCE_THRESHOLD
			) {
				// Speech detected
				isUtteringRef.current = true;
				toast.info("Is uttering");
				await vtSocket
					.timeout(EVENT_EMIT_TIMEOUT)
					.emitWithAck("utterance:start", {
						conversationId: roomId,
					});
				return;
			}

			// Utterance STOP detection (Silence Window)
			if (
				isUtteringRef.current &&
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
					// Utterance stopped
					isUtteringRef.current = false;
					toast.info("Utterance stopped");
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
		// toast.info("Data points changed");
		if (!isRecording || !analysisData?.dataPoints.length) {
			return;
		}

		void onDataPointsChange(analysisData.dataPoints);
	}, [analysisData?.dataPoints, isRecording, onDataPointsChange]);
};
