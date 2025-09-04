/** @format */

import { cn } from "@/lib/utils";
import { Box } from "../ui/box";
import { Button, ButtonIcon } from "../ui/button";

const FlowButton: typeof Button = ({ className, size = "lg", ...props }) => {
	return (
		<Button
			{...props}
			className={cn(
				"aspect-[14/5] h-16 w-auto rounded-full border-0 px-0.5 py-0.5",
				className,
			)}
			size={size}
		/>
	);
};

const FlowButtonRing: typeof Box = ({ className, ...props }) => {
	return (
		<Box
			{...props}
			className={cn(
				"size-full items-center justify-center rounded-full border border-outline-0",
				className,
			)}
		/>
	);
};

const FlowButtonIcon: typeof ButtonIcon = ({ className, ...props }) => {
	return <ButtonIcon {...props} className={cn("", className)} />;
};

export { FlowButton, FlowButtonRing, FlowButtonIcon };
