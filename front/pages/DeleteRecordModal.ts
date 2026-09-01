import { Page, Locator, expect } from '@playwright/test';

export class DeleteRecordModal {
    
    readonly page: Page;
    readonly modal: Locator;
    readonly deleteRecordTitle: Locator;
    readonly recordInfo: Locator;
    readonly confirmDeleteButton: Locator;
    readonly cancelDeleteButton: Locator;
    readonly xDeleteButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.modal = page.getByTestId('delete-record-modal');
        this.deleteRecordTitle = page.getByTestId('delete-record-title');
        this.recordInfo = page.getByTestId('record-info-deleteRecord');
        this.confirmDeleteButton = page.getByTestId('confirm-delete-record');
        this.cancelDeleteButton = page.getByTestId('cancel-delete-record');
        this.xDeleteButton = page.getByTestId('x-delete-record');
    }

    async isModalVisible() {
        await expect(this.modal).toBeVisible();
    }

    async clickConfirmDelete() {
        await this.confirmDeleteButton.click();
    }

    async clickCancelDelete() {
        await this.cancelDeleteButton.click();
    }

    async clickXDelete() {
        await this.xDeleteButton.click();
    }

    async validateModalTitle(expectedTitle: string) {
        await expect(this.deleteRecordTitle).toHaveText(expectedTitle);
    }

    async validateModalRecordInfo(title: string, artist: string) {
        await expect(this.recordInfo).toHaveText(`${title} – ${artist}`);
    }

    async validateModalRecordButtons() {
        await expect(this.confirmDeleteButton).toBeVisible()
        await expect(this.confirmDeleteButton).toHaveText('Delete');
        await expect(this.cancelDeleteButton).toBeVisible();
        await expect(this.cancelDeleteButton).toHaveText('Cancel');
        await expect(this.xDeleteButton).toBeVisible();
    }
}