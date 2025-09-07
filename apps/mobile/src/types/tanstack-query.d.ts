/** @format */

import type { ApiErrorResponse } from "@/lib/axios-instance";
import type {
	QueryCache,
	UseMutationOptions as RQUseMutationOptions,
} from "@tanstack/react-query";

type QueryCacheConfig = NonNullable<
	ConstructorParameters<typeof QueryCache>[number]
>;

interface QueryMeta
	extends Record<string, unknown>,
		Pick<QueryCacheConfig, "onSuccess"> {
	/**
	 * Controls default toast notifications on query error, processed by `queryCache.onError`.
	 *
	 * - If this is a string (excluding "no-toast") or a function that returns the aforementioned, that string will be used as the title for the default toast notification.
	 * - If this is a string "no-toast" or a function that returns the aforementioned, no default toast notification will be shown.
	 * - If this is property is not provided or is a function that returns nothing (void/undefined), a default toast notification is shown for all the query's errors.
	 * - **Tip:** Returning "none" can be handy when you want to control the toast notifications entirely yourself.
	 */
	onError?:
		| StringWithSuggestions<"no-toast">
		| ((
				...args: Parameters<QueryCacheConfig["onError"]>
		  ) => "no-toast" | void);
}

declare module "@tanstack/react-query" {
	interface Register {
		defaultError: ApiErrorResponse;
		queryMeta: QueryMeta;
		mutationMeta: {
			invalidates?: QueryKey[];
		};
	}
}
