import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { validUser, invalidUser } from "../../fixtures/loginTestData";

test.describe('Login Flow', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('Successful Login with username', async ({ page }) => {
        await loginPage.login(validUser[0].username, validUser[0].password);
        await loginPage.verifySuccessfulLogin();
    });

    test('Successful Login with email', async ({ page }) => {
        await loginPage.login(validUser[0].email, validUser[0].password);
        await loginPage.verifySuccessfulLogin();
    });

    test('Login with invalid credentials using username', async ({ page }) => {
        await loginPage.login(invalidUser[0].username, invalidUser[0].password);
        await loginPage.verifyInvalidCredentialsLogin();
    });

    test('Login with invalid credentials using email', async ({ page }) => {
        await loginPage.login(invalidUser[0].email, invalidUser[0].password);
        await loginPage.verifyInvalidCredentialsLogin()
    });

    test('Login with empty fields', async ({ page }) => {
        await loginPage.loginButton.click();
        await loginPage.verifyLoginWithEmptyCredentials();
    });

    test('Login with empty password', async ({ page }) => {
        await loginPage.login(validUser[0].email, '');
        await loginPage.verifyLoginWithEmptyPassword();
    });

    test('Login with empty email/username', async ({ page }) => {
        await loginPage.login('', validUser[0].password);
        await loginPage.verifyLoginWithEmptyEmailUsername();
    });

    test('Login with invalid identifier format', async ({ page }) => {
        await loginPage.login('ab', validUser[0].password);
        
        await loginPage.verifyLoginWithShortEmailUsername();
    });

    test('Login with special characters in username', async ({ page }) => {
        await loginPage.login('user@#$%', validUser[0].password);
        
        await loginPage.verifyLoginWithInvalidEmailUsername();
    });

    test('Login with short password', async ({ page }) => {
        await loginPage.login(validUser[0].username, '12345');
        
        await loginPage.verifyLoginWithShortPassword();
    });

})