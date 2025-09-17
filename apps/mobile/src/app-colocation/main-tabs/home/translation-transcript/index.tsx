/** @format */

import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { DetectedLanguage } from "./detected-language";
import { PrevTranslations } from "./previous-translations";
import { CurrentTranslations } from "./current-translations";
import { ScrollView } from "react-native";

export const TranslationTranscript = () => {
	return (
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

			<Box className="flex-1 p-8">
				<DetectedLanguage />
				<ScrollView
					className="flex-1"
					contentContainerClassName="gap-8"
					showsVerticalScrollIndicator={false}>
					<PrevTranslations />
					<CurrentTranslations />
				</ScrollView>
			</Box>
		</Box>
	);
};
