import { expect, test } from '@playwright/test';

test.describe('Tool - Json data condenser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-data-condenser');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Json data condenser - IT Tools');
  });

  test('Condenses valid JSON input correctly', async ({ page }) => {
    const validJson = JSON.stringify({
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'David', email: 'david@example.com' },
        { id: 5, name: 'Eve' },
      ],
      status: 'active',
    }, null, 2);

    await page.getByPlaceholder('Paste a JSON payload here...').fill(validJson);
    await page.getByRole('button', { name: 'Condense JSON' }).click();

    const outputTextarea = page.getByPlaceholder('Condensed JSON will appear here...');
    const outputText = await outputTextarea.inputValue();

    expect(outputText).toContain('"status": "active"');
    expect(outputText).toContain('Alice');
    expect(outputText).toContain('David');
    expect(outputText).not.toContain('Bob');
    expect(outputText).not.toContain('Charlie');
    expect(outputText).not.toContain('Eve');
  });

  test('Displays error on invalid JSON input', async ({ page }) => {
    await page.getByPlaceholder('Paste a JSON payload here...').fill('{ invalid json ');
    await page.getByRole('button', { name: 'Condense JSON' }).click();

    await expect(page.getByText('Invalid JSON input. Please fix and try again.')).toBeVisible();
  });

  test('Handles nested arrays of objects and preserves distinct structures', async ({ page }) => {
    const nestedJson = JSON.stringify({
      data: {
        results: [
          {
            id: '1',
            components: [
              { content_type: 'text', content: { format: 'markdown', text: 'Foo' } },
              { content_type: 'video', content: { video_id: 'v1', duration: '1:00', platform: 'yt' } },
              { content_type: 'image', content: { url: 'i.jpg', alt: 'Bar' } },
              { content_type: 'text', content: { format: 'markdown', text: 'Baz' } },
            ],
          },
          {
            id: '2',
            components: [
              { content_type: 'code', content: { lang: 'js', code: 'x' } },
              { content_type: 'code', content: { lang: 'py', code: 'y' } },
            ],
          },
        ],
      },
    }, null, 2);

    await page.getByPlaceholder('Paste a JSON payload here...').fill(nestedJson);
    await page.getByRole('button', { name: 'Condense JSON' }).click();

    const outputTextarea = page.getByPlaceholder('Condensed JSON will appear here...');
    const outputText = await outputTextarea.inputValue();

    expect(outputText).toContain('"format": "markdown"');
    expect(outputText).toContain('"video_id": "v1"');
    expect(outputText).toContain('"url": "i.jpg"');
    expect(outputText).toContain('"lang": "js"');

    expect(outputText).not.toContain('"text": "Baz"');
    expect(outputText).not.toContain('"lang": "py"');
  });

  test('Copies condensed JSON to clipboard', async ({ page }) => {
    const validJson = JSON.stringify({
      items: [
        { id: 1, name: 'Foo' },
        { id: 2, name: 'Bar' },
        { id: 3, name: 'Baz', extra: true },
      ],
    });

    await page.getByPlaceholder('Paste a JSON payload here...').fill(validJson);
    await page.getByRole('button', { name: 'Condense JSON' }).click();

    // Click the copy button
    await page.getByRole('button', { name: 'Copy' }).click();

    // Read from clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    // Confirm clipboard contains condensed data
    expect(clipboardText).toContain('"id": 1');
    expect(clipboardText).toContain('"name": "Foo"');
  });
});
