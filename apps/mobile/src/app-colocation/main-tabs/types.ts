/** @format */

import type { Href } from "expo-router";

export interface TabItem {
	href: Href;
	name: string;
	Icon: React.ElementType;
	label: string;
}
