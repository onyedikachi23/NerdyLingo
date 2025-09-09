/** @format */

import { useAuth } from "@/app-colocation/auth/context";
import { Text } from "@/components/ui/text";
import { Redirect } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Redirect href={"/(auth)/login"} />;
	}

	return (
		<SafeAreaView className="flex-1">
			<Tabs>
				<TabSlot />

				<TabList>
					<TabTrigger name="home" href="/">
						<Text>Home</Text>
					</TabTrigger>
					<TabTrigger name="conversations" href="/conversations">
						<Text>Conversations</Text>
					</TabTrigger>
					<TabTrigger name="notes" href="/notes">
						<Text>Notes</Text>
					</TabTrigger>
					<TabTrigger name="settings" href="/settings">
						<Text>Settings</Text>
					</TabTrigger>
				</TabList>
			</Tabs>
		</SafeAreaView>
	);
}
