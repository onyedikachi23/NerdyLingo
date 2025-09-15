/** @format */

import { AudioControlPanel } from "@/app-colocation/main-tabs/home/audio-control-panel";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";

export default function HomeScreen() {
	return (
		<Box className="flex-1 gap-6 p-1">
			<Box className="relative flex-1">
				<Image
					importantForAccessibility="no-hide-descendants"
					accessibilityLabel="translation background"
					source={
						require("@/assets/images/main-tabs/home/translation-bg.png") as number
					}
					size="none"
					className="absolute inset-0"
				/>
			</Box>

			{/* control panel */}
			<AudioControlPanel />
		</Box>
	);
}
