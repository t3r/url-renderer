// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2023 Torsten Dreyer

import express, { Express, Request, Response } from 'express';
import { urlToImage, cleanup } from './services/urlToImage';

/**
 * Express application instance
 * @type {Express}
 */
const app: Express = express();

/**
 * Handles graceful shutdown of the server and cleanup of resources
 * @returns Promise that resolves when shutdown is complete
 */
async function gracefulShutdown(): Promise<void> {
    console.log('Received shutdown signal. Closing server...');
    if (server) {
        await new Promise<void>(resolve => server.close(() => resolve()));
    }
    await cleanup();
    process.exit(0);
}

// Handle Docker container termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

/**
 * POST endpoint to render a webpage as an image
 * @route POST /render
 * @param {Request} req.body.url - The URL of the webpage to render
 * @param {Request} req.body.options - Screenshot options (width, height, format, etc.)
 * @returns {Response} Image data in the specified format
 */
app.post('/render', async (req: Request, res: Response) => {
    try {
        const { url, ...options } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const image = await urlToImage(url, options);

        res.set('Content-Type', `image/${options.format || 'png'}`);
        res.end(image);
    } catch (error) {
        console.error('Error rendering URL:', error);
        res.status(500).json({ error: 'Failed to render URL' });
    }
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});