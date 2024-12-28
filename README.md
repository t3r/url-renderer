# URL to Image Renderer

A TypeScript application that converts web pages to images using Puppeteer and Chromium. The service provides a REST API endpoint that accepts URLs and returns screenshots of the rendered web pages.

## Application Overview

This application sets up a web service that can capture screenshots of any web page. It uses:
- Express.js to handle HTTP requests
- Puppeteer to control a headless Chrome/Chromium browser
- TypeScript for type safety and better development experience

The service is particularly useful for:
- Generating thumbnails of web pages
- Creating automated screenshots for testing
- Archiving visual snapshots of web content
- Rendering web pages for preview purposes

## Features

- Convert any web page to an image
- Customizable viewport dimensions
- Configurable device scale factor
- Timeout settings for page loads
- RESTful API interface
- Docker-ready
- Graceful shutdown handling
- Resource cleanup on exit

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome/Chromium (for local development)

## Project Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create tsconfig.json (if not present):
```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Development

1. Start the development server:
```bash
npm start
```
This uses ts-node to run TypeScript code directly without compilation.

2. For development with auto-reload, you can add nodemon:
```bash
npm install --save-dev nodemon
```
Then add to package.json scripts:
```json
"dev": "nodemon --exec ts-node src/index.ts"
```

## Building for Production

1. Compile TypeScript to JavaScript:
```bash
npm run build
```
This will create compiled JavaScript files in the `dist` directory.

2. Run the compiled application:
```bash
node dist/index.js
```

3. For production deployment, ensure all dependencies are installed:
```bash
npm install --production
```

## API Usage

Send POST requests to capture screenshots:

```bash
curl -X POST "http://localhost:3000/screenshot" \
-H "Content-Type: application/json" \
-d '{
  "url": "https://example.com",
  "width": 1920,
  "height": 1080
}'
```

### Request Body (ScreenshotOptions)

The screenshot endpoint accepts a JSON payload with the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| url | string | Yes | The URL of the webpage to capture |
| width | number | No | The viewport width in pixels (default: 1920) |
| height | number | No | The viewport height in pixels (default: 1080) |
| fullPage | boolean | No | Whether to capture the full scrollable page (default: false) |
| deviceScaleFactor | number | No | Device scale factor (default: 1) |
| quality | number | No | JPEG quality from 0-100 (default: 80) |
| timeout | number | No | Maximum navigation time in milliseconds (default: 30000) |


## Environment Variables

- `PORT`: Server port (default: 3000)
- `CHROME_BIN`: Path to Chrome/Chromium executable (optional)

## Project Structure
```
.
├── src/
│   ├── index.ts              # Main application entry point
│   └── services/
│       └── urlToImage.ts     # Screenshot service implementation
├── package.json
└── tsconfig.json
```

## Error Handling

The application includes proper error handling for:
- Invalid URLs
- Timeout errors
- Browser initialization failures
- Memory management with proper cleanup

## Deployment

The application can be deployed:
1. Directly on a server with Node.js and Chrome/Chromium installed
2. Using Docker (recommended for consistent environments)

Remember to set appropriate environment variables and ensure sufficient memory for Chrome/Chromium operations.

## Trivia

Everything in this repository (including this README) was written with a lot of support from AWS Q Developer.

## License

GPL-2.0-or-later