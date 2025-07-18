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

    const output = page.getByPlaceholder('Decompressed result will appear here...');

    await input.fill(validGzipBase64);

    await expect(output).toHaveValue('Hello World');
  });

  test('Shows error for invalid input', async ({ page }) => {
    const input = page.getByPlaceholder('Paste your GZipped string here...');

    await input.fill('invalid-base64');

    await expect(page.getByText('Decompression failed')).toBeVisible({ timeout: 10000 });
  });
});
