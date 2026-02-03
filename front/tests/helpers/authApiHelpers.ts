import { APIRequestContext } from '@playwright/test';

const API_BASE_URL = 'http://localhost:3001';

//Login and get cookies
export async function loginAndGetCookies(request: APIRequestContext, identifier: string, password: string) {
    
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
        data: { identifier, password }
    });

    const headers = response.headersArray();

    const setCookieHeaders = headers
    .filter(h => h.name.toLowerCase() === 'set-cookie')
    .map(h => h.value);

    const accessTokenCookie = setCookieHeaders.find(c => c.startsWith('accessToken='));
    const refreshTokenCookie = setCookieHeaders.find(c => c.startsWith('refreshToken='));
    const csrfCookie = setCookieHeaders.find(c => c.startsWith('XSRF-TOKEN='));

    if (!csrfCookie) {
        throw new Error(`No CSRF token found in cookies: ${setCookieHeaders.join(' | ')}`);
    }

    const csrfValue = csrfCookie.split(';')[0].split('=')[1];

    const cookieHeader = setCookieHeaders
    .map(c => c.split(';')[0])
    .join('; ');

    return {
        response,
        csrfValue,
        cookieHeader,
        rawCookies: setCookieHeaders,
        accessTokenCookie,
        refreshTokenCookie
    };
}