import { Page, Locator, expect } from "@playwright/test";

export class UploadRecordPage {

    readonly page: Page;
    readonly titleUploadRecordInput: Locator;
    readonly artistUploadRecordInput: Locator;
    readonly yearUploadRecordInput: Locator;
    readonly genreUploadRecordInput: Locator;
    readonly coverURLUploadRecordInput: Locator;
    readonly uploadRecordButton: Locator;

    readonly titleError: Locator;
    readonly artistError: Locator;
    readonly yearError: Locator;
    readonly genreError: Locator;
    readonly coverError: Locator;

    constructor(page: Page) {
        this.page = page;

        this.titleUploadRecordInput = page.getByTestId('title-uploadRecord-input');
        this.artistUploadRecordInput = page.getByTestId('artist-uploadRecord-input');
        this.yearUploadRecordInput = page.getByTestId('year-uploadRecord-input');
        this.genreUploadRecordInput = page.getByTestId('genre-uploadRecord-input');
        this.coverURLUploadRecordInput = page.getByTestId('coverURL-uploadRecord-input');
        this.uploadRecordButton = page.getByTestId('uploadRecord-button');

        this.titleError = page.getByTestId('record-upload-title-error');
        this.artistError = page.getByTestId('record-upload-artist-error');
        this.yearError = page.getByTestId('record-upload-year-error');
        this.genreError = page.getByTestId('record-upload-genre-error');
        this.coverError = page.getByTestId('record-upload-coverURL-error');
    }

    async uploadRecord(title: string, artist: string, year: number | null, genre: string, coverURL: string) {
        await this.titleUploadRecordInput.fill(title);
        await this.artistUploadRecordInput.fill(artist);

        if (year === null) {
            await this.yearUploadRecordInput.fill('');
        } else {
            await this.yearUploadRecordInput.fill(year.toString());
        }

        await this.genreUploadRecordInput.fill(genre);
        await this.coverURLUploadRecordInput.fill(coverURL);

        await this.uploadRecordButton.click();
    }

    async verifySuccessfulUpload() {
        await expect(this.page).toHaveURL('/');
    }

    async verifyValidationError(field: 'title' | 'artist' | 'year' | 'genre' | 'cover', message: string) {
        const map = {
            title: this.titleError,
            artist: this.artistError,
            year: this.yearError,
            genre: this.genreError,
            cover: this.coverError
        };

        await expect(map[field]).toHaveText(message);
        await expect(this.page).toHaveURL('/uploadRecord');
    }
}
