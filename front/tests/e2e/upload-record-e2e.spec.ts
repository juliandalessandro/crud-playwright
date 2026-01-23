import { test } from '@playwright/test';
import { UploadRecordPage } from '../../pages/upload-record';
import { validRecord } from "../../fixtures/uploadRecordTestData";

test.describe('Upload Record Flow', () => {

    let uploadRecordPage: UploadRecordPage;

    test.beforeEach(async ({ page }) => {
            uploadRecordPage = new UploadRecordPage(page);
            await page.goto('/');
            await page.getByTestId('upload-record-button').click();
        });

    test('Successful Record Upload', async ({ page }) => {
        
        const record = validRecord[0];
        
        await uploadRecordPage.uploadRecord(record.title, 
            record.artist, 
            record.year, 
            record.genre, 
            record.coverURL);

        await uploadRecordPage.verifySuccessfulUpload();
    });

})