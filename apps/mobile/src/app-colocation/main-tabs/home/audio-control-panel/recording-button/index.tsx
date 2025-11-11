/** @format */

import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { toast } from "@/components/ui/toast";
import { cn, getErrorMessage } from "@/lib/utils";
import {
	ExpoAudioStreamModule,
	useSharedAudioRecorder,
	type DataPoint,
} from "@siteed/expo-audio-studio";
import { useAudioPlayer } from "expo-audio";
import React from "react";
import { EVENT_EMIT_TIMEOUT } from "../../constants";
import { useConversationRoom } from "../../conversation-room-context";
import type { EventEmitResponse } from "../../types";
import { vtSocket } from "../../vt-socket-manager";
import { WaveCandle } from "../wave-candle";
import {
	AMPLITUDE_MAX,
	CANDLES_CANVAS_HEIGHT,
	HUMAN_VOICE_MAX,
	HUMAN_VOICE_MIN,
	NORMAL_SPEECH_HEIGHT_PROPORTION,
	VISIBLE_CANDLES_COUNT,
} from "./constants";
import { useEmitUtterance } from "./hooks/use-emit-utterance";
import { useStreamSpeech } from "./hooks/use-stream-speech";

type WaveCandleData = Pick<DataPoint, "amplitude" | "id">;

const preRecordingCandleData = [
	{ id: 0, amplitude: 10 },
	{ id: 1, amplitude: 20 },
	{ id: 2, amplitude: 30 },
	{ id: 3, amplitude: 20 },
	{ id: 4, amplitude: 10 },
] satisfies WaveCandleData[] & { length: typeof VISIBLE_CANDLES_COUNT };

