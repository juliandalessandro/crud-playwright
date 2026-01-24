import { test } from '@playwright/test';
import { UploadRecordPage } from '../../pages/upload-record';
import { validRecord, recordUploadErrorCases } from "../../fixtures/uploadRecordTestData";

test.describe('Upload Record Flows', () => {

    let uploadRecordPage: UploadRecordPage;

    test.beforeEach(async ({ page }) => {
        uploadRecordPage = new UploadRecordPage(page);
        await page.goto('/');
        await page.getByTestId('upload-record-button').click();
    });

    test('Successful Record Upload', async () => {
        const record = validRecord[0];

        await uploadRecordPage.uploadRecord(
            record.title,
            record.artist,
            record.year,
            record.genre,
            record.coverURL
        );

        await uploadRecordPage.verifySuccessfulUpload();
    });

    for (const testCase of recordUploadErrorCases) {
        test(testCase.testName, async () => {
            const data = testCase.data;

            await uploadRecordPage.uploadRecord(
                data.title || '',
                data.artist || '',
                data.year ?? null,
                data.genre || '',
                data.coverURL || ''
            );

            await uploadRecordPage.verifyValidationError(
                testCase.field,
                testCase.expectedError
            );
        });
    }

});
