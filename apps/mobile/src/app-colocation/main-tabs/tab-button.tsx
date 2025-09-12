/** @format */

import { Button, ButtonText } from "@/components/ui/button";
import React from "react";
import type { TabItem } from "./types";
import { Icon } from "./tab-icons";
import Animated, {
	interpolate,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useThemedColor } from "@/hooks/use-themed-color";

type TabButtonProps = Pick<TabItem, "Icon" | "label">;

const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedButtonText = Animated.createAnimatedComponent(ButtonText);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export const TabButton: React.FC<TabButtonProps> = (props) => {
	const hasIsFocusedProp = (
		props: unknown,
	): props is TabButtonProps & { isFocused: boolean } =>
		!!props &&
		typeof props === "object" &&
		"isFocused" in props &&
		typeof props.isFocused === "boolean";

	if (!hasIsFocusedProp(props)) {
		throw new Error(
			"TabButton must be used within a '<TabTrigger aschild={true} />' so that it can recieve the 'isFocused' prop.",
			{ cause: props },
		);
	}

	const { label, Icon: SvgIcon, isFocused, ...otherProps } = props;

	const focusProgress = useSharedValue(0);
	React.useEffect(() => {
		focusProgress.value = withSpring(isFocused ? 1 : 0, {
			duration: 300,
		});
	}, [focusProgress, isFocused]);

	const iconScaleStyle = useAnimatedStyle(() => {
		const scale = interpolate(focusProgress.value, [0, 1], [1, 1.5]);

		return {
			transform: [
				{
					scale,
				},
			],
		};
	});

	const { getHexColor } = useThemedColor();
	const unfocusedColor = getHexColor("typography-500/50");
	const focusedColor = getHexColor("primary-500");
	const textColorStyle = useAnimatedStyle(() => {
		const color = interpolateColor(
			focusProgress.value,
			[0, 1],
			[unfocusedColor, focusedColor],
		);
		return { color };
	});

	return (
		<AnimatedButton
			{...otherProps}
			variant="ghost"
			size="sm"
			className="h-auto !flex-col items-center justify-center rounded-full p-3">
			<AnimatedIcon
				as={SvgIcon}
				height={24}
				width={24}
				style={iconScaleStyle}
				className={
					isFocused ? "text-primary-500" : "text-typography-500/50"
				}
			/>
			<AnimatedButtonText style={textColorStyle}>
				{label}
			</AnimatedButtonText>
		</AnimatedButton>
	);
};
