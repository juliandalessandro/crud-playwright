import { test, expect } from '@playwright/test';

test.describe('Upload Record Flow', () => {

    test('Successful Record Upload', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('upload-record-button').click();
        await expect(page).toHaveURL('/uploadRecord');
    });

})