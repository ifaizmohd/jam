# jam

JAM stands for Javascript API Manager.

### Purpose.

JAM is build to make cross platform api requests from Browsers, NodeJs servers and React Native.

### Benefits:

1. Node.js compatibility
2. Browser support
3. Same API across platforms

## Installation

`npm install apijam`

## Quick Start

```typescript
import { Jam } from "apijam";

// Initialize client
const client = new Jam("https://api.jam.com/v2");

// Configure authentication
client.setAccessToken("your-api-token-here");
client.setAuthHeaders("Authorization");

// Make API requests
const response = await client.get("/users/me");
```

## API Reference

### Initialization

#### `new Jam(baseUrl?: string)`

Creates a new Jam API client instance.

**Parameters:**

- `baseUrl` (optional): Base URL for all API requests (e.g., `'https://api.jam.com/v2'`)

**Example:**

```typescript
const client = new Jam(process.env.JAM_API_URL);
```

### Configuration Methods

#### `configure(options: IJamClientConfigurations): void`

Configure multiple client options at once.

**Parameters:**

- `options`: Configuration object with optional properties:
  - `baseUrl`: Base API URL
  - `accessToken`: Authentication token

**Example:**

```typescript
client.configure({
  baseUrl: "https://api.jam.com/v2",
  accessToken: "eyJhbGci...",
});
```

#### `setAccessToken(token: string): void`

Set the authentication token for API requests.

**Parameters:**

- `token`: Bearer token or API key

#### `setBaseUrl(baseUrl: string): void`

Update the base URL for API endpoints.

**Parameters:**

- `baseUrl`: New base URL (must be valid URL format)

**Throws:**

- `Error` if invalid URL format provided

#### `setHeaders(headers: Record<string, string>): void`

Merge custom headers with existing configuration.

**Parameters:**

- `headers`: Header key/value pairs

**Example:**

```typescript
client.setHeaders({
  "X-Custom-Header": "value",
  Accept: "application/json",
});
```

#### `setAuthHeaders(header: string): void`

Set authentication header using stored access token.

**Parameters:**

- `header`: Header name to use for authentication (e.g., `'Authorization'`)

**Throws:**

- `Error` if access token not configured

### HTTP Methods

All HTTP methods follow a similar pattern:

```typescript
client.[method](url, payload?, queryParams?): Promise<Response>
```

#### Available Methods:

- `get(url, payload?, queryParams?)`
- `post(url, payload?, queryParams?)`
- `put(url, payload, queryParams?)`
- `delete(url, queryParams?, payload?)`
- `patch(url, payload?, queryParams?)`

**Parameters:**

- `url`: API endpoint path (e.g., `'/users'`)
- `payload` (optional): Request body (not used for GET requests)
- `queryParams` (optional): URL query parameters as key/value pairs

**Returns:**

- `Promise<Response>` (PUT, DELETE, PATCH)
- `Promise<void>` (GET, POST)

**Throws:**

- `HttpError` or `ApiError` on request failure

**Examples:**

```typescript
// GET request with query params
const users = await client.get("/users", null, { active: "true" });

// POST request with payload
const newUser = await client.post("/users", {
  name: "John Doe",
  email: "john@example.com",
});

// DELETE request
await client.delete("/users/123");
```

## Error Handling

The client throws the following error types:

- `HttpError`: For HTTP request failures (GET/POST)
- `ApiError`: For API-level errors (PUT/DELETE/PATCH)
- `Error`: For configuration errors

Handle errors with try/catch:

```typescript
try {
  await client.get("/protected-resource");
} catch (error) {
  if (error instanceof HttpError) {
    console.error("HTTP Error:", error.statusCode);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Best Practices

1. **Reuse client instances**: Create one client and reuse it throughout your application
2. **Environment variables**: Store base URLs and tokens in environment variables
3. **Error boundaries**: Wrap API calls in error handling blocks
4. **Header management**: Set common headers once using `setHeaders()`

## TypeScript Support

The package includes full TypeScript type definitions. All methods and configurations are strongly typed.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss proposed changes.

## License

[MIT](https://choosealicense.com/licenses/mit/)
