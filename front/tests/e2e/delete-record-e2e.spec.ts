import { test, expect } from "@playwright/test";
import { RecordsPage } from "../../pages/RecordsPage";
import { DeleteRecordModal } from "../../pages/DeleteRecordModal";
import { DELETE_RECORD_MESSAGES } from "../../fixtures/deleteRecordTestData";

const API_BASE_URL = "http://localhost:3001";

test.describe("Delete Record Flows", () => {

    let recordsPage: RecordsPage;
    let deleteRecordModal: DeleteRecordModal;
    let testRecord: { id: number; title: string };

    test.beforeEach(async ({ page, context }) => {
        
        const cookies = await context.cookies();
        const csrfCookie = cookies.find(c => c.name === "XSRF-TOKEN");
        if (!csrfCookie) throw new Error("No cookie XSRF-TOKEN found");

        const response = await context.request.post(`${API_BASE_URL}/records`, {
            headers: { "x-csrf-token": csrfCookie.value },
            data: {
                title: `Test Record to Delete ${Math.random().toString(36).substring(2, 8)}`,
                artist: "Test Artist",
                year: 2022,
                genre: "Test Genre",
                cover: "https://picsum.photos/500/500"
            }
        });

        testRecord = await response.json();

        recordsPage = new RecordsPage(page);
        deleteRecordModal = new DeleteRecordModal(page);

        await page.goto("/");
    });

    test("Successful Record Deletion", async ({ page }) => {      

        await recordsPage.clickDeleteButtonOnRecord(testRecord.title);

        await deleteRecordModal.isModalVisible();
        await deleteRecordModal.validateModalTitle(DELETE_RECORD_MESSAGES.DELETE_MODAL_TITLE);
        await deleteRecordModal.validateModalRecordInfo(testRecord.title, "Test Artist");
        await deleteRecordModal.validateModalRecordButtons();

        await deleteRecordModal.clickConfirmDelete();

        await expect(recordsPage.toastMessage).toBeVisible();
        await expect(recordsPage.toastMessage).toHaveText(DELETE_RECORD_MESSAGES.DELETE_SUCCESS);
        await expect(recordsPage.getRecordByTitle(testRecord.title)).not.toBeVisible();

    });

    test("Cancel Record Deletion", async ({ page }) => {      

        await recordsPage.clickDeleteButtonOnRecord(testRecord.title);

        await deleteRecordModal.isModalVisible();
        await deleteRecordModal.validateModalTitle(DELETE_RECORD_MESSAGES.DELETE_MODAL_TITLE);
        await deleteRecordModal.validateModalRecordInfo(testRecord.title, "Test Artist");
        await deleteRecordModal.validateModalRecordButtons();

        await deleteRecordModal.clickCancelDelete();

        await expect(recordsPage.toastMessage).not.toBeVisible();
        await expect(recordsPage.getRecordByTitle(testRecord.title)).toBeVisible();
        await expect(deleteRecordModal.modal).not.toBeVisible();

    });

    test("Close Record Deletion Modal with X Button", async ({ page }) => {

        await recordsPage.clickDeleteButtonOnRecord(testRecord.title);

        await deleteRecordModal.isModalVisible();
        await deleteRecordModal.validateModalTitle(DELETE_RECORD_MESSAGES.DELETE_MODAL_TITLE);
        await deleteRecordModal.validateModalRecordInfo(testRecord.title, "Test Artist");
        await deleteRecordModal.validateModalRecordButtons();

        await deleteRecordModal.clickXDelete();

        await expect(recordsPage.getRecordByTitle(testRecord.title)).toBeVisible();
        await expect(deleteRecordModal.modal).not.toBeVisible();
    })

    test("Close Record Deletion Modal with Escape key", async ({ page }) => {

        await recordsPage.clickDeleteButtonOnRecord(testRecord.title);

        await deleteRecordModal.isModalVisible();
        await deleteRecordModal.validateModalTitle(DELETE_RECORD_MESSAGES.DELETE_MODAL_TITLE);
        await deleteRecordModal.validateModalRecordInfo(testRecord.title, "Test Artist");
        await deleteRecordModal.validateModalRecordButtons();

        await page.keyboard.press("Escape");

        await expect(recordsPage.getRecordByTitle(testRecord.title)).toBeVisible();
        await expect(deleteRecordModal.modal).not.toBeVisible();
    })

});