/** @format */

import { useSharedAudioRecorder } from "@siteed/expo-audio-studio";
import React from "react";

interface AudioControlsContextType {
	isParticipantSpeaking: boolean;
	setIsParticipantSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
}

const AudioControlsContext =
	React.createContext<AudioControlsContextType | null>(null);

const AudioControlsProvider = ({
	children,
}: {
	children?: React.ReactNode;
}) => {
	const [isSpeaking, setIsParticipantSpeaking] = React.useState(false);

	const { isRecording } = useSharedAudioRecorder();
	const isParticipantSpeaking = isRecording ? isSpeaking : false;

	const ctxValue: AudioControlsContextType = React.useMemo(
		() => ({ isParticipantSpeaking, setIsParticipantSpeaking }),
		[isParticipantSpeaking],
	);

	return (
		<AudioControlsContext value={ctxValue}>{children}</AudioControlsContext>
	);
};

const useAudioControls = () => {
	const ctx = React.use(AudioControlsContext);
	if (!ctx) {
		throw new Error(
			"useAudioControls must be used within an AudioControlsProvider",
		);
	}
	return ctx;
};

export {
	AudioControlsProvider,
	useAudioControls,
	type AudioControlsContextType,
};
