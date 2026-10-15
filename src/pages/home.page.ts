import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  private readonly signupLoginLink: Locator;
  private readonly logoutLink: Locator;
  private readonly productsHeading: Locator;
  private readonly deleteAccountLink: Locator;
  private readonly accountDeletedMessage: Locator;

  constructor(private readonly page: Page) {
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.logoutLink = page.getByRole('link', { name: /Logout$/ });
    this.productsHeading = page.getByRole('heading', { name: 'Features Items', exact: true });
    this.deleteAccountLink = page.getByRole('link', { name: /Delete Account$/ });
    this.accountDeletedMessage = page.getByTestId('account-deleted');
  }

  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveTitle(/Automation Exercise/);
  }

  async openSignupLogin() {
    await this.signupLoginLink.click();
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async expectLoggedIn(name: string) {
    await expect(this.page.getByText(`Logged in as ${name}`, { exact: true })).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.logoutLink.isVisible();
  }

  async logout() {
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL('/');
    await expect(this.page).toHaveTitle('Automation Exercise');
    await expect(this.productsHeading).toBeVisible();
  }

  async deleteAccount(name: string) {
    await this.expectLoggedIn(name);
    await this.deleteAccountLink.click();
    await expect(this.accountDeletedMessage).toHaveText('Account Deleted!');
    await expect(this.page).toHaveURL(/\/delete_account$/);
  }
}
