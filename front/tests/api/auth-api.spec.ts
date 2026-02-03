import { test, expect } from '@playwright/test';
import { invalidUser, nonExistentUser, validUser } from '../../fixtures/loginTestData';
import { loginAndGetCookies } from '../helpers/authApiHelpers';

test.describe('Auth API', () => {

    const API_BASE_URL = 'http://localhost:3001';

    test.describe('POST /auth/login - Successful cases', () => {
        test('with username', async ({ request }) => {
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

        test('with email', async ({ request }) => {
            const response = await request.post(`${API_BASE_URL}/auth/login`, {
                data: {
                    identifier: validUser[0].email,
                    password: validUser[0].password
                }
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);

            const headers = response.headers();
            expect(headers['content-type']).toContain('application/json');

            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('user');
            expect(responseBody.user).toHaveProperty('username', validUser[0].username);
            expect(responseBody.user).toHaveProperty('email', validUser[0].email);
            expect(responseBody.user).not.toHaveProperty('password');

            const setCookie = headers['set-cookie'];
            expect(setCookie).toBeDefined();
            expect(setCookie).toContain('accessToken');
        });
    })

    test.describe('POST /auth/login - Error cases', () => {

        test('with invalid password', async ({ request }) => {
            const response = await request.post(`${API_BASE_URL}/auth/login`, {
                data: {
                    identifier: invalidUser[0].username,
                    password: invalidUser[0].password
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(401);

            const headers = response.headers();
            expect(headers['content-type']).toContain('application/json');

            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error', 'Invalid login');

            const setCookie = headers['set-cookie'];
            expect(setCookie).not.toBeDefined();
        });

        test('with non-existent user', async ({ request }) => {
            const response = await request.post(`${API_BASE_URL}/auth/login`, {
                data: {
                    identifier: nonExistentUser[0].username,
                    password: nonExistentUser[0].password
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(401);

            const headers = response.headers();
            expect(headers['content-type']).toContain('application/json');

            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error', 'Invalid login');

            const setCookie = headers['set-cookie'];
            expect(setCookie).not.toBeDefined();
        });

        test('with empty credentials', async ({ request }) => {
            const response = await request.post(`${API_BASE_URL}/auth/login`, {
                data: {
                    identifier: '',
                    password: ''
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(401);

            const headers = response.headers();
            expect(headers['content-type']).toContain('application/json');

            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error', 'Invalid login');

            const setCookie = headers['set-cookie'];
            expect(setCookie).not.toBeDefined();
        });

        test('with empty username/email', async ({ request }) => {
            const response = await request.post(`${API_BASE_URL}/auth/login`, {
                data: {
                    identifier: '',
                    password: validUser[0].password
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(401);

            const headers = response.headers();
            expect(headers['content-type']).toContain('application/json');

            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error', 'Invalid login');

            const setCookie = headers['set-cookie'];
            expect(setCookie).not.toBeDefined();
        });

        test('with empty password', async ({ request }) => {
            const response = await request.post(`${API_BASE_URL}/auth/login`, {
                data: {
                    identifier: validUser[0].username,
                    password: ''
                }
            });

            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(401);

            const headers = response.headers();
            expect(headers['content-type']).toContain('application/json');

            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error', 'Invalid login');

            const setCookie = headers['set-cookie'];
            expect(setCookie).not.toBeDefined();
        });

    })

    test.describe('POST /auth/logout', () => {
        test('logout successfully after login', async ({ request }) => {
            
            // Login and get cookies
            const { cookieHeader, csrfValue } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );
            
            // Logout
            const logoutResponse = await request.post(`${API_BASE_URL}/auth/logout`, {
                headers: {
                    'Cookie': cookieHeader,
                    'x-csrf-token': csrfValue
                }
            });

            expect(logoutResponse.status()).toBe(200);
            const logoutBody = await logoutResponse.json();
            expect(logoutBody).toHaveProperty('message', 'Logged out');
            
        });

        test('logout fails without authentication', async ({ request }) => {

            const response = await request.post(`${API_BASE_URL}/auth/logout/`);

            expect(response.status()).toBe(401);
            const body = await response.json();
            expect(body).toHaveProperty('error');
        });

        test('logout fails without CSRF token', async ({ request }) => {
            
            const { cookieHeader } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );

            const response = await request.post(`${API_BASE_URL}/auth/logout`, {
                headers : {
                    'Cookie': cookieHeader
                }
            });

            expect(response.status()).toBe(403);
        });
    })

    test.describe('POST /auth/refresh', () => {

        test('refresh token successfully', async ({ request }) => {

            const { cookieHeader } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );

            await new Promise (resolve => setTimeout(resolve, 1000));

            const refreshResponse = await request.post(`${API_BASE_URL}/auth/refresh`, {

                headers: {
                    'Cookie': cookieHeader
                }
            });

            expect(refreshResponse.status()).toBe(200);
            const body = await refreshResponse.json();
            expect(body).toHaveProperty('message', 'Token refreshed');

            const newCookies = refreshResponse.headers()['set-cookie'];
            expect(newCookies).toContain('accessToken');

        });

        test('refresh fails withotu refresh token', async ({ request }) => {

            const response = await request.post(`${API_BASE_URL}/auth/refresh`);

            expect(response.status()).toBe(401);
            const body = await response.json();
            expect(body).toHaveProperty('error', 'No refresh token')

        });
    })

    test.describe('GET /auth/me', () => {

        test('get current user info', async ({ request}) => {

            const { cookieHeader } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );

            const meResponse = await request.get(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Cookie': cookieHeader
                }
            });

            expect(meResponse.status()).toBe(200);
            const body = await meResponse.json();
            expect(body).toHaveProperty('user');
            expect(body.user).toHaveProperty('id');

        });
        
        test('fails without identification', async ({ request }) => {

            const response = await request.get(`${API_BASE_URL}/auth/me`);

            expect(response.status()).toBe(401);

        });

    })

    test.describe('Security Tests', () => { 
        
        test('password is not exposed in response', async ({ request }) => {

            const response = await request.post(`${API_BASE_URL}/auth/login`, {
                data: {
                    identifier: validUser[0].username,
                    password: validUser[0].password,
                }
            });

            const body = await response.json();
            const responseText = JSON.stringify(body);

            expect(responseText).not.toContain(validUser[0].password);
            expect(body.user).not.toHaveProperty('password');

        });

        test('cookies have security flags', async ({ request }) => {

            const response = await request.post(`${API_BASE_URL}/auth/login`, {
                data: {
                    identifier: validUser[0].username,
                    password: validUser[0].password,
                }
            });

            const setCookie = response.headers()['set-cookie'];
            
            expect(setCookie).toContain('HttpOnly');
            expect(setCookie).toContain('SameSite=Lax');
            expect(setCookie).toContain('Path=/');
            expect(setCookie).toContain('Domain=localhost');

        });

        test('SQL injection attempt is blocked', async ({ request }) => {

            const response = await request.post(`${API_BASE_URL}/auth/login`, {
                data: {
                    identifier: "admin' OR '1'='1",
                    password: "anything"
                }
            });

            expect(response.status()).toBe(401);
        })
    })

    test.describe('Performance Tests', () => {
        
        test('login response time is under 1 second', async ({ request }) => {
            const startTime = Date.now();

            await request.post(`${API_BASE_URL}/auth/login`, {
                data: {
                    identifier: validUser[0].username,
                    password: validUser[0].password
                }
            });

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            expect(responseTime).toBeLessThan(1000);
        });

    })
    
});