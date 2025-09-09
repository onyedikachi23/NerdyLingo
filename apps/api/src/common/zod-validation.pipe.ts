/** @format */

import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform,
} from "@nestjs/common";
import z from "zod";

export class ZodValidationException<T = unknown> extends BadRequestException {
	constructor(private readonly error: T) {
		super(
			error instanceof z.ZodError
				? z.prettifyError(error)
				: "Validation failed",
			{
				cause: error,
			},
		);
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
