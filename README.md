# 🔗 hono-query-header-mapper

> **Hono middleware** for mapping URL query parameters into HTTP headers—perfect for situations where headers can’t be set client-side (e.g., presigned URLs, EventSource).

## ✨ Features

- Extract a query parameter and set it as any request header
- Optional transformation of the value (e.g., adding a `Bearer ` prefix)
- Easy plug-and-play integration with Hono

## 🛠️ Installation

Install via npm or Yarn:

```bash
npm install hono-query-header-mapper
# or
yarn add hono-query-header-mapper
```

## 🚀 Usage

Import the middleware and apply it before any header-based handlers (e.g., JWT):

```ts
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { queryHeaderMapper } from 'hono-query-header-mapper'

const app = new Hono()

app.use(
  '/protected/*',
  queryHeaderMapper('accessToken', 'Authorization', value => `Bearer ${value}`),
  jwt({ secret: 'YOUR_SECRET_KEY' })
)

app.get('/protected/hello', c => {
  return c.text('Hello, secured world!')
})

app.fire()
```

## 📖 API Reference

### `queryHeaderMapper(queryParam: string, headerName: string, transform?: (value: string) => string)`

- \`\`: The name of the URL query parameter to read.
- \`\`: The HTTP header name to set on the request.
- \`\` *(optional)*: A function to transform the raw query value before setting it as the header. Defaults to the identity function.

**Returns**: A Hono-compatible middleware function: `(c: Context, next: Next) => Promise<void>`.

## 🏷️ Common Scenarios

### 📦 Presigned Download URLs

When using presigned URLs (e.g., AWS S3) you cannot set headers on the client. Include an authentication token as a query parameter and use this middleware to promote it into the `Authorization` header for downstream handlers.

```ts
app.get(
  '/download',
  queryHeaderMapper('token', 'Authorization', t => `Bearer ${t}`),
  downloadHandler
)
```

### 🌐 Server-Sent Events (SSE)

The `EventSource` API does not allow custom headers. Pass session credentials as query parameters and elevate them into headers on the server to secure SSE streams.

```ts
app.get(
  '/events',
  queryHeaderMapper('sessionId', 'X-Session-Id'),
  eventStreamHandler
)
```

### 🔒 Webhooks and Other Raw Values

Use the middleware without a transformer to forward a raw signature or token:

```ts
app.post(
  '/webhook',
  queryHeaderMapper('sig', 'X-Signature'),
  webhookHandler
)
```

### 🗂️ Grouped Middleware

You can also apply it within a route group:

```ts
app.group('/api', api => {
  api.use(queryHeaderMapper('apiKey', 'X-Api-Key'))
  api.use(jwt({ secret: '...' }))
  api.get('/data', dataHandler)
})
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please open an issue or submit a pull request on GitHub.

## 📄 License

MIT

