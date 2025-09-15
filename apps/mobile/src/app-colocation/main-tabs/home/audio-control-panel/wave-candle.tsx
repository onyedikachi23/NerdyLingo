/** @format */

import { Box } from "@/components/ui/box";
import React from "react";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

interface WaveCandleProps {
	amplitude: number;
}

const AnimatedBox = Animated.createAnimatedComponent(Box);

const DOT_SIZE = 5;

export const WaveCandle: React.FC<WaveCandleProps> = ({
	amplitude: targetHeight,
}) => {
	const height = useSharedValue(DOT_SIZE);

	React.useEffect(() => {
		height.value = withTiming(Math.max(DOT_SIZE, targetHeight), {
			duration: 500,
		});
	}, [height, targetHeight]);

	const animatedHeightStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	return (
		<AnimatedBox
			className={"rounded-full bg-background-0"}
			style={[
				{
					width: DOT_SIZE,
				},
				animatedHeightStyle,
			]}
		/>
	);
};
