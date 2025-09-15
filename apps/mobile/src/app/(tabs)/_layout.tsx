/** @format */

import { useAuth } from "@/app-colocation/auth/context";
import { TabButton } from "@/app-colocation/main-tabs/tab-button";
import {
	HomeIcon,
	NotesIcon,
	PeopleIcon,
	SettingsIcon,
} from "@/app-colocation/main-tabs/tab-icons";
import type { TabItem } from "@/app-colocation/main-tabs/types";
import { ButtonGroup } from "@/components/ui/button";
import { Redirect, useRouter } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = [
	{
		href: "/",
		Icon: HomeIcon,
		name: "home",
		label: "Home",
	},
	{
		href: "/conversations",
		Icon: PeopleIcon,
		name: "conversations",
		label: "Conversations",
	},
	{
		href: "/notes",
		Icon: NotesIcon,
		name: "notes",
		label: "Notes",
	},
	{
		href: "/settings",
		Icon: SettingsIcon,
		name: "settings",
		label: "Settings",
	},
] satisfies TabItem[];

export default function TabsLayout() {
	const router = useRouter();

	const { isAuthenticated } = useAuth();
	if (!isAuthenticated) {
		return <Redirect href={"/(auth)/login"} />;
	}

	return (
		<SafeAreaView
			className="flex-1"
			ref={(view) => {
				if (view) {
					tabs.forEach(({ href }) => {
						router.prefetch(href);
					});
				}
			}}>
			<Tabs>
				<TabSlot />

				{/* This displays and controls the tabs */}
				<ButtonGroup className="flex-row p-4">
					{tabs.map(({ href, ...item }) => (
						<TabTrigger key={href} name={item.name} asChild>
							<TabButton key={href} {...item} />
						</TabTrigger>
					))}
				</ButtonGroup>

				{/* This defines the tabs */}
				<TabList>
					{tabs.map(({ href, name }) => (
						<TabTrigger key={href} name={name} href={href} />
					))}
				</TabList>
			</Tabs>
		</SafeAreaView>
	);
}
