// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2023 Torsten Dreyer

import puppeteer, { Browser, Page } from 'puppeteer';

/**
 * Configuration options for taking screenshots
 * @interface ScreenshotOptions
 */
interface ScreenshotOptions {
    /** Width of the viewport in pixels */
    width?: number;
    /** Height of the viewport in pixels */
    height?: number;
    /** Device scale factor (pixel ratio) */
    deviceScaleFactor?: number;
    /** Maximum time to wait for page load in milliseconds */
    timeout?: number;
    /** Output format of the screenshot */
    format?: 'jpeg' | 'png';
    /** Whether to capture the full scrollable page */
    fullPage?: boolean;
    /** JPEG quality (1-100), only applicable when format is 'jpeg' */
    quality?: number;
}

let browser: Browser | null = null;

/**
 * Captures a screenshot of a webpage at the specified URL
 * @param url - The URL of the webpage to capture
 * @param options - Configuration options for the screenshot
 * @returns Promise resolving to a Uint8Array containing the image data
 * @throws Will throw an error if the page cannot be loaded or screenshot fails
 */
async function urlToImage(url: string, options: ScreenshotOptions = {}): Promise<Uint8Array> {
    if( !browser ) {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: process.env.CHROME_BIN || undefined
        });
    }

    let page: Page = await browser.newPage();
    try {
        // Set viewport size
        await page.setViewport({
            width: options.width || 1920,
            height: options.height || 1080,
            deviceScaleFactor: options.deviceScaleFactor || 1,
        });

        // Navigate to URL
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: options.timeout || 30000
        });

        // Take screenshot
        const screenshot = await page.screenshot({
            type: options.format || 'png',
            fullPage: options.fullPage || false,
            quality: options.quality || (options.format === 'jpeg' ? 80 : undefined)
        });

        return screenshot;
    } finally {
        await page.close();
    }
}

/**
 * Cleans up browser resources
 * @returns Promise that resolves when cleanup is complete
 */
async function cleanup(): Promise<void> {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

export { urlToImage, cleanup, ScreenshotOptions };