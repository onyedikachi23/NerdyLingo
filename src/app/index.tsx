/** @format */

import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Image, type ImageProps } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronRight, X } from "lucide-react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useWindowDimensions } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

const AnimatedBox = Animated.createAnimatedComponent(Box);

const ONBOARDING_STEPS = [
	{
		description: "Understand all languages, effortlessly.",
		image: require("@/assets/images/onboarding/step1.png") as string,
	},
	{
		description: "Everything you hear, translated and written.",
		image: require("@/assets/images/onboarding/step2.png") as string,
	},
	{
		description: "Connect your headphones and tap Listen.",
		image: require("@/assets/images/onboarding/step3.png") as string,
	},
] as const satisfies {
	description: string;
	image: string;
}[];

const ANIMATION_DURATION = 300;

interface BannerProps {
	index: number;
	currentStepIndex: number;
	image: ImageProps["source"];
}
const Banner: React.FC<BannerProps> = ({ index, currentStepIndex, image }) => {
	const { width: screenWidth } = useWindowDimensions();
	const imageStyle = useAnimatedStyle(() => {
		// - Is 0 if active (e.g., 1-1=0).
		// - Is positive to move right offscreen (e.g., 2-1=1).
		// - Is negative to move left offscreen (e.g., 0-1=-1).
		const translateX = (index - currentStepIndex) * screenWidth;

		return {
			opacity: withTiming(index === currentStepIndex ? 1 : 0, {
				duration: ANIMATION_DURATION,
			}),
			transform: [
				{
					translateX: withTiming(translateX, {
						duration: ANIMATION_DURATION,
					}),
				},
			],
		};
	});

	return (
		<AnimatedBox style={imageStyle} className="absolute inset-0">
			<Image
				alt="onboarding image"
				source={image}
				className="absolute inset-0"
				size={"none"}
			/>
		</AnimatedBox>
	);
};

interface StepDotProps {
	index: number;
	currentStepIndex: number;
}
const StepDot: React.FC<StepDotProps> = ({ index, currentStepIndex }) => {
	const dotStyle = useAnimatedStyle(() => {
		const isActive = index === currentStepIndex;
		return {
			width: withTiming(isActive ? 24 : 6, {
				duration: ANIMATION_DURATION,
			}),
			opacity: withTiming(isActive ? 1 : 0.3, {
				duration: ANIMATION_DURATION,
			}),
		};
	});

	return (
		<AnimatedBox
			style={dotStyle}
			className="h-1.5 rounded-full bg-background-0"
		/>
	);
};

type SwipeDirection = "left" | "right";

export default function OnboardingScreen() {
	const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

	React.useEffect(() => {
		void NavigationBar.setVisibilityAsync("hidden");

		return () => void NavigationBar.setVisibilityAsync("visible");
	}, []);

	const adjustStepIndex = (direction: SwipeDirection) => {
		if (direction === "right") {
			setCurrentStepIndex((prevIndex) =>
				Math.min(prevIndex + 1, ONBOARDING_STEPS.length - 1),
			);
		} else if (direction === "left") {
			setCurrentStepIndex((prevIndex) => Math.max(prevIndex - 1, 0));
		}
	};

	const swipeGesture = Gesture.Pan()
		// Only activate if horizontal movement is more than 10 points
		.activeOffsetX([-10, 10])
		// Fail if vertical movement is more than 10 points
		.failOffsetY([-10, 10])
		.onEnd((event) => {
			if (event.translationX > 0) {
				runOnJS(adjustStepIndex)("left");
			} else if (event.translationX < 0) {
				runOnJS(adjustStepIndex)("right");
			}
		});

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<StatusBar style="light" />
			<Box className="relative flex-1">
				{ONBOARDING_STEPS.map((step, index) => (
					<Banner
						key={step.image}
						index={index}
						currentStepIndex={currentStepIndex}
						image={step.image}
					/>
				))}

				<Box className="absolute inset-0 bg-background-950/30" />

				<SafeAreaView className="flex-1">
					<GestureHandlerRootView>
						<GestureDetector gesture={swipeGesture}>
							<Box className="flex-1 justify-between px-4 pb-24 pt-10">
								<Box className="flex-row items-center justify-between">
									{/* step dots */}
									<Box className="flex-row items-center gap-2">
										{ONBOARDING_STEPS.map((step, index) => (
											<StepDot
												key={step.image}
												index={index}
												currentStepIndex={
													currentStepIndex
												}
											/>
										))}
									</Box>

									<Button
										size="icon"
										variant="secondary"
										className="rounded-full border-0 bg-background-0/20 data-[active=true]:bg-background-0/50">
										<ButtonIcon
											as={X}
											className="text-typography-950"
										/>
									</Button>
								</Box>

								<Box className="items-center justify-center gap-8">
									<Text
										className="max-w-[80%] text-center font-semibold"
										numberOfLines={2}>
										{
											ONBOARDING_STEPS[currentStepIndex]
												?.description
										}
									</Text>

									<Button
										onPress={() => adjustStepIndex("right")}
										size="lg"
										className="aspect-[14/5] h-16 w-auto rounded-full border-0 bg-background-0 px-0.5 py-0.5 data-[active=true]:bg-background-100">
										{/* inner border */}
										<Box className="size-full items-center justify-center rounded-full border border-outline-950">
											<ButtonIcon
												as={ChevronRight}
												className="text-typography-0"
											/>
										</Box>
									</Button>
								</Box>
							</Box>
						</GestureDetector>
					</GestureHandlerRootView>
				</SafeAreaView>
			</Box>
		</>
	);
}
