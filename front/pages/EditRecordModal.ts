import { Page, Locator, expect } from '@playwright/test';

export class EditRecordModal {

    readonly page: Page;
    readonly modal: Locator;
    readonly titleEditRecordInput: Locator;
    readonly artistEditRecordInput: Locator;
    readonly yearEditRecordInput: Locator;
    readonly genreEditRecordInput: Locator;
    readonly coverEditRecordInput: Locator;
    readonly editRecordModalTitle: Locator;
    readonly submitEditRecordButton: Locator;
    readonly cancelEditRecordButton: Locator;
    readonly titleError: Locator;
    readonly artistError: Locator;
    readonly yearError: Locator;
    readonly genreError: Locator;
    readonly coverError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.getByTestId('edit-record-modal');
        this.titleEditRecordInput = page.getByTestId('title-editRecord-input');
        this.artistEditRecordInput = page.getByTestId('artist-editRecord-input');
        this.yearEditRecordInput = page.getByTestId('year-editRecord-input');
        this.genreEditRecordInput = page.getByTestId('genre-editRecord-input');
        this.coverEditRecordInput = page.getByTestId('cover-editRecord-input');
        this.editRecordModalTitle = page.getByTestId('edit-record-modal-title');
        this.submitEditRecordButton = page.getByTestId('submit-editRecord-button');
        this.cancelEditRecordButton = page.getByTestId('cancel-editRecord-button');
        this.titleError = page.getByTestId('title-editRecord-input-error');
        this.artistError = page.getByTestId('artist-editRecord-input-error');
        this.yearError = page.getByTestId('year-editRecord-input-error');
        this.genreError = page.getByTestId('genre-editRecord-input-error');
        this.coverError = page.getByTestId('cover-editRecord-input-error');
    }

    private randomString(length = 8): string {
        return Math.random().toString(36).substring(2, 2 + length);
    }

    private randomYear(): number {
        const min = 1600;
        const max = new Date().getFullYear();
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private randomRealImageUrl(): string {
        return `https://picsum.photos/500/500`;
    }

    async fillForm(overrides: {
        title?: string;
        artist?: string;
        year?: number | null;
        genre?: string;
        cover?: string;
    } = {}) {
        const title = overrides.title ?? `Edited ${this.randomString()}`;
        const artist = overrides.artist ?? `Edited Artist ${this.randomString(5)}`;
        let year: number | null;
        if (overrides.year === null) {
            year = null;
        } else {
            year = overrides.year ?? this.randomYear();
        }
        const genre = overrides.genre ?? `Genre ${this.randomString(5)}`;
        const cover = overrides.cover ?? this.randomRealImageUrl();


        await this.titleEditRecordInput.clear();
        await this.titleEditRecordInput.pressSequentially(title);
        await this.artistEditRecordInput.clear();
        await this.artistEditRecordInput.pressSequentially(artist);

        await this.yearEditRecordInput.clear();
        if (year !== null) {
            await this.yearEditRecordInput.pressSequentially(year.toString());
        }

        await this.genreEditRecordInput.clear();
        await this.genreEditRecordInput.pressSequentially(genre);
        await this.coverEditRecordInput.clear();
        await this.coverEditRecordInput.pressSequentially(cover);

        return { title, artist, year, genre, cover };
    }

    async submit() {
        await this.submitEditRecordButton.click();
    }

    async clickCancelEdit() {
        await this.cancelEditRecordButton.click();
    }

    async isModalVisible() {
        await expect(this.modal).toBeVisible();
    }

    async validateModalTitle(expectedTitle: string) {
        await expect(this.editRecordModalTitle).toHaveText(expectedTitle);
    }

    async validateModalRecordButtons() {
        await expect(this.submitEditRecordButton).toBeVisible();
        await expect(this.submitEditRecordButton).toHaveText('Save');
        await expect(this.cancelEditRecordButton).toBeVisible();
        await expect(this.cancelEditRecordButton).toHaveText('×');
    }

    async editRecord(overrides: Parameters<typeof this.fillForm>[0] = {}) {
        const data = await this.fillForm(overrides);
        await this.submit();
        await expect(this.modal).toBeHidden();
        return data;
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
    }
}