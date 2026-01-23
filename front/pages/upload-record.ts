import { Page, Locator, expect } from "@playwright/test";

export class UploadRecordPage {

    readonly page: Page;
    readonly titleUploadRecordInput: Locator;
    readonly artistUploadRecordInput: Locator;
    readonly yearUploadRecordInput: Locator;
    readonly genreUploadRecordInput: Locator;
    readonly coverURLUploadRecordInput: Locator;
    readonly uploadRecordButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.titleUploadRecordInput = page.getByTestId('title-uploadRecord-input');
        this.artistUploadRecordInput = page.getByTestId('artist-uploadRecord-input');
        this.yearUploadRecordInput = page.getByTestId('year-uploadRecord-input');
        this.genreUploadRecordInput = page.getByTestId('genre-uploadRecord-input');
        this.coverURLUploadRecordInput = page.getByTestId('coverURL-uploadRecord-input');
        this.uploadRecordButton = page.getByTestId('uploadRecord-button');
    }

    async uploadRecord(title: string, artist: string, year: number, genre: string, coverURL: string) {
        await this.titleUploadRecordInput.fill(title);
        await this.artistUploadRecordInput.fill(artist);
        await this.yearUploadRecordInput.fill(year.toString());
        await this.genreUploadRecordInput.fill(genre);
        await this.coverURLUploadRecordInput.fill(coverURL);

        await this.uploadRecordButton.click();
    }

    async verifySuccessfulUpload() {
        await expect(this.page).toHaveURL('/');
    }
}