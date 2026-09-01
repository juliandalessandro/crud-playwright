import { Page, Locator, expect } from '@playwright/test';

export class RecordsPage {
    
    readonly page: Page;

    readonly recordCard: Locator;
    readonly recordCardEditButton: Locator;
    readonly recordCardDeleteButton: Locator;
    readonly toastMessage: Locator;

    constructor(page: Page) {

        this.page = page;

        this.recordCard = page.getByTestId('record-recordsPage-card');
        this.recordCardEditButton = page.getByTestId('record-recordsPage-edit-button');
        this.recordCardDeleteButton = page.getByTestId('record-recordsPage-delete-button');
        this.toastMessage = page.getByTestId('toast-message');

    }

    getRecordByTitle(title: string): Locator {
        return this.recordCard.filter({ hasText: title });
    }

    async clickEditButtonOnRecord(title: string) {
        await this.getRecordByTitle(title).getByTestId('record-recordsPage-edit-button').click();
    }

    async clickDeleteButtonOnRecord(title: string) {
        await this.getRecordByTitle(title).getByTestId('record-recordsPage-delete-button').click();
    }

}