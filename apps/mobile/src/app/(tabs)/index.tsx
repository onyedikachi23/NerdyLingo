/** @format */

import { AudioControlPanel } from "@/app-colocation/main-tabs/home/audio-control-panel";
import { TranslationTranscript } from "@/app-colocation/main-tabs/home/translation-transcript";
import { Box } from "@/components/ui/box";

export default function HomeScreen() {
	return (
		<Box className="flex-1 gap-6 px-1 py-4">
			<TranslationTranscript />

			<AudioControlPanel />
		</Box>
	);
}
