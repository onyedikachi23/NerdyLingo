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
import { useSignup } from "@/app-colocation/auth/hooks/use-signup";
import {
	EmailSignupFieldsSchema,
	type EmailSignupForm,
} from "@/app-colocation/auth/signup/form-schema";
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

const fieldsBuilder = [
	{
		name: "name",
		label: "Name",
		placeholder: "John Doe",
	},
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
	{
		name: "confirmPassword",
		label: "Confirm Password",
		placeholder: "••••••••",
		type: "password",
	},
] satisfies FieldBuilder<EmailSignupForm>[];

export default function EmailSignup() {
	const { mutate: signup, isPending: isApiSubmitting } = useSignup();
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		} satisfies EmailSignupForm,
		onSubmit: ({ value }) => signup(value),
	});

	return (
		<AuthFormContainer>
			<AuthFormHeading>Sign up with your email address</AuthFormHeading>

			<AuthFormFieldsContainer>
				{fieldsBuilder.map(
					({ name, label, placeholder, type }, index) => {
						const isFirstInput = index === 0;
						const isLastInput = index === fieldsBuilder.length - 1;
						return (
							<form.Field
								key={name}
								name={name}
								validators={{
									onBlurListenTo:
										name === "confirmPassword"
											? ["password"]
											: undefined,
									onBlur: ({ value, fieldApi }) => {
										const fieldValidator =
											name === "confirmPassword"
												? EmailSignupFieldsSchema[
														name
													].refine(
														(data) =>
															data ===
															fieldApi.form.getFieldValue(
																"password",
															),
														{
															error: "Passwords do not match",
														},
													)
												: EmailSignupFieldsSchema[name];

										const validationResult =
											fieldValidator.safeParse(value);

										if (!validationResult.success) {
											return validationResult.error
												.issues;
										}
									},
								}}>
								{(field) => (
									<FormControl
										isInvalid={!field.state.meta.isValid}
										isRequired={isFieldRequired(
											EmailSignupFieldsSchema[name],
										)}>
										<AuthFormControlLabel>
											{label}
										</AuthFormControlLabel>

										<AuthFormInput>
											<AuthFormInputField
												placeholder={placeholder}
												className="font-semibold"
												value={field.state.value}
												onBlur={field.handleBlur} // for validate on blur
												onChangeText={
													field.handleChange
												} // for syncing changes to field state
												type={type}
												autoFocus={isFirstInput}
												onSubmitEditing={() => {
													if (isLastInput) {
														void form.handleSubmit();
													}
												}}
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
				{({ canSubmit, isSubmitting: isFormSubmitting }) => {
					const isSubmitting = isFormSubmitting || isApiSubmitting;
					const isDisabled = !canSubmit || isSubmitting;
					return (
						<FlowButton
							accessibilityLabel={"Sign up"}
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
