/** @format */

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const AuthOptionsScreen: typeof Box = ({ className, ...props }) => (
	<Box {...props} className={cn("flex-1 gap-12", className)} />
);

const AuthOptionsHeading: typeof Heading = ({ className, ...props }) => (
	<Heading {...props} className={cn("text-center", className)} />
);

const AuthOptionButton: typeof Button = ({ className, ...props }) => (
	<Button
		size="lg"
		{...props}
		className={cn(
			"h-16 rounded-full border-0 bg-background-100 data-[active=true]:bg-background-200",
			className,
		)}
	/>
);

const AuthOptionButtonText: typeof ButtonText = ({ className, ...props }) => (
	<ButtonText
		{...props}
		className={cn(
			"text-typography-950 data-[active=true]:text-typography-950",
			className,
		)}
	/>
);

const OAuthOptionLogo: typeof Image = ({ className, ...props }) => (
	<Image
		size="none"
		contentFit="contain"
		{...props}
		className={cn("size-6", className)}
	/>
);

const AuthRedirectBox: typeof Box = ({ className, ...props }) => (
	<Box
		{...props}
		className={cn("items-center justify-center gap-1", className)}
	/>
);

const AuthRedirectText: typeof Text = ({ className, ...props }) => (
	<Text size="sm" {...props} className={cn("text-center", className)} />
);

const AuthRedirectButton: typeof Button = ({ className, ...props }) => (
	<Button
		variant="link"
		{...props}
		className={cn("h-auto py-0", className)}
	/>
);

export {
	AuthOptionsScreen,
	AuthOptionsHeading,
	AuthOptionButton,
	AuthOptionButtonText,
	OAuthOptionLogo,
	AuthRedirectBox,
	AuthRedirectText,
	AuthRedirectButton,
};
