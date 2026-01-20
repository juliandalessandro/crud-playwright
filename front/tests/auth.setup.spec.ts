import { test, expect } from '@playwright/test';

test('Authenticate User', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('login-email-username').fill('usuario1');
  await page.getByTestId('login-password').fill('usuario1');
  await page.getByTestId('login-button').click();

  // Validación mínima (importante)
  await expect(page).toHaveURL('/');

  // Guardar sesión
  await page.context().storageState({
    path: 'storage/auth.json',
  });
});
