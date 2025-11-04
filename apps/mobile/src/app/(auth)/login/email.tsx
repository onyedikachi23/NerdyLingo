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
import { useLogin } from "@/app-colocation/auth/hooks/useLogin";
import type { EmailLoginForm } from "@/app-colocation/auth/types";
import { isFieldRequired } from "@/app-colocation/auth/utils";
import {
	FlowButton,
	FlowButtonIcon,
	FlowButtonRing,
} from "@/components/ui-common/flow-button";
import { ButtonSpinner } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { EmailLoginFieldsSchema } from "@repo/shared";
import { useForm } from "@tanstack/react-form";
import { ChevronRight } from "lucide-react-native";

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
	const { mutate: login, isPending: isApiSubmitting } = useLogin();
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		} satisfies EmailLoginForm,
		onSubmit: ({ value }) => login(value),
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
									onBlur: EmailLoginFieldsSchema[name],
								}}>
								{(field) => (
									<FormControl
										isInvalid={!field.state.meta.isValid}
										isRequired={isFieldRequired(
											EmailLoginFieldsSchema[name],
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
