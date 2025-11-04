/** @format */

interface BaseApiResponse {
	success: boolean;
	message: string;
}

type DataGeneric =
	| {
			hasData: false;
			data?: never;
	  }
	| {
			hasData?: true;
			data: unknown;
	  };
type ApiSuccessResponse<TDataGeneric extends DataGeneric = { hasData: false }> =
	Prettify<
		(BaseApiResponse & { success: true }) &
			(TDataGeneric["hasData"] extends false
				? {
						data?: never;
					}
				: {
						data: TDataGeneric["data"];
					})
	>;

interface ApiErrorResponse extends BaseApiResponse {
	success: false;
}

export * from "./src/auth.js";
export * from "./src/vt-socket-events.js";
export type { ApiErrorResponse, ApiSuccessResponse };
