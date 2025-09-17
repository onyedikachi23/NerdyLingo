/** @format */

import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuSeparator } from "@/components/ui/menu";
import React from "react";
import {
	BubblesIcon,
	ControlMenuItemLabel,
	ControlMenuTrigger,
	MicIcon,
	SpeakerIcon,
} from "./dropdown-components";

interface ControlItem {
	key: "mic" | "volume";
	textValue: string;
	label: string;
	icon: React.ElementType;
}

const controlItems = [
	{
		key: "volume",
		textValue: "Volume",
		label: "Volume",
		icon: SpeakerIcon,
	},
	{
		key: "mic",
		textValue: "Change microphone",
		label: "Change microphone",
		icon: MicIcon,
	},
] satisfies ControlItem[];

export const MicAndVolumeDropdown = () => {
	return (
		<Menu
			placement="left bottom"
			trigger={(props) => (
				<ControlMenuTrigger {...props}>
					<Icon as={BubblesIcon} />
				</ControlMenuTrigger>
			)}>
			{controlItems.map(({ key, textValue, label, icon }, index) => {
				const isLastItem = index === controlItems.length - 1;
				return (
					<React.Fragment key={key}>
						<MenuItem key={key} textValue={textValue}>
							<ControlMenuItemLabel className="mr-auto">
								{label}
							</ControlMenuItemLabel>
							<Icon as={icon} />
						</MenuItem>

						{!isLastItem && <MenuSeparator />}
					</React.Fragment>
				);
			})}
		</Menu>
	);
};
