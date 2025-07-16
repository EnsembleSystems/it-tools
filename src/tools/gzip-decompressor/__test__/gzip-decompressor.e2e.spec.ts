import { expect, test } from '@playwright/test';

const validGzipBase64 = 'H4sIAAAAAAAAA/NIzcnJVwjPL8pJAQBWsRdKCwAAAA==';

test.describe('Tool - Gzip decompressor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gzip-decompressor');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Gzip decompressor - IT Tools');
  });

  test('Decompresses valid base64 string and shows output', async ({ page }) => {
    const input = page.getByPlaceholder('Paste your GZipped string here...');
    const output = page.locator('textarea[readonly]');

    await input.fill(validGzipBase64);

    // Wait for the output text to contain 'Hello World'
    await expect(output).toHaveValue('Hello World', { timeout: 30000 });
  });

  test('Shows error for invalid input', async ({ page }) => {
    const input = page.getByPlaceholder('Paste your GZipped string here...');

    await expect(input).toBeVisible();
    await input.fill('invalid-base64');

    await expect(page.getByText('Decompression failed. Please ensure the input is valid GZip.')).toBeVisible();
  });
});
