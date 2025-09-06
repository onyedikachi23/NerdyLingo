/** @format */

import {
	ArgumentMetadata,
	BadRequestException,
	HttpStatus,
	PipeTransform,
} from "@nestjs/common";
import z from "zod";

export class ZodValidationException<T = unknown> extends BadRequestException {
	constructor(private readonly error: T) {
		super({
			statusCode: HttpStatus.BAD_REQUEST,
			message:
				error instanceof z.ZodError
					? error.issues.map(({ message }) => message).join(", ")
					: "Validation failed",
			errors:
				error instanceof z.ZodError
					? // error && typeof error === "object" && "issues" in error
						error.issues
					: undefined,
		});
	}
	getZodError() {
		return this.error;
	}
}

export class ZodValidationPipe implements PipeTransform {
	constructor(private readonly schema: z.ZodType) {}

	transform(value: unknown, _metadata: ArgumentMetadata) {
		try {
			const parsedValue = this.schema.parse(value);
			return parsedValue;
		} catch (error) {
			throw new ZodValidationException(error);
		}
	}
}
