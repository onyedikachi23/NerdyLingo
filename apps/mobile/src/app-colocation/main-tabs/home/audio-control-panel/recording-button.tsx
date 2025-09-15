/** @format */

import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/utils";
import {
	ExpoAudioStreamModule,
	useSharedAudioRecorder,
	type DataPoint,
} from "@siteed/expo-audio-studio";
import { useAudioPlayer } from "expo-audio";
import React from "react";
import { WaveCandle } from "./wave-candle";

type WaveCandleData = Pick<DataPoint, "amplitude" | "id">;

const VISIBLE_CANDLES_COUNT = 5;
// Define reference values for human voice range
const HUMAN_VOICE_MIN = 0.01; // Adjust based on your typical minimum amplitude for speech
const HUMAN_VOICE_MAX = 0.2; // Maximum amplitude for normal speech
const ABSOLUTE_MAX = 0.8; // Maximum possible amplitude

// Define the proportion of canvas height for normal speech
const NORMAL_SPEECH_HEIGHT_PROPORTION = 0.95; // 95% of canvas height for normal speech
const CANVAS_HEIGHT = 100;

const preRecordingCandleData = [
	{ id: 0, amplitude: 10 },
	{ id: 1, amplitude: 20 },
	{ id: 2, amplitude: 30 },
	{ id: 3, amplitude: 20 },
	{ id: 4, amplitude: 10 },
] satisfies WaveCandleData[] & { length: typeof VISIBLE_CANDLES_COUNT };

export const RecordingButton = () => {
	const {
		startRecording,
		stopRecording,
		isRecording,
		prepareRecording,
		analysisData,
	} = useSharedAudioRecorder();

	const player = useAudioPlayer();

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

	const handleStart = async () => {
		const { status } =
			await ExpoAudioStreamModule.requestPermissionsAsync();
		if (status !== "granted") {
			await handleSetupPermissions();
		}
		await startRecording({ enableProcessing: true });
		toast.info("Recording started");
		player.replace(null);
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
		const result = await stopRecording();
		if (!result) {
			toast.error("Unable to retrieve recorded audio");
			player.replace(null);
			return;
		}

		player.replace(result.fileUri);
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
			className="relative flex aspect-square flex-row items-center justify-center gap-1 rounded-full px-0 data-[active=true]:scale-[0.97]"
			style={{ height: CANVAS_HEIGHT, width: CANVAS_HEIGHT }}>
			<Image
				accessibilityLabel="Wave button svg"
				importantForAccessibility="no-hide-descendants"
				source={
					require("@/assets/images/main-tabs/home/wave-btn.png") as number
				}
				size="none"
				className="absolute inset-0"
			/>

			{visibleDataPoints.map(({ id, amplitude }) => {
				let scaledAmplitude: number;

				if (isRecording) {
					const clampedCanvasHeight = 0.6 * CANVAS_HEIGHT;
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
							Math.log(ABSOLUTE_MAX / HUMAN_VOICE_MAX);
						scaledAmplitude = baseHeight + extraHeight * logFactor;
					}
				} else {
					scaledAmplitude = amplitude;
				}

				return <WaveCandle key={id} amplitude={scaledAmplitude} />;
			})}
		</Button>
	);
};
