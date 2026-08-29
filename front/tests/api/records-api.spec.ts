import { test, expect } from '@playwright/test';
import { validUser } from '../../fixtures/loginTestData';
import { validRecord, recordUploadErrorCases } from '../../fixtures/uploadRecordTestData';
import { loginAndGetCookies } from '../helpers/authApiHelpers';

test.describe('Records API', () => {

    const API_BASE_URL = 'http://localhost:3001';

    test.describe('GET /records - Successful cases', () => {
        test('fetch records successfully after login', async ({ request }) => {
            const { cookieHeader } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );

            const response = await request.get(`${API_BASE_URL}/records`, {
                headers: {
                    'Cookie': cookieHeader
                }
            });
            expect(response.status()).toBe(200);
        })
    });

    test.describe('GET /records - Unauthorized cases', () => {
        
        test('fetch records without login', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/records`);
            expect(response.status()).toBe(401);
        })

        test('fetch records with invalid cookies', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/records`, {
                headers: {
                    'Cookie': 'invalidCookie=invalidValue'
                }
            });
            expect(response.status()).toBe(401);
        })
    });

    test.describe('POST /records - Successful cases', () => {

        test('successfull record upload', async({ request }) => {
            const { cookieHeader, csrfValue } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            )

            const record = validRecord[0];

            const response = await request.post(`${API_BASE_URL}/records`, {
                headers: {
                    'Cookie': cookieHeader,
                    'x-csrf-token': csrfValue,
                    'Content-Type': 'application/json'
                },
                data: record
            });

            if (response.status() !== 201) {
                console.log("Cuerpo del error enviado por la API:", await response.text());
            }

            expect(response.status()).toBe(201);
        })
    })

    test.describe('POST /records - Unsuccessful cases', () => {

        for(const testCase of recordUploadErrorCases) {

            test(testCase.testName, async({ request }) => {
            
                const {cookieHeader, csrfValue} = await loginAndGetCookies(
                    request,
                    validUser[0].username,
                    validUser[0].password
                );

                const record = testCase.data;

                const response = await request.post(`${API_BASE_URL}/records`, {
                    headers: {
                        'Cookie': cookieHeader,
                        'x-csrf-token': csrfValue,
                        'Content-Type': 'application/json'
                    },
                    data: record
                });

                expect(response.status()).toBe(400);
                const body = await response.json();
                expect(body.errors).toContain(testCase.expectedError);    
            });
        }
    })

    

    test.describe('POST /records - Unauthorized cases', () => {
        test('upload record without login', async ({ request }) => {
            const record = validRecord[0];
            const response = await request.post(`${API_BASE_URL}/records`, {
                data: record
            });
            expect(response.status()).toBe(401);
        });
    });

});