export const RecordingButton: React.FC<{ className?: string }> = ({
	className,
}) => {
	const {
		startRecording,
		stopRecording,
		isRecording,
		prepareRecording,
		analysisData,
	} = useSharedAudioRecorder();

	const player = useAudioPlayer();

	useEmitUtterance();

	React.useEffect(() => {
		const prepare = async () => {
			try {
				await prepareRecording({ enableProcessing: true });
			} catch (error) {
				toast.error(
					"Error preparing recording. You might experience some delay when you start recording",
					{
						description: getErrorMessage(error),
						action: (
							<Button onPress={() => void prepare()}>
								<ButtonText>Retry</ButtonText>
							</Button>
						),
					},
				);
			}
		};

		void prepare();
	}, [prepareRecording]);

	const handleSetupPermissions = async () => {
		const { status } =
			await ExpoAudioStreamModule.requestPermissionsAsync();
		if (status !== "granted") {
			toast.error("Audio permissions required to record audio", {
				action: {
					label: "Retry",
					onClick: () => void handleSetupPermissions(),
				},
			});
			return;
		}
		toast.success("permissions granted");
	};

	const { roomId, setRoomId } = useConversationRoom();
	const [isStartingRecording, setIsStartingRecording] = React.useState(false);
	const onSpeechStream = useStreamSpeech();
	const handleStart = async () => {
		const toastId = "start-recording";
		try {
			toast.loading("Starting conversation", {
				id: toastId,
				duration: Infinity,
			});
			setIsStartingRecording(true);
			const { status } =
				await ExpoAudioStreamModule.requestPermissionsAsync();
			if (status !== "granted") {
				await handleSetupPermissions();
			}
			const response = (await vtSocket
				.timeout(EVENT_EMIT_TIMEOUT)
				.emitWithAck(
					"conversation:start",
				)) as EventEmitResponse<"conversation:start">;
			if (!response.success) {
				throw new Error(response.message);
			}

			setRoomId(response.data.conversationId);
			await startRecording({
				enableProcessing: true,
				onAudioStream: async ({ data }) => {
					if (typeof data !== "string") {
						toast.error("speech data not string");
						return;
					}
					await onSpeechStream(data);
				},
			});
			toast.info("Recording started", {
				id: toastId,
			});
			// player.replace(null); This causes an error: https://github.com/expo/expo/issues/39466#issuecomment-3488651453
		} catch (error) {
			toast.error("Unable to start conversation", {
				id: toastId,
				description: getErrorMessage(error),
			});
			console.error(error);
		} finally {
			setIsStartingRecording(false);
		}
	};

	const handlePlayback = () => {
		if (!player.isLoaded) {
			toast.error("No recording present in player");
			return;
		}

		const toastId = "playback-toast";
		player.play();
		toast.info("Recording playing", {
			id: toastId,
			action: {
				label: "Stop",
				onClick: () => {
					player.pause();
					toast.dismiss(toastId);
				},
			},
			onDismiss: () => player.pause(),
			duration: Infinity,
		});
	};

	const handleStop = async () => {
		try {
			if (!roomId) {
				throw new Error("Conversation room in an unexpected state");
			}
			const emitPromise = vtSocket
				.timeout(EVENT_EMIT_TIMEOUT)
				.emitWithAck("conversation:stop", {
					conversationId: roomId,
				}) as Promise<EventEmitResponse<"conversation:stop">>;
			const [recordingResult, emitResponse] = await Promise.all([
				stopRecording(),
				emitPromise,
			]);
			if (!recordingResult) {
				throw new Error("Unable to retrieve recorded audio", {
					cause: recordingResult,
				});
			}
			if (!emitResponse.success) {
				throw new Error(emitResponse.message, {
					cause: emitResponse,
				});
			}

			player.replace(recordingResult.fileUri);
			const toastId = "recording-stopped-toast";
			toast.success("Recording saved", {
				id: toastId,
				action: {
					label: "Play recording",
					onClick: () => {
						handlePlayback();
						toast.dismiss(toastId);
					},
				},
			});
		} catch (error) {
			toast.error("Error occurred stopping conversation", {
				description: getErrorMessage(error),
			});
		}
	};

	const visibleDataPoints = React.useMemo(() => {
		if (!isRecording) {
			return preRecordingCandleData;
		}

		const rawData = analysisData?.dataPoints ?? [];
		const count = rawData.length;

		if (count >= VISIBLE_CANDLES_COUNT) {
			// Slicing from the end ensures the animation always shows the most recent data points.
			return rawData.slice(-VISIBLE_CANDLES_COUNT);
		}

		const paddingCount = VISIBLE_CANDLES_COUNT - count;
		const padding = Array.from(
			{ length: paddingCount },
			(_, index) =>
				({
					id: -(index + 1),
					amplitude: 0,
				}) satisfies WaveCandleData,
		);

		// The padding is prepended to ensure the waveform builds from the right side of the container.
		return [...padding, ...rawData] satisfies WaveCandleData[];
	}, [analysisData?.dataPoints, isRecording]);

	const recordingState: "starting" | "stopped" | "recording" = (() => {
		if (isRecording) {
			return "recording";
		}

		if (isStartingRecording) {
			return "starting";
		}

		return "stopped";
	})();

	return (
		<Button
			ref={(view) => {
				if (view) {
					void handleSetupPermissions;
				}
			}}
			onPressIn={() => {
				if (!isRecording) {
					void handleStart();
				}
			}}
			onPressOut={() => {
				if (isRecording) {
					void handleStop();
				}
			}}
			variant="ghost"
			size="lg"
			className={cn(
				"relative flex aspect-square flex-row items-center justify-center gap-1 rounded-full px-0 data-[active=true]:scale-[0.97]",
				className,
			)}
			style={{
				height: CANDLES_CANVAS_HEIGHT,
				width: CANDLES_CANVAS_HEIGHT,
			}}>
			<Image
				accessibilityLabel="Wave button svg"
				importantForAccessibility="no-hide-descendants"
				source={
					require("@/assets/images/main-tabs/home/wave-btn.png") as number
				}
				size="none"
				className="absolute inset-0"
			/>

			{(() => {
				if (recordingState === "starting") {
					return <ButtonSpinner className="text-typography-0" />;
				}
				return visibleDataPoints.map(({ id, amplitude }) => {
					let scaledAmplitude: number;

					if (isRecording) {
						const clampedCanvasHeight = 0.6 * CANDLES_CANVAS_HEIGHT;
						// Existing human voice scaling logic
						if (amplitude <= HUMAN_VOICE_MAX) {
							scaledAmplitude =
								((amplitude - HUMAN_VOICE_MIN) /
									(HUMAN_VOICE_MAX - HUMAN_VOICE_MIN)) *
								(clampedCanvasHeight *
									NORMAL_SPEECH_HEIGHT_PROPORTION);
						} else {
							const baseHeight =
								clampedCanvasHeight *
								NORMAL_SPEECH_HEIGHT_PROPORTION;
							const extraHeight =
								clampedCanvasHeight *
								(1 - NORMAL_SPEECH_HEIGHT_PROPORTION);
							const logFactor =
								Math.log(amplitude / HUMAN_VOICE_MAX) /
								Math.log(AMPLITUDE_MAX / HUMAN_VOICE_MAX);
							scaledAmplitude =
								baseHeight + extraHeight * logFactor;
						}
					} else {
						scaledAmplitude = amplitude;
					}

					return <WaveCandle key={id} amplitude={scaledAmplitude} />;
				});
			})()}
		</Button>
	);
};
