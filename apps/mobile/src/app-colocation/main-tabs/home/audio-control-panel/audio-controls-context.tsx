/** @format */

import React from "react";

export type UtteranceState = "idle" | "starting" | "speaking" | "stopping";

interface AudioControlsContextType {
	utteranceStateRef: React.MutableRefObject<UtteranceState>;
}

const AudioControlsContext =
	React.createContext<AudioControlsContextType | null>(null);

const AudioControlsProvider = ({
	children,
	roomId,
}: {
	children?: React.ReactNode;
	roomId: string | null;
}) => {
	// Use ref for internal control state - no re-renders needed
	const utteranceStateRef = React.useRef<UtteranceState>("idle");

	// Reset state when conversation ends (roomId cleared)
	React.useEffect(() => {
		if (!roomId) {
			console.log("[DEBUG] Conversation ended, resetting utterance state to idle");
			utteranceStateRef.current = "idle";
		}
	}, [roomId]);

	const ctxValue: AudioControlsContextType = React.useMemo(
		() => ({ utteranceStateRef }),
		[],
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
