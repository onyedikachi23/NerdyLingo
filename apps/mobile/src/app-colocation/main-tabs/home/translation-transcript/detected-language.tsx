/** @format */

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type React from "react";

interface DetectedLanguageProps {
	className?: string;
}
export const DetectedLanguage: React.FC<DetectedLanguageProps> = ({
	className,
}) => {
	return (
		<Box className={cn("gap-1", className)}>
			<Text size="sm">Detected Language:</Text>
			<Heading>Spanish</Heading>
		</Box>
	);
};
