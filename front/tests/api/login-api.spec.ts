import { test, expect } from '@playwright/test';
import { validUser } from '../../fixtures/loginTestData';

test.describe('Auth API', () => {

    const API_BASE_URL = 'http://localhost:3001';

    test('POST /auth/login - Successful login with username', async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: {
                identifier: validUser[0].username,
                password: validUser[0].password
            }
        });

        // Verify status code
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        // Verify headers
        const headers = response.headers();
        expect(headers['content-type']).toContain('application/json');

        // Verify body
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('user');
        expect(responseBody.user).toHaveProperty('username', validUser[0].username);
        expect(responseBody.user).toHaveProperty('email', validUser[0].email);
        expect(responseBody.user).not.toHaveProperty('password');

        // Verify cookies
        const setCookie = headers['set-cookie'];
        expect(setCookie).toBeDefined();
        expect(setCookie).toContain('accessToken');
    });
});