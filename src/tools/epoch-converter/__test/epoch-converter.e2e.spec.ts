import { expect, test } from '@playwright/test';

test.describe('Tool - Epoch converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/epoch-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Epoch converter - IT Tools');
  });

  test('Converts epoch to human-readable date', async ({ page }) => {
    await page.getByPlaceholder('Enter epoch timestamp').fill('1750452480');
    await page.getByRole('button', { name: 'Convert to Date' }).click();

    const utcLine = page.locator('text=GMT (UTC):');
    const localLine = page.locator('text=Local Time:');

    await expect(utcLine).toContainText('GMT (UTC): Fri, 20 Jun 2025 20:48:00 GMT');
    await expect(localLine).toContainText('Local Time:');
    await expect(localLine).toContainText('Jun 20, 2025');
    await expect(localLine).toContainText('22:48:00');
    await expect(localLine).toContainText('GMT+2');
  });

  test('Converts known date to epoch timestamp', async ({ page }) => {
    await page.getByPlaceholder('YYYY').fill('2025');
    await page.getByPlaceholder('MM').first().fill('06');
    await page.getByPlaceholder('DD').fill('20');
    await page.getByPlaceholder('HH').fill('13');
    await page.getByPlaceholder('MM').nth(1).fill('48');
    await page.getByPlaceholder('SS').fill('00');

    await page.getByRole('button', { name: 'Convert to Epoch (Local)' }).click();

    await expect(page.getByText('1750420080')).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: 'Convert to Epoch (UTC)' }).click();

    await expect(page.getByText('1750427280')).toBeVisible({ timeout: 5000 });
  });

  test('Shows error if year is not 4 digits', async ({ page }) => {
    await page.getByPlaceholder('YYYY').fill('99');
    await page.getByRole('button', { name: 'Convert to Epoch (Local)' }).click();
    await expect(page.getByText('Year must be 4 digits')).toBeVisible({ timeout: 5000 });
  });

  test('Shows error if month is invalid', async ({ page }) => {
    await page.getByPlaceholder('YYYY').fill('1999');
    await page.getByPlaceholder('MM').first().fill('00');
    await page.getByRole('button', { name: 'Convert to Epoch (Local)' }).click();
    await expect(page.getByText('Month must be between 1 and 12')).toBeVisible({ timeout: 5000 });
  });

  test('Shows error if day is invalid', async ({ page }) => {
    await page.getByPlaceholder('YYYY').fill('1999');
    await page.getByPlaceholder('MM').first().fill('01');
    await page.getByPlaceholder('DD').fill('0');
    await page.getByRole('button', { name: 'Convert to Epoch (UTC)' }).click();
    await expect(page.getByText('Day must be between 1 and 31')).toBeVisible({ timeout: 5000 });
  });

  test('Shows error if hour is invalid', async ({ page }) => {
    await page.getByPlaceholder('YYYY').fill('1999');
    await page.getByPlaceholder('MM').first().fill('01');
    await page.getByPlaceholder('DD').fill('1');
    await page.getByPlaceholder('HH').fill('24');
    await page.getByRole('button', { name: 'Convert to Epoch (Local)' }).click();
    await expect(page.getByText('Hour must be between 0 and 23')).toBeVisible({ timeout: 5000 });
  });

  test('Shows error if minute is invalid', async ({ page }) => {
    await page.getByPlaceholder('YYYY').fill('1999');
    await page.getByPlaceholder('MM').first().fill('01');
    await page.getByPlaceholder('DD').fill('1');
    await page.getByPlaceholder('HH').fill('23');
    await page.getByPlaceholder('MM').nth(1).fill('60');
    await page.getByRole('button', { name: 'Convert to Epoch (UTC)' }).click();
    await expect(page.getByText('Minute must be between 0 and 59')).toBeVisible({ timeout: 5000 });
  });

  test('Shows error if second is invalid', async ({ page }) => {
    await page.getByPlaceholder('YYYY').fill('1999');
    await page.getByPlaceholder('MM').first().fill('01');
    await page.getByPlaceholder('DD').fill('1');
    await page.getByPlaceholder('HH').fill('23');
    await page.getByPlaceholder('MM').nth(1).fill('59');
    await page.getByPlaceholder('SS').fill('99');
    await page.getByRole('button', { name: 'Convert to Epoch (UTC)' }).click();
    await expect(page.getByText('Second must be between 0 and 59')).toBeVisible({ timeout: 5000 });
  });

  test('Shows error for invalid combination like February 31', async ({ page }) => {
    await page.getByPlaceholder('YYYY').fill('2024');
    await page.getByPlaceholder('MM').first().fill('02');
    await page.getByPlaceholder('DD').fill('31');
    await page.getByPlaceholder('HH').fill('12');
    await page.getByPlaceholder('MM').nth(1).fill('00');
    await page.getByPlaceholder('SS').fill('00');
    await page.getByRole('button', { name: 'Convert to Epoch (Local)' }).click();

    await expect(page.getByText('Invalid date string')).toBeVisible({ timeout: 30000 });
  });

  test('Shows error for invalid date like April 31', async ({ page }) => {
    await page.getByPlaceholder('YYYY').fill('2024');
    await page.getByPlaceholder('MM').first().fill('04');
    await page.getByPlaceholder('DD').fill('31');
    await page.getByPlaceholder('HH').fill('12');
    await page.getByPlaceholder('MM').nth(1).fill('00');
    await page.getByPlaceholder('SS').fill('00');
    await page.getByRole('button', { name: 'Convert to Epoch (UTC)' }).click();
    await expect(page.locator('.c-alert--icon')).toBeVisible({ timeout: 60000 });

    await expect(page.getByText('Invalid date string')).toBeVisible({ timeout: 60000 });
  });

  test('Allows valid leap year date: February 29, 2024', async ({ page }) => {
    await page.getByPlaceholder('YYYY').fill('2024');
    await page.getByPlaceholder('MM').first().fill('02');
    await page.getByPlaceholder('DD').fill('29');
    await page.getByPlaceholder('HH').fill('12');
    await page.getByPlaceholder('MM').nth(1).fill('00');
    await page.getByPlaceholder('SS').fill('00');

    await page.getByRole('button', { name: 'Convert to Epoch (UTC)' }).click();

    // Should not show any error alert
    await expect(page.getByText('1709208000')).toBeVisible({ timeout: 5000 });
  });
});
