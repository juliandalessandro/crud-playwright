import { test, expect } from '@playwright/test';
import { validUser } from '../../fixtures/loginTestData';
import { validRecord, recordUploadErrorCases } from '../../fixtures/uploadRecordTestData';
import { recordEditErrorCases } from '../../fixtures/editRecordTestData';
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
    
    async function createTestRecord(request: any, cookieHeader: string, csrfValue: string) {
        
        const record = validRecord[0];

        const response = await request.post(`${API_BASE_URL}/records`, {
            headers: {
                'Cookie': cookieHeader,
                'x-csrf-token': csrfValue,
                'Content-Type': 'application/json'
            },
            data: record
        });

        return response.json();

    };

    test.describe('PUT /records/:id - Successful cases', () => {    

        test('update record successfully', async ({ request }) => {
            
            const { cookieHeader, csrfValue } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );

            const createdTestRecord = await createTestRecord(request, cookieHeader, csrfValue);

            const updateResponse = await request.put(`${API_BASE_URL}/records/${createdTestRecord.id}`, {
                headers: {
                    'Cookie': cookieHeader,
                    'x-csrf-token': csrfValue,
                    'Content-Type': 'application/json'
                },
                data: {
                    ...createdTestRecord,
                    title: "Updated Title for Edit Record API test"
                }
            });

            const updateBody = await updateResponse.json();

            expect(updateResponse.status()).toBe(200);
            expect(updateBody.message).toEqual("Record updated successfully");
            expect(updateBody.record).toMatchObject({
                id: createdTestRecord.id,
                title: "Updated Title for Edit Record API test",
                artist: createdTestRecord.artist,
                year: createdTestRecord.year,
                genre: createdTestRecord.genre,
                cover: createdTestRecord.cover,                
            });
        });
    });

    test.describe('PUT /records/:id - Unsuccessful cases', () => {

        for(const testCase of recordEditErrorCases) {

            test(testCase.testName, async({ request }) => {

                const {cookieHeader, csrfValue} = await loginAndGetCookies(
                    request,
                    validUser[0].username,
                    validUser[0].password
                );

                const createdTestRecord = await createTestRecord(request, cookieHeader, csrfValue);

                const updateResponse = await request.put(`${API_BASE_URL}/records/${createdTestRecord.id}`, {
                    headers: {
                        'Cookie': cookieHeader,
                        'x-csrf-token': csrfValue,
                        'Content-Type': 'application/json'
                    },
                    data: testCase.data
                });

                const updateBody = await updateResponse.json();

                expect(updateResponse.status()).toBe(400);
                expect(updateBody.errors).toContain(testCase.expectedError);

            });
        };

        test('update record with non-existing id', async ({ request }) => {

            const { cookieHeader, csrfValue } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );

            const id = 999999; 

            const updateResponse = await request.put(`${API_BASE_URL}/records/${id}`, {
                headers: {
                    'Cookie': cookieHeader,
                    'x-csrf-token': csrfValue,
                    'Content-Type': 'application/json'
                },
                data: {
                    title: "Updated Title for Edit Record API test"
                }
            });

            const updateBody = await updateResponse.json();

            expect(updateResponse.status()).toBe(404);
            expect(updateBody.error).toEqual(`Record with id ${id} not found`);

        });

        test('update record without authentication', async ({ request }) => {
                
            const id = 1;
            
            const updateResponse = await request.put(`${API_BASE_URL}/records/${id}`, {
                data: {
                    title: "Updated Title for Edit Record API test"
                }
            });

            expect(updateResponse.status()).toBe(401);
        
        });

        test('update record without CSRF token', async ({ request }) => {

            const { cookieHeader, csrfValue } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );
        
            const createdTestRecord = await createTestRecord(request, cookieHeader, csrfValue);

            const updateResponse = await request.put(`${API_BASE_URL}/records/${createdTestRecord.id}`, {
                headers: {
                    'Cookie': cookieHeader,
                    'Content-Type': 'application/json'
                },
                data: {
                    title: "Updated Title for Edit Record API test"
                }
            });

            expect(updateResponse.status()).toBe(403);
        
        });
    });

    test.describe('DELETE /records/:id - Successful cases', () => {    

        test('delete record successfully', async ({ request }) => {
            
            const { cookieHeader, csrfValue } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );

            const createdTestRecord = await createTestRecord(request, cookieHeader, csrfValue);

            const deleteResponse = await request.delete(`${API_BASE_URL}/records/${createdTestRecord.id}`, {
                headers: {
                    'Cookie': cookieHeader,
                    'x-csrf-token': csrfValue,
                    'Content-Type': 'application/json'
                }
            });

            const deleteBody = await deleteResponse.json();

            expect(deleteResponse.status()).toBe(200);
            expect(deleteBody.message).toEqual("Record deleted successfully");

        });
    });

    test.describe('DELETE /records/:id - Unsuccessful cases', () => {

        test('delete record with non-existing id', async ({ request }) => {
            
            const { cookieHeader, csrfValue } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );

            const id = 999999;

            const deleteResponse = await request.delete(`${API_BASE_URL}/records/${id}`, {
                headers: {
                    'Cookie': cookieHeader,
                    'x-csrf-token': csrfValue,
                    'Content-Type': 'application/json'
                }
            });

            const deleteBody = await deleteResponse.json();

            expect(deleteResponse.status()).toBe(404);
            expect(deleteBody.error).toEqual(`Record with id ${id} not found`);

        });

        test('delete record without authentication', async ({ request }) => {
            
            const id = 1;

            const deleteResponse = await request.delete(`${API_BASE_URL}/records/${id}`);

            expect(deleteResponse.status()).toBe(401);
            
        });

        test('delete record without CSRF token', async ({ request }) => {

            const { cookieHeader, csrfValue } = await loginAndGetCookies(
                request,
                validUser[0].username,
                validUser[0].password
            );

            const createdTestRecord = await createTestRecord(request, cookieHeader, csrfValue);

            const deleteResponse = await request.delete(`${API_BASE_URL}/records/${createdTestRecord.id}`, {
                headers: {
                    'Cookie': cookieHeader,
                    'Content-Type': 'application/json'
                }
            });

            expect(deleteResponse.status()).toBe(403);

        });

    });

});