import { test, expect } from '@playwright/test';
import { RecordsPage } from '../../pages/RecordsPage';
import { EditRecordModal } from '../../pages/EditRecordModal';
import { EDIT_RECORD_MESSAGES, recordEditErrorCases } from '../../fixtures/editRecordTestData';

const API_BASE_URL = 'http://localhost:3001';

test.describe('Edit Record Flows', () => {

    let recordsPage: RecordsPage;
    let editRecordModal: EditRecordModal;
    let testRecord: { id: number; title: string };

    test.beforeEach(async ({ page, context }) => {
        const cookies = await context.cookies();
        const csrfCookie = cookies.find(c => c.name === 'XSRF-TOKEN');
        if (!csrfCookie) throw new Error('No cookie XSRF-TOKEN found');

        const response = await context.request.post(`${API_BASE_URL}/records`, {
            headers: { 'x-csrf-token': csrfCookie.value },
            data: {
                title: `Test Record ${Math.random().toString(36).substring(2, 8)}`,
                artist: 'Test Artist',
                year: 1970,
                genre: 'Jazz',
                cover: 'https://picsum.photos/500/500'
            }
        });

        const body = await response.json();
        testRecord = { id: body.id, title: body.title };

        recordsPage = new RecordsPage(page);
        editRecordModal = new EditRecordModal(page);
        await page.goto('/');
    });

    test('Successful Record Edit', async ({ page }) => {
        await recordsPage.clickEditButtonOnRecord(testRecord.title);

        await editRecordModal.isModalVisible();
        await editRecordModal.validateModalTitle(EDIT_RECORD_MESSAGES.EDIT_MODAL_TITLE);
        await editRecordModal.validateModalRecordButtons();

        const editedRecord = await editRecordModal.editRecord();

        await expect(recordsPage.toastMessage).toBeVisible();
        await expect(recordsPage.toastMessage).toHaveText(EDIT_RECORD_MESSAGES.EDIT_SUCCESS);

        const editedCard = recordsPage.getRecordByTitle(editedRecord.title);

        await expect(editedCard).toContainText(editedRecord.artist);
        await expect(editedCard).toContainText(editedRecord.year!.toString());
        await expect(editedCard).toContainText(editedRecord.genre);
        await expect(editedCard.locator('img')).toHaveAttribute('src', editedRecord.cover);
    });

    test.describe('Unsuccessful Record Edit', () => {

        for (const testCase of recordEditErrorCases) {
            test(testCase.testName, async ({ page }) => {
                await recordsPage.clickEditButtonOnRecord(testRecord.title);

                await editRecordModal.isModalVisible();
                await editRecordModal.validateModalTitle(EDIT_RECORD_MESSAGES.EDIT_MODAL_TITLE);
                await editRecordModal.validateModalRecordButtons();

                await editRecordModal.fillForm(testCase.data);
                await editRecordModal.submit();

                await expect(editRecordModal.modal).toBeVisible();
                
                await editRecordModal.verifyValidationError(testCase.field, testCase.expectedError);

                await expect(recordsPage.getRecordByTitle(testRecord.title)).toBeVisible();
            });
        }
    });

    test('Close Record Edit Modal with X Button', async ({ page }) => {
        await recordsPage.clickEditButtonOnRecord(testRecord.title);

        await editRecordModal.isModalVisible();
        await editRecordModal.validateModalTitle(EDIT_RECORD_MESSAGES.EDIT_MODAL_TITLE);
        await editRecordModal.validateModalRecordButtons();

        await editRecordModal.fillForm({ title: 'Edited Title' });
        await editRecordModal.clickCancelEdit();

        await expect(editRecordModal.modal).not.toBeVisible();
        await expect(recordsPage.getRecordByTitle(testRecord.title)).toBeVisible();
    });

    test('Close Record Edit Modal with Escape key', async ({ page }) => {
        await recordsPage.clickEditButtonOnRecord(testRecord.title);

        await editRecordModal.isModalVisible();
        await editRecordModal.validateModalTitle(EDIT_RECORD_MESSAGES.EDIT_MODAL_TITLE);
        await editRecordModal.validateModalRecordButtons();

        await editRecordModal.fillForm({ title: 'Edited Title' });
        await page.keyboard.press("Escape");

        await expect(editRecordModal.modal).not.toBeVisible();
        await expect(recordsPage.getRecordByTitle(testRecord.title)).toBeVisible();
    });
});