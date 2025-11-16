/** @format */

import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { DetectedLanguage } from "./components/detected-language";
import { PrevTranslations } from "./components/previous-translations";
import { CurrentTranslations } from "./components/current-translations";
import { ScrollView } from "react-native";
import { useListenForUtteranceResult } from "./hooks/use-listen-for-utterance-result";

export const TranslationTranscript = () => {
	useListenForUtteranceResult();
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
