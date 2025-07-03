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

    await expect(page.getByText('"status": "active"')).toBeVisible();
    await expect(page.getByText('"email": "david@example.com"')).toBeVisible();

    // Only Alice and David (with different structure) should remain
    await expect(page.locator('textarea')).toContainText('Alice');
    await expect(page.locator('textarea')).toContainText('David');
    await expect(page.locator('textarea')).not.toContainText('Bob');
    await expect(page.locator('textarea')).not.toContainText('Charlie');
    await expect(page.locator('textarea')).not.toContainText('Eve');
  });

  test('Displays error on invalid JSON input', async ({ page }) => {
    await page.getByPlaceholder('Paste a JSON payload here...').fill('{ invalid json ');
    await page.getByRole('button', { name: 'Condense JSON' }).click();

    await expect(page.getByText('Invalid JSON input. Please fix and try again.')).toBeVisible();
  });
});
