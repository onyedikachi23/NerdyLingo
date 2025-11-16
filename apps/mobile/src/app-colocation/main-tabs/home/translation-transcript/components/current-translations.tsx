/** @format */

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export const CurrentTranslations = () => {
	return (
		<Box>
			<Box>
				<Text size="sm" className="text-primary-500">
					Respondent:{" "}
				</Text>
				<Text size="lg" bold className="text-primary-500">
					I have always dreamed of visiting Brazil! I hear the beaches
					are beautiful.
				</Text>
			</Box>

			<Box className="items-end">
				<Text size="sm">You: </Text>
				<Text size="lg" bold>
					Yes, the beaches are incredible! Do you like to surf or
					prefer to relax on the sand?
				</Text>
			</Box>
		</Box>
	);
};
