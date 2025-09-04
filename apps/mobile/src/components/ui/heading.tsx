/** @format */

import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import React from "react";
import { Text } from "react-native";
import { PropSlot, type AsChildProps } from "./slot";

const headingStyle = tva({
	base: "text-typography-900 font-semibold font-heading tracking-sm",
	variants: {
		bold: {
			true: "font-bold",
		},
		underline: {
			true: "underline",
		},
		strikeThrough: {
			true: "line-through",
		},
		sub: {
			true: "text-xs",
		},
		italic: {
			true: "italic",
		},
		highlight: {
			true: "bg-yellow-500",
		},
		size: {
			"5xl": "text-6xl",
			"4xl": "text-5xl",
			"3xl": "text-4xl",
			"2xl": "text-3xl",
			xl: "text-2xl",
			lg: "text-xl",
			md: "text-lg",
			sm: "text-base",
			xs: "text-sm",
		},
	},
});

type BaseHeadingProps = Prettify<
	React.ComponentPropsWithRef<typeof Text> & VariantProps<typeof headingStyle>
>;

type HeadingProps = AsChildProps<BaseHeadingProps>;

const HeadingSlot = PropSlot as React.FC<BaseHeadingProps>;

const Heading: React.FC<HeadingProps> = ({
	className,
	size = "lg",
	asChild,
	...props
}) => {
	const AsComp = asChild ? HeadingSlot : Text;

	const { bold, underline, strikeThrough, sub, italic, highlight } = props;
	return (
		<AsComp
			{...props}
			className={headingStyle({
				size,
				bold,
				underline,
				strikeThrough,
				sub,
				italic,
				highlight,
				class: className,
			})}
		/>
	);
};

export { Heading, HeadingSlot };
export type { HeadingProps };
