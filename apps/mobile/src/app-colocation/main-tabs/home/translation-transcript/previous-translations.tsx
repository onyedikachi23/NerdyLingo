/** @format */

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const FadedText: typeof Text = ({ className, ...props }) => (
	<Text
		{...props}
		className={cn("opacity-20 active:opacity-50", className)}
	/>
);

export const PrevTranslations = () => {
	return (
		<Box>
			<Box>
				<FadedText size="sm">Respondent: </FadedText>
				<FadedText size="lg" bold>
					I&apos;m fine, thank you. Where do you live?
				</FadedText>
			</Box>

			<Box className="items-end">
				<FadedText size="sm">You: </FadedText>
				<FadedText size="lg" bold>
					I live in Brazil, and you?
				</FadedText>
			</Box>
		</Box>
	);
};
