/** @format */

import { Box } from "@/components/ui/box";
import { cn } from "@/lib/utils";
import { AudioRecorderProvider } from "@siteed/expo-audio-studio";
import type React from "react";
import { MicAndVolumeDropdown } from "./mic-and-volume-dropdown";
import { ModesDropdown } from "./modes-dropdown";
import { RecordingButton } from "./recording-button";
import { AudioControlsProvider } from "./audio-controls-context";

export const AudioControlPanel: React.FC<{ className?: string }> = ({
	className,
}) => {
	return (
		<AudioRecorderProvider>
			<AudioControlsProvider>
				<Box
					className={cn(
						"flex-row items-end justify-center",
						className,
					)}>
					<MicAndVolumeDropdown />
					<RecordingButton className="self-center" />
					<ModesDropdown />
				</Box>
			</AudioControlsProvider>
		</AudioRecorderProvider>
	);
};
