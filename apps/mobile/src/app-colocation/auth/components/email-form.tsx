/** @format */

import { Box } from "@/components/ui/box";
import {
	FormControlError,
	FormControlErrorIcon,
	FormControlErrorText,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, type InputFieldProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DeepKeys } from "@tanstack/react-form";
import { AlertCircleIcon } from "lucide-react-native";
import type React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const AuthFormContainer: typeof Box = ({ className, ...props }) => (
	<Box {...props} className={cn("flex-1 gap-12")} />
);

const AuthFormHeading: typeof Heading = ({ className, ...props }) => (
	<Heading {...props} className={cn("text-center", className)} />
);

const AuthFormFieldsContainer: React.FC<
	React.ComponentProps<typeof KeyboardAwareScrollView>
> = (props) => (
	<KeyboardAwareScrollView
		contentContainerClassName="gap-8"
		showsVerticalScrollIndicator={false}
		bottomOffset={16}
		{...props}
	/>
);

const AuthFormControlLabel: typeof FormControlLabel = ({
	children,
	...props
}) => (
	<FormControlLabel {...props}>
		<FormControlLabelText>{children}</FormControlLabelText>
	</FormControlLabel>
);

const AuthFormInput: typeof Input = ({ className, ...props }) => (
	<Input
		{...props}
		className={cn("h-16 rounded-2xl border-0 bg-background-50", className)}
	/>
);

const AuthFormInputField: typeof InputField = ({ className, ...props }) => (
	<InputField {...props} className={cn("font-semibold", className)} />
);

const AuthFormControlError: typeof FormControlError = ({
	children,
	...props
}) => (
	<FormControlError {...props}>
		<FormControlErrorIcon as={AlertCircleIcon} />
		<FormControlErrorText>{children}</FormControlErrorText>
	</FormControlError>
);

type FieldBuilder<TForm> = {
	name: DeepKeys<TForm>;
	type?: InputFieldProps["type"];
	label: string;
	placeholder: string;
};

export {
	AuthFormContainer,
	AuthFormFieldsContainer,
	AuthFormHeading,
	AuthFormControlLabel,
	AuthFormInput,
	AuthFormInputField,
	AuthFormControlError,
	type FieldBuilder,
};
