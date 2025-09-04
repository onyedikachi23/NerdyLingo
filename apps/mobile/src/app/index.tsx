/** @format */

import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Image, type ImageProps } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import * as NavigationBar from "expo-navigation-bar";
import { ChevronRight, CircleCheck, X } from "lucide-react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
	FlowButton,
	FlowButtonIcon,
	FlowButtonRing,
} from "@/components/ui-common/flow-button";
import { cn } from "@/lib/utils";
import { StatusBar } from "expo-status-bar";
import { useWindowDimensions } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useMMKVBoolean } from "react-native-mmkv";
import Animated, {
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Redirect } from "expo-router";

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

interface StepBannerProps {
	index: number;
	currentStepIndex: number;
	image: ImageProps["source"];
}
const StepBanner: React.FC<StepBannerProps> = ({
	index,
	currentStepIndex,
	image,
}) => {
	const isActive = index === currentStepIndex;
	const { width: screenWidth } = useWindowDimensions();
	const imageStyle = useAnimatedStyle(() => {
		// - Is 0 if active (e.g., 1-1=0).
		// - Is positive to move right offscreen (e.g., 2-1=1).
		// - Is negative to move left offscreen (e.g., 0-1=-1).
		const translateX = (index - currentStepIndex) * screenWidth;

		return {
			opacity: withTiming(isActive ? 1 : 0.5, {
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
				accessibilityLabel={`Image banner for: ${isActive ? "current step" : `step ${index + 1}`}`}
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

interface StepDescriptionProps {
	index: number;
	currentStepIndex: number;
	description: string;
}
const AnimatedText = Animated.createAnimatedComponent(Text);

const StepDescription = ({
	index,
	currentStepIndex,
	description,
}: StepDescriptionProps) => {
	const textStyle = useAnimatedStyle(() => {
		const isActive = index === currentStepIndex;

		const translateY = withTiming(isActive ? 0 : 20, {
			duration: ANIMATION_DURATION,
		});

		// Fades in with a subtle upward movement
		return {
			opacity: withTiming(isActive ? 1 : 0, {
				duration: ANIMATION_DURATION,
			}),
			transform: [{ translateY }],
		};
	});

	return (
		<AnimatedText
			style={textStyle}
			className="absolute max-w-[80%] text-center font-semibold text-typography-0"
			numberOfLines={2}>
			{description}
		</AnimatedText>
	);
};

type SwipeDirection = "left" | "right";

const HAS_COMPLETED_ONBOARDING_STORAGE_KEY = "has_completed_onboarding";

export default function OnboardingScreen() {
	React.useEffect(() => {
		void NavigationBar.setVisibilityAsync("hidden"); // May unpredictably reappear. Needs a more robust solution.

		return () => void NavigationBar.setVisibilityAsync("visible");
	}, []);

	const [hasCompletedOnboarding, setHasCompletedOnboarding] = useMMKVBoolean(
		HAS_COMPLETED_ONBOARDING_STORAGE_KEY,
	);
	const exitOnboarding = () => {
		setHasCompletedOnboarding(true);
	};

	const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

	const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1;

	const adjustStepIndex = (direction: SwipeDirection) => {
		if (direction === "right") {
			if (isLastStep) {
				exitOnboarding();
				return;
			}
			setCurrentStepIndex((prevIndex) =>
				Math.min(prevIndex + 1, ONBOARDING_STEPS.length - 1),
			);
			return;
		}

		setCurrentStepIndex((prevIndex) => Math.max(prevIndex - 1, 0));
	};

	const swipeGesture = Gesture.Pan()
		// Only activate if horizontal movement is more than 10 points
		.activeOffsetX([-10, 10])
		// Fail if vertical movement is more than 10 points
		.failOffsetY([-10, 10])
		.onEnd((event) => {
			if (event.translationX > 0) {
				scheduleOnRN(adjustStepIndex, "left");
			} else if (event.translationX < 0) {
				scheduleOnRN(adjustStepIndex, "right");
			}
		});

	if (hasCompletedOnboarding) {
		return <Redirect href={"/(auth)/login"} />;
	}

	return (
		<>
			{/* The banner images drawing below the StatusBar causes contrast issues */}
			<StatusBar style="light" />

			<Box className="relative flex-1">
				{ONBOARDING_STEPS.map((step, index) => (
					<StepBanner
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
										onPress={exitOnboarding}
										accessibilityLabel="Exit onboarding"
										size="icon"
										variant="secondary"
										className="rounded-full border-0 bg-background-0/20 data-[active=true]:bg-background-0/50">
										<ButtonIcon
											as={X}
											className="text-typography-0"
										/>
									</Button>
								</Box>

								<Box className="items-center justify-center gap-8">
									<Box className="relative h-12 w-full items-center justify-center">
										{ONBOARDING_STEPS.map((step, index) => (
											<StepDescription
												key={step.description}
												index={index}
												currentStepIndex={
													currentStepIndex
												}
												description={step.description}
											/>
										))}
									</Box>

									<FlowButton
										onPress={() => adjustStepIndex("right")}
										accessibilityLabel={
											isLastStep
												? "Exit onboarding"
												: "Next step"
										}
										className="bg-background-0 data-[active=true]:bg-background-100">
										{/* inner border */}
										<FlowButtonRing className="border-outline-950">
											<FlowButtonIcon
												as={
													isLastStep
														? CircleCheck
														: ChevronRight
												}
												className={cn(
													isLastStep
														? "fill-typography-900 text-background-0"
														: "text-typography-900",
												)}
											/>
										</FlowButtonRing>
									</FlowButton>
								</Box>
							</Box>
						</GestureDetector>
					</GestureHandlerRootView>
				</SafeAreaView>
			</Box>
		</>
	);
}
