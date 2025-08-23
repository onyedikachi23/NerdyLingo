/** @format */

"use client";
import React from "react";
import { createInput } from "@gluestack-ui/input";
import { View, Pressable, TextInput } from "react-native";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
	withStyleContext,
	useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { cssInterop } from "nativewind";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/icon";

const SCOPE = "INPUT";

const UIInput = createInput({
	Root: withStyleContext(View, SCOPE),
	Icon: UIIcon,
	Slot: Pressable,
	Input: TextInput,
});

cssInterop(PrimitiveIcon, {
	className: {
		target: "style",
		nativeStyleToProp: {
			height: true,
			width: true,
			fill: true,
			color: "classNameColor",
			stroke: true,
		},
	},
});

const inputStyle = tva({
	base: "border-background-300 flex-row overflow-hidden content-center data-[hover=true]:border-outline-400 data-[focus=true]:border-primary-700 data-[focus=true]:hover:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:hover:border-background-300 items-center",

	variants: {
		size: {
			xl: "h-12",
			lg: "h-11",
			md: "h-10",
			sm: "h-9",
		},

		variant: {
			underlined:
				"rounded-none border-b data-[invalid=true]:border-b-2 data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700",

			outline:
				"rounded border data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700",

			rounded:
				"rounded-full border data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700",
		},
	},
});

const inputIconStyle = tva({
	base: "justify-center items-center text-typography-400",
	parentVariants: {
		size: {
			"2xs": "h-3 w-3",
			xs: "h-3.5 w-3.5",
			sm: "h-4 w-4",
			md: "h-[18px] w-[18px]",
			lg: "h-5 w-5",
			xl: "h-6 w-6",
		},
	},
});

const inputSlotStyle = tva({
	base: "justify-center items-center",
});

const inputFieldStyle = tva({
	base: "flex-1 text-typography-900 py-0 px-3 placeholder:text-typography-500/30 h-full ios:leading-[0px]",

	parentVariants: {
		variant: {
			underlined: "px-0",
			outline: "",
			rounded: "px-4",
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
	},
});

type InputProps = Prettify<
	React.ComponentProps<typeof UIInput> & VariantProps<typeof inputStyle>
>;

const Input: React.FC<InputProps> = ({
	className,
	variant = "outline",
	size = "md",
	...props
}) => {
	return (
		<UIInput
			{...props}
			className={inputStyle({ variant, size, class: className })}
			context={{ variant, size }}
		/>
	);
};

type BaseInputIconProps = React.ComponentProps<typeof UIInput.Icon> &
	VariantProps<typeof inputIconStyle> & {
		className?: string;
		height?: number;
		width?: number;
	};
type InputIconProps = Prettify<
	| BaseInputIconProps
	| (SafeOmit<BaseInputIconProps, "size"> & {
			size?: number;
	  })
>;

const InputIcon: React.FC<InputIconProps> = ({
	fill = "none",
	className,
	size,
	...props
}) => {
	const { size: parentSize } = useStyleContext(SCOPE) as VariantProps<
		typeof inputIconStyle
	>;

	if (typeof size === "number") {
		return (
			<UIInput.Icon
				{...props}
				className={inputIconStyle({ class: className })}
				size={size}
				fill={fill}
			/>
		);
	} else if (
		(props.height !== undefined || props.width !== undefined) &&
		size === undefined
	) {
		return (
			<UIInput.Icon
				{...props}
				className={inputIconStyle({ class: className })}
				fill={fill}
			/>
		);
	}
	return (
		<UIInput.Icon
			{...props}
			className={inputIconStyle({
				parentVariants: {
					size: parentSize,
				},
				class: className,
			})}
			fill={fill}
		/>
	);
};

type InputSlotProps = Prettify<
	React.ComponentProps<typeof UIInput.Slot> &
		VariantProps<typeof inputSlotStyle>
>;

const InputSlot: React.FC<InputSlotProps> = ({ className, ...props }) => {
	return (
		<UIInput.Slot
			{...props}
			className={inputSlotStyle({
				class: className,
			})}
		/>
	);
};

type InputFieldProps = Prettify<
	React.ComponentProps<typeof UIInput.Input> &
		VariantProps<typeof inputFieldStyle>
>;

const InputField: React.FC<InputFieldProps> = ({ className, ...props }) => {
	const { variant: parentVariant, size: parentSize } = useStyleContext(
		SCOPE,
	) as VariantProps<typeof inputFieldStyle>;

	return (
		<UIInput.Input
			{...props}
			className={inputFieldStyle({
				parentVariants: {
					variant: parentVariant,
					size: parentSize,
				},
				class: className,
			})}
		/>
	);
};

export { Input, InputField, InputIcon, InputSlot };

export type { InputProps, InputFieldProps, InputIconProps, InputSlotProps };
