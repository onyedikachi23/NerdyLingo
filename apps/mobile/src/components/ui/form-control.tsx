/** @format */

import { Text, View } from "react-native";
import React from "react";
import { createFormControl } from "@gluestack-ui/form-control";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
	withStyleContext,
	useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { cssInterop } from "nativewind";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/icon";

const SCOPE = "FORM_CONTROL";

const formControlStyle = tva({
	base: "flex flex-col",
	variants: {
		size: {
			sm: "",
			md: "",
			lg: "",
		},
	},
});

const formControlErrorIconStyle = tva({
	base: "text-error-500",
	variants: {
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

const formControlErrorStyle = tva({
	base: "flex flex-row justify-start items-center mt-1 gap-1",
});

const formControlErrorTextStyle = tva({
	base: "text-error-500",
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

const formControlHelperStyle = tva({
	base: "flex flex-row justify-start items-center mt-1",
});

const formControlHelperTextStyle = tva({
	base: "text-typography-500",
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
		size: {
			"2xs": "text-2xs",
			xs: "text-xs",
			sm: "text-xs",
			md: "text-sm",
			lg: "text-base",
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

const formControlLabelStyle = tva({
	base: "flex flex-row justify-start items-center mb-1",
});

const formControlLabelTextStyle = tva({
	base: "font-medium text-typography-900",
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

const formControlLabelAstrickStyle = tva({
	base: "font-medium text-typography-900",
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

type FormControlLabelAstrickProps = Prettify<
	React.ComponentProps<typeof Text> &
		VariantProps<typeof formControlLabelAstrickStyle>
>;

const FormControlLabelAstrick: React.FC<FormControlLabelAstrickProps> = ({
	className,
	...props
}) => {
	const { size: parentSize } = useStyleContext(SCOPE) as VariantProps<
		typeof formControlLabelAstrickStyle
	>;

	return (
		<Text
			{...props}
			className={formControlLabelAstrickStyle({
				parentVariants: { size: parentSize },
				class: className,
			})}
		/>
	);
};

export const UIFormControl = createFormControl({
	Root: withStyleContext(View, SCOPE),
	Error: View,
	ErrorText: Text,
	ErrorIcon: UIIcon,
	Label: View,
	LabelText: Text,
	LabelAstrick: FormControlLabelAstrick,
	Helper: View,
	HelperText: Text,
});

cssInterop(PrimitiveIcon, {
	className: {
		target: "style",
		nativeStyleToProp: {
			height: true,
			width: true,
			fill: true,
			color: true,
			stroke: true,
		},
	},
});

type FormControlProps = Prettify<
	React.ComponentProps<typeof UIFormControl> &
		VariantProps<typeof formControlStyle>
>;

const FormControl: React.FC<FormControlProps> = ({
	className,
	size = "md",
	...props
}) => {
	return (
		<UIFormControl
			{...props}
			className={formControlStyle({ size, class: className })}
			context={{ size }}
		/>
	);
};

type FormControlErrorProps = Prettify<
	React.ComponentProps<typeof UIFormControl.Error> &
		VariantProps<typeof formControlErrorStyle>
>;

const FormControlError: React.FC<FormControlErrorProps> = ({
	className,
	...props
}) => {
	return (
		<UIFormControl.Error
			{...props}
			className={formControlErrorStyle({ class: className })}
		/>
	);
};

type FormControlErrorTextProps = Prettify<
	React.ComponentProps<typeof UIFormControl.Error.Text> &
		VariantProps<typeof formControlErrorTextStyle>
>;

const FormControlErrorText: React.FC<FormControlErrorTextProps> = ({
	className,
	size,
	...props
}) => {
	const { size: parentSize } = useStyleContext(SCOPE) as VariantProps<
		typeof formControlErrorTextStyle
	>;

	return (
		<UIFormControl.Error.Text
			{...props}
			className={formControlErrorTextStyle({
				parentVariants: { size: parentSize },
				size,
				class: className,
			})}
		/>
	);
};

type BaseFormControlErrorIconProps = React.ComponentProps<
	typeof UIFormControl.Error.Icon
> &
	VariantProps<typeof formControlErrorIconStyle> & {
		height?: number;
		width?: number;
	};

type FormControlErrorIconProps = Prettify<
	| BaseFormControlErrorIconProps
	| (SafeOmit<BaseFormControlErrorIconProps, "size"> & {
			size?: number;
	  })
>;

const FormControlErrorIcon: React.FC<FormControlErrorIconProps> = ({
	className,
	size,
	fill = "none",
	...props
}) => {
	const { size: parentSize } = useStyleContext(SCOPE) as VariantProps<
		typeof formControlErrorIconStyle
	>;

	if (typeof size === "number") {
		return (
			<UIFormControl.Error.Icon
				{...props}
				className={formControlErrorIconStyle({ class: className })}
				size={size}
				fill={fill}
			/>
		);
	} else if (
		(props.height !== undefined || props.width !== undefined) &&
		size === undefined
	) {
		return (
			<UIFormControl.Error.Icon
				{...props}
				className={formControlErrorIconStyle({ class: className })}
				fill={fill}
			/>
		);
	}
	return (
		<UIFormControl.Error.Icon
			{...props}
			className={formControlErrorIconStyle({
				parentVariants: { size: parentSize },
				size,
				class: className,
			})}
			fill={fill}
		/>
	);
};

type FormControlLabelProps = Prettify<
	React.ComponentProps<typeof UIFormControl.Label> &
		VariantProps<typeof formControlLabelStyle>
>;

const FormControlLabel: React.FC<FormControlLabelProps> = ({
	className,
	...props
}) => {
	return (
		<UIFormControl.Label
			{...props}
			className={formControlLabelStyle({ class: className })}
		/>
	);
};

type FormControlLabelTextProps = Prettify<
	React.ComponentProps<typeof UIFormControl.Label.Text> &
		VariantProps<typeof formControlLabelTextStyle>
>;

const FormControlLabelText: React.FC<FormControlLabelTextProps> = ({
	className,
	size,
	...props
}) => {
	const { size: parentSize } = useStyleContext(SCOPE) as VariantProps<
		typeof formControlLabelTextStyle
	>;

	return (
		<UIFormControl.Label.Text
			{...props}
			className={formControlLabelTextStyle({
				parentVariants: { size: parentSize },
				size,
				class: className,
			})}
		/>
	);
};

type FormControlHelperProps = Prettify<
	React.ComponentProps<typeof UIFormControl.Helper> &
		VariantProps<typeof formControlHelperStyle>
>;

const FormControlHelper: React.FC<FormControlHelperProps> = ({
	className,
	...props
}) => {
	return (
		<UIFormControl.Helper
			{...props}
			className={formControlHelperStyle({
				class: className,
			})}
		/>
	);
};

type FormControlHelperTextProps = Prettify<
	React.ComponentProps<typeof UIFormControl.Helper.Text> &
		VariantProps<typeof formControlHelperTextStyle>
>;

const FormControlHelperText: React.FC<FormControlHelperTextProps> = ({
	className,
	size,
	...props
}) => {
	const { size: parentSize } = useStyleContext(SCOPE) as VariantProps<
		typeof formControlHelperTextStyle
	>;

	return (
		<UIFormControl.Helper.Text
			{...props}
			className={formControlHelperTextStyle({
				parentVariants: { size: parentSize },
				size,
				class: className,
			})}
		/>
	);
};

export {
	FormControl,
	FormControlError,
	FormControlErrorText,
	FormControlErrorIcon,
	FormControlLabel,
	FormControlLabelText,
	FormControlLabelAstrick,
	FormControlHelper,
	FormControlHelperText,
};

export type {
	FormControlProps,
	FormControlErrorProps,
	FormControlErrorTextProps,
	FormControlErrorIconProps,
	FormControlLabelProps,
	FormControlLabelTextProps,
	FormControlLabelAstrickProps,
	FormControlHelperProps,
	FormControlHelperTextProps,
};
