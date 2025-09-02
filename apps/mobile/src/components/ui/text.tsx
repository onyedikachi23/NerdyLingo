/** @format */

import React from "react";

import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { PropSlot, type AsChildProps } from "./slot";

const textStyle = tva({
	base: `text-typography-700 font-body`,

	variants: {
		isTruncated: {
			true: "web:truncate",
		},
		bold: {
			true: "font-bold",
		},
		underline: {
			true: "underline",
		},
		strikeThrough: {
			true: "line-through",
		},
		size: {
			"2xs": "text-2xs",
			xs: "text-xs",
			sm: "text-sm",
			md: "text-base",
			lg: "text-lg",
			xl: "text-xl",
			"2xl": "text-2xl",
			"3xl": "text-3xl",
			"4xl": "text-4xl",
			"5xl": "text-5xl",
			"6xl": "text-6xl",
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
	},
});

type BaseTextProps = Prettify<
	RNTextProps & VariantProps<typeof textStyle> & { ref?: React.Ref<RNText> }
>;

const TextSlot = PropSlot as React.FC<BaseTextProps>;

type TextProps = AsChildProps<BaseTextProps>;

const Text: React.FC<TextProps> = ({
	className,
	isTruncated,
	bold,
	underline,
	strikeThrough,
	size = "md",
	sub,
	italic,
	highlight,
	asChild,
	...props
}) => {
	const Comp = asChild ? TextSlot : RNText;
	return (
		<Comp
			{...props}
			className={textStyle({
				isTruncated,
				bold,
				underline,
				strikeThrough,
				size,
				sub,
				italic,
				highlight,
				class: className,
			})}
		/>
	);
};

export { Text, TextSlot };
export type { TextProps };
