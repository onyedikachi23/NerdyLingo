/** @format */

import { useAuth } from "@/app-colocation/auth/context";
import { HomeIcon, Icon } from "@/app-colocation/main-tabs/tab-icons";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Redirect, type Href } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface TabItem {
	href: Href;
	name: string;
	Icon: React.ElementType;
	label: string;
}

type TabButtonProps = Pick<TabItem, "Icon" | "label">;

const TabButton: React.FC<TabButtonProps> = (props) => {
	const hasIsFocusedProp = (
		props: unknown,
	): props is TabButtonProps & { isFocused: boolean } =>
		!!props &&
		typeof props === "object" &&
		"isFocused" in props &&
		typeof props.isFocused === "boolean";

	if (!hasIsFocusedProp(props)) {
		throw new Error(
			"TabButton must be used within a '<TabTrigger aschild={true} />'.",
		);
	}

	const { label, Icon: SvgIcon, isFocused, ...otherProps } = props;

	return (
		<Button
			{...otherProps}
			variant="ghost"
			size="sm"
			className="h-auto !flex-col items-center justify-center">
			<Icon
				as={SvgIcon}
				height={24}
				width={24}
				className={
					isFocused ? "text-primary-500" : "text-typography-500/50"
				}
			/>
			<ButtonText
				className={
					isFocused ? "text-primary-500" : "text-typography-500/50"
				}>
				{label}
			</ButtonText>
		</Button>
	);
};

const tabs = [
	{
		href: "/",
		Icon: HomeIcon,
		name: "home",
		label: "Home",
	},
	{
		href: "/conversations",
		Icon: HomeIcon,
		name: "conversations",
		label: "Conversations",
	},
	{
		href: "/notes",
		Icon: HomeIcon,
		name: "notes",
		label: "Notes",
	},
	{
		href: "/settings",
		Icon: HomeIcon,
		name: "settings",
		label: "Settings",
	},
] satisfies TabItem[];

export default function TabsLayout() {
	const { isAuthenticated } = useAuth();
	if (!isAuthenticated) {
		return <Redirect href={"/(auth)/login"} />;
	}

	return (
		<SafeAreaView className="flex-1 p-4">
			<Tabs>
				<TabSlot />

				{/* This displays and controls the tabs */}
				<ButtonGroup className="flex-row">
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
