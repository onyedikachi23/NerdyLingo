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
import { getErrorMessage } from "@/lib/utils";

export const useEmitUtterance = () => {
	const { analysisData } = useSharedAudioRecorder();
	const { utteranceStateRef } = useAudioControls();

	const { roomId } = useConversationRoom();
	const onDataPointsChange = useEffectEvent(
		async (dataPoints: DataPoint[]) => {
			if (!roomId) {
				return;
			}

			const latestAmplitude = dataPoints.at(-1)?.amplitude ?? 0;
			const currentState = utteranceStateRef.current;

			console.log(
				"[DEBUG] useEmitUtterance analyzing:",
				"latestAmplitude:",
				latestAmplitude,
				"threshold:",
				UTTERANCE_THRESHOLD,
				"utteranceState:",
				currentState,
				"at",
				new Date().toISOString(),
			);

			// Utterance START detection
			const isIdle = currentState === "idle";
			const amplitudeAboveThreshold = latestAmplitude > UTTERANCE_THRESHOLD;

			if (isIdle && amplitudeAboveThreshold) {
				console.log(
					"[DEBUG] useEmitUtterance: Utterance START detected, emitting utterance:start",
				);
				toast.info("Start speaking", {
					id: "start-speaking",
				});

				// Set state to 'starting' to prevent duplicate emissions
				utteranceStateRef.current = "starting";

				try {
					const response = await vtSocket
						.timeout(EVENT_EMIT_TIMEOUT)
						.emitWithAck("utterance:start", {
							conversationId: roomId,
						});

					if (!response.success) {
						throw new Error(response.message, { cause: response });
					}

					// Only set to 'speaking' AFTER server confirms
					console.log(
						"[DEBUG] useEmitUtterance: utterance:start confirmed by server, state = speaking",
					);
					utteranceStateRef.current = "speaking";
				} catch (error) {
					console.error(
						"[DEBUG] useEmitUtterance: utterance:start failed:",
						error,
					);
					toast.error("Failed to start utterance", {
						description: getErrorMessage(error),
					});
					// Rollback to idle on error
					utteranceStateRef.current = "idle";
				}
				return;
			}

			// Utterance STOP detection (Silence Window)
			const isSpeaking = currentState === "speaking";
			const amplitudeBelowThreshold = latestAmplitude < UTTERANCE_THRESHOLD;

			if (isSpeaking && amplitudeBelowThreshold) {
				// Check the last N data points for silence
				const recentData = dataPoints.slice(-SILENCE_WINDOW_COUNT);
				const isSilentWindow =
					recentData.length === SILENCE_WINDOW_COUNT &&
					recentData.every(
						(point) => point.amplitude < UTTERANCE_THRESHOLD,
					);

				if (isSilentWindow) {
					console.log(
						"[DEBUG] useEmitUtterance: Utterance STOP detected, emitting utterance:stop",
					);
					toast.info("Stop speaking", {
						id: "stop-speaking",
					});

					// Set state to 'stopping' to prevent duplicate emissions
					utteranceStateRef.current = "stopping";

					try {
						const response = await vtSocket
							.timeout(EVENT_EMIT_TIMEOUT)
							.emitWithAck("utterance:stop", {
								conversationId: roomId,
							});

						if (!response.success) {
							throw new Error(response.message, { cause: response });
						}

						// Only set to 'idle' AFTER server confirms
						console.log(
							"[DEBUG] useEmitUtterance: utterance:stop confirmed by server, state = idle",
						);
						utteranceStateRef.current = "idle";
					} catch (error) {
						console.error(
							"[DEBUG] useEmitUtterance: utterance:stop failed:",
							error,
						);
						toast.error("Failed to stop utterance", {
							description: getErrorMessage(error),
						});
						// Rollback to speaking on error
						utteranceStateRef.current = "speaking";
					}
				}
			}
		},
	);
	React.useEffect(() => {
		void onDataPointsChange(analysisData?.dataPoints ?? []);
	}, [analysisData?.dataPoints, onDataPointsChange]);
};
