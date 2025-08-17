/** @format */

import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import React from "react";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
	React.useEffect(() => {
		void NavigationBar.setVisibilityAsync("hidden");

		return () => void NavigationBar.setVisibilityAsync("visible");
	}, []);

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<StatusBar style="light" />
			<Box className="relative flex-1">
				<Image
					alt="onboarding image"
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					source={require("@/assets/images/onboarding/step1.png")}
					className="absolute inset-0"
					size={"none"}
				/>
				<Box className="absolute inset-0 bg-background-950/30" />

				<SafeAreaView className="flex-1">
					<Box className="flex-1 justify-between px-4 pb-24 pt-10">
						<Box className="flex-row items-center justify-between">
							{/* step dots */}
							<Box className="flex-row items-center gap-2">
								{/* active step */}
								<Box className="h-1.5 w-8 rounded-full bg-background-0" />

								<Box className="h-1.5 w-1.5 rounded-full bg-background-0/30" />
								<Box className="h-1.5 w-1.5 rounded-full bg-background-0/30" />
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
								Understand all languages, effortlessly.
							</Text>

							<Button
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
				</SafeAreaView>
			</Box>
		</>
	);
}
