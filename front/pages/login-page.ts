import { Page, Locator, expect } from "@playwright/test";
import { LOGIN_MESSAGES } from "../fixtures/testData";

export class LoginPage {
    
    readonly page: Page;
    readonly emailUsernameInput: Locator;
    readonly emailUsernameErrorMessage: Locator;
    readonly passwordInput: Locator;
    readonly passwordErrorMessage: Locator;
    readonly loginButton: Locator;
    readonly toastMessage: Locator;

    constructor(page: Page) {

        this.page = page;

        this.emailUsernameInput = page.getByTestId('login-email-username');
        this.emailUsernameErrorMessage = page.getByTestId('email-username-error')
        this.passwordInput = page.getByTestId('login-password');
        this.passwordErrorMessage = page.getByTestId('password-error');
        this.loginButton = page.getByTestId('login-button');
        this.toastMessage = page.getByTestId('toast-message');

    }

    async navigate() {
        await this.page.goto('/login');
    }

    async login(username: string, password: string) {
        await this.emailUsernameInput.fill(username);
        await this.passwordInput.fill(password);

        await this.loginButton.click();
    }

    async verifySuccessfulLogin() {
        await expect(this.page).toHaveURL('/');
        await expect(this.toastMessage).toBeVisible();
        await expect(this.toastMessage).toHaveText(LOGIN_MESSAGES.LOGIN_SUCCESS);
    }

    async verifyInvalidCredentialsLogin() {
        await expect(this.page).toHaveURL('/login');
        await expect(this.toastMessage).toBeVisible();
        await expect(this.toastMessage).toHaveText(LOGIN_MESSAGES.INVALID_CREDENTIALS);
    }

    async verifyLoginWithEmptyCredentials() {
        await expect(this.emailUsernameErrorMessage).toHaveText(LOGIN_MESSAGES.EMPTY_EMAIL_USERNAME);
        await expect(this.passwordErrorMessage).toHaveText(LOGIN_MESSAGES.EMPTY_PASSWORD);
        await expect(this.page).toHaveURL('/login');
    }

    async verifyLoginWithEmptyPassword() {
        await expect(this.passwordErrorMessage).toHaveText(LOGIN_MESSAGES.EMPTY_PASSWORD);
        await expect(this.page).toHaveURL('/login');
    }

    async verifyLoginWithEmptyEmailUsername() {
        await expect(this.emailUsernameErrorMessage).toHaveText(LOGIN_MESSAGES.EMPTY_EMAIL_USERNAME);
        await expect(this.page).toHaveURL('/login');
    }

    async verifyLoginWithShortEmailUsername() {
        await expect(this.emailUsernameErrorMessage).toHaveText(LOGIN_MESSAGES.INVALID_EMAIL_USERNAME);
        await expect(this.page).toHaveURL('/login');
    }

    async verifyLoginWithInvalidEmailUsername() {
        await expect(this.emailUsernameErrorMessage).toHaveText(LOGIN_MESSAGES.INVALID_EMAIL_USERNAME);
        await expect(this.page).toHaveURL('/login');
    }

    async verifyLoginWithShortPassword() {
        await expect(this.passwordErrorMessage).toHaveText(LOGIN_MESSAGES.SHORT_PASSWORD);
        await expect(this.page).toHaveURL('/login');
    }
}