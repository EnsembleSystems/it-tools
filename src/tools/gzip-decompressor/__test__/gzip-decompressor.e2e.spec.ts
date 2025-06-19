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
    const input = page.getByLabel('GZipped User Input');
    const output = page.getByLabel('Decompressed Output');

    await input.fill(validGzipBase64);

    await expect(output).toHaveValue('Hello World');
  });

  test('Shows error for invalid input', async ({ page }) => {
    const input = page.getByLabel('GZipped User Input');

    await input.fill('invalid-base64');

    const alert = page.getByRole('alert');
    await expect(alert).toContainText('Decompression failed');
  });
});
