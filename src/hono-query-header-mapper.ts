import { Context, Next } from 'hono'

/**
 * queryParam  -> URL query param name
 * headerName  -> header name
 * transform?     -> token/value's header format
 */
export const queryHeaderMapper = (
  queryParam: string,
  headerName: string,
  transform?: (val: string) => string
) => {
  return async (c: Context, next: Next) => {
    const val = c.req.query(queryParam)
    if (val) {
      const originalRequest = c.req.raw
      const newHeaders = new Headers(originalRequest.headers)

      const headerValue = transform ? transform(val) : val
      newHeaders.set(headerName, headerValue)

      const { headers, ...rest } = originalRequest
      c.req.raw = new Request(originalRequest, {
        ...rest,
        method: originalRequest.method,
        body: originalRequest.body,
        headers: newHeaders,
      })
    }

    await next()
  }
}
