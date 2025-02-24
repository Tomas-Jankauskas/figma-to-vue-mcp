# Figma to Vue MCP Server

A Model Context Protocol (MCP) server that generates Vue 3 components from Figma designs, following Hostinger's design system and HComponents requirements.

## Features

- Converts Figma designs to Vue 3 components with TypeScript and `<script setup>` syntax
- Automatically imports and uses HComponents where appropriate
- Generates BEM-style CSS classes
- Preserves design system consistency
- Handles responsive layouts
- Supports component props and dynamic content

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Tomas-Jankauskas/figma-to-vue-mcp.git
cd figma-to-vue-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Figma access token:
```bash
FIGMA_ACCESS_TOKEN=your_figma_access_token
PORT=3000  # Optional, defaults to 3000
```

4. Start the server:
```bash
npm run dev  # For development
# or
npm start    # For production
```

## Usage

Send a POST request to `/generate-component` with the following body:

```json
{
  "figmaUrl": "https://www.figma.com/file/[FILE_KEY]/[FILE_NAME]?node-id=[NODE_ID]",
  "componentName": "MyComponent"
}
```

The server will respond with:

```json
{
  "component": "// Generated Vue component code"
}
```

## Example

```bash
curl -X POST http://localhost:3000/generate-component \
  -H "Content-Type: application/json" \
  -d '{
    "figmaUrl": "https://www.figma.com/file/abc123/MyDesign?node-id=1:1",
    "componentName": "YoutubeLinks"
  }'
```

## Development

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm test`: Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT