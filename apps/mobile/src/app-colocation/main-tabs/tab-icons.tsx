/** @format */

import Svg, { Path, type SvgProps } from "react-native-svg";
import { cssInterop } from "nativewind";
import type { LucideProps } from "lucide-react-native";
import type React from "react";

type IconProps = LucideProps & {
	as: React.ElementType;
};

function IconImpl({ as: IconComponent, ...props }: IconProps) {
	return <IconComponent {...props} />;
}

cssInterop(IconImpl, {
	className: {
		target: "style",
		nativeStyleToProp: {
			height: "size",
			width: "size",
		},
	},
});

function Icon({ as: IconComponent, size = 14, ...props }: IconProps) {
	return <IconImpl as={IconComponent} size={size} {...props} />;
}

const HomeIcon = (props: SvgProps) => (
	<Svg viewBox="0 0 24 24" fill="none" {...props}>
		<Path
			d="M11.97 21C16.9405 21 20.97 16.9706 20.97 12C20.97 7.02944 16.9405 3 11.97 3C6.99941 3 2.96997 7.02944 2.96997 12C2.96997 16.9706 6.99941 21 11.97 21Z"
			fill="currentColor"
			opacity="0.4"
		/>
		<Path
			d="M10.8901 15.8071H13.1041C14.5981 15.8071 15.8041 14.6011 15.8041 13.1071V10.8931C15.8041 9.39912 14.5981 8.19312 13.1041 8.19312H10.8901C9.39606 8.19312 8.19006 9.39912 8.19006 10.8931V13.1071C8.19006 14.6011 9.39606 15.8071 10.8901 15.8071Z"
			fill="currentColor"
		/>
	</Svg>
);

cssInterop(HomeIcon, {
	className: {
		target: "style",
		nativeStyleToProp: {
			width: true,
			height: true,
		},
	},
});

export { HomeIcon, Icon };
