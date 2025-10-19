export type ApiResponse<
	TPaths,
	TPath extends keyof TPaths,
	TMethod extends keyof TPaths[TPath],
> = TPaths[TPath][TMethod] extends {
	responses: { 200: { content: { 'application/json': infer TResponse } } }
} ? TResponse
	: never
