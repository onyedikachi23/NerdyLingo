/** @format */

import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuSeparator } from "@/components/ui/menu";
import React from "react";
import {
	CheckMarkIcon,
	ControlMenuItemLabel,
	ControlMenuTrigger,
	DetailedModeIcon,
	DotsIcon,
	MinimalModeIcon,
} from "./dropdown-components";

type Mode = "minimal" | "detailed";

interface ModeItem {
	key: Mode;
	textValue: string;
	label: string;
	icon: React.ElementType;
}

const modeItems = [
	{
		key: "minimal",
		textValue: "Minimal Mode",
		label: "Minimal Mode",
		icon: MinimalModeIcon,
	},
	{
		key: "detailed",
		textValue: "Detailed Mode",
		label: "Detailed Mode",
		icon: DetailedModeIcon,
	},
] satisfies ModeItem[];

export const ModesDropdown = () => {
	const [selectedMode, setSelectedMode] = React.useState<Mode>("minimal");
	return (
		<Menu
			placement="right bottom"
			trigger={(props) => (
				<ControlMenuTrigger {...props}>
					<Icon as={DotsIcon} />
				</ControlMenuTrigger>
			)}>
			{modeItems.map(({ key, textValue, label, icon }, index) => {
				const isSelected = key === selectedMode;
				const isLastItem = index === modeItems.length - 1;
				return (
					<React.Fragment key={key}>
						<MenuItem
							key={key}
							textValue={textValue}
							onPress={() => setSelectedMode(key)}>
							{isSelected && (
								<Icon
									as={CheckMarkIcon}
									size={"sm"}
									className="mr-2"
								/>
							)}
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
