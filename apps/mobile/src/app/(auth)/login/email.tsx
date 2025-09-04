/** @format */

import {
	AuthFormContainer,
	AuthFormControlError,
	AuthFormControlLabel,
	AuthFormFieldsContainer,
	AuthFormHeading,
	AuthFormInput,
	AuthFormInputField,
	type FieldBuilder,
} from "@/app-colocation/auth/components/email-form";
import { isFieldRequired } from "@/app-colocation/auth/utils";
import {
	FlowButton,
	FlowButtonIcon,
	FlowButtonRing,
} from "@/components/ui-common/flow-button";
import { ButtonSpinner } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { useForm } from "@tanstack/react-form";
import { ChevronRight } from "lucide-react-native";
import z from "zod";

const StrongPasswordSchema = z
	.string()
	.min(8, "At least 8 characters long")
	.regex(/[a-z]/, "At least one lowercase letter")
	.regex(/[A-Z]/, "At least one uppercase letter")
	.regex(/\d/, "At least one number")
	.regex(/[^a-zA-Z0-9\s]/, "At least one special character");

const fieldsSchema = {
	email: z.email(),
	password: StrongPasswordSchema,
} satisfies z.ZodRawShape;

type EmailLoginForm = z.infer<z.ZodObject<typeof fieldsSchema>>;

const fieldsBuilder = [
	{
		name: "email",
		label: "Email",
		placeholder: "hello@example.com",
	},
	{
		name: "password",
		label: "Password",
		placeholder: "••••••••",
		type: "password",
	},
] satisfies FieldBuilder<EmailLoginForm>[];

export default function EmailLogin() {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		} satisfies EmailLoginForm,
	});

	return (
		<AuthFormContainer>
			<AuthFormHeading>Sign up with your email address</AuthFormHeading>

			<AuthFormFieldsContainer>
				{fieldsBuilder.map(
					({ name, label, placeholder, type }, index) => {
						return (
							<form.Field
								key={name}
								name={name}
								validators={{
									onBlur: fieldsSchema[name],
								}}>
								{(field) => (
									<FormControl
										isInvalid={!field.state.meta.isValid}
										isRequired={isFieldRequired(
											fieldsSchema[name],
										)}>
										<AuthFormControlLabel>
											{label}
										</AuthFormControlLabel>

										<AuthFormInput>
											<AuthFormInputField
												placeholder={placeholder}
												value={field.state.value}
												onBlur={field.handleBlur} // for validate on blur
												onChangeText={
													field.handleChange
												} // for syncing changes to field state
												type={type}
												autoFocus={index === 0}
											/>
										</AuthFormInput>

										<AuthFormControlError>
											{
												// display one error at a time
												field.state.meta.errors[0]
													?.message
											}
										</AuthFormControlError>
									</FormControl>
								)}
							</form.Field>
						);
					},
				)}
			</AuthFormFieldsContainer>

			<form.Subscribe
				selector={({ canSubmit, isSubmitting }) => ({
					canSubmit,
					isSubmitting,
				})}>
				{({ canSubmit, isSubmitting }) => {
					const isDisabled = !canSubmit || isSubmitting;
					return (
						<FlowButton
							accessibilityLabel={"log in"}
							accessibilityState={{
								disabled: isDisabled,
							}}
							isDisabled={isDisabled}
							onPress={() => void form.handleSubmit()}
							className="mx-auto">
							<FlowButtonRing>
								{isSubmitting ? (
									<ButtonSpinner />
								) : (
									<FlowButtonIcon as={ChevronRight} />
								)}
							</FlowButtonRing>
						</FlowButton>
					);
				}}
			</form.Subscribe>
		</AuthFormContainer>
	);
}
