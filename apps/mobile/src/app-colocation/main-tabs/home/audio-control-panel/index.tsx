/** @format */

import { Box } from "@/components/ui/box";
import { cn } from "@/lib/utils";
import { AudioRecorderProvider } from "@siteed/expo-audio-studio";
import type React from "react";
import { RecordingButton } from "./recording-button";

export const AudioControlPanel: React.FC<{ className?: string }> = ({
	className,
}) => {
	return (
		<AudioRecorderProvider>
			<Box className={cn("flex-row justify-center", className)}>
				<RecordingButton />
			</Box>
		</AudioRecorderProvider>
	);
};
