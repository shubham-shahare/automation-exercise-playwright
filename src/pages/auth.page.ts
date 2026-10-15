import { expect, type Locator, type Page } from '@playwright/test';

export class AuthPage {
  private readonly loginEmail: Locator;
  private readonly loginPassword: Locator;
  private readonly signupEmail: Locator;
  private readonly signupName: Locator;
  private readonly loginHeading: Locator;
  private readonly signupHeading: Locator;
  private readonly signupButton: Locator;
  private readonly loginButton: Locator;
  private readonly duplicateEmailError: Locator;
  private readonly logoutLink: Locator;
  private readonly invalidLoginError: Locator;

  constructor(private readonly page: Page) {
    this.loginEmail = page.getByTestId('login-email');
    this.loginPassword = page.getByTestId('login-password');
    this.signupEmail = page.getByTestId('signup-email');
    this.signupName = page.getByTestId('signup-name');
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.signupButton = page.getByTestId('signup-button');
    this.loginButton = page.getByTestId('login-button');
    this.duplicateEmailError = page.getByText('Email Address already exist!', { exact: true });
    this.logoutLink = page.getByRole('link', { name: /Logout$/ });
    this.invalidLoginError = page.getByText('Your email or password is incorrect!', { exact: true });
  }

  async expectLoaded() {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.signupHeading).toBeVisible();
  }

  async signup(name: string, email: string) {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }

  async submitSignup() {
    await this.signupButton.click();
  }

  async fillSignupName(name: string) {
    await this.signupName.fill(name);
  }

  async expectRequiredNameError() {
    await expect(this.signupName).toHaveValue('');
    await expect(this.signupEmail).toHaveValue('');
    await expect(this.signupName).toHaveAttribute('required');
    await expect(this.signupName).toBeFocused();
    await expect.poll(() => this.signupName.evaluate(
      (input: HTMLInputElement) => input.validity.valueMissing,
    )).toBe(true);
  }

  async expectRequiredEmailError() {
    await expect(this.signupEmail).toHaveValue('');
    await expect(this.signupEmail).toHaveAttribute('required');
    await expect(this.signupEmail).toBeFocused();
    await expect.poll(() => this.signupEmail.evaluate(
      (input: HTMLInputElement) => input.validity.valueMissing,
    )).toBe(true);
  }

  async login(email: string, password: string) {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  async expectLoginResult(): Promise<boolean> {
    await expect(this.logoutLink.or(this.invalidLoginError)).toBeVisible();
    return this.logoutLink.isVisible();
  }

  async expectDuplicateEmailRejected() {
    await expect(this.duplicateEmailError).toBeVisible();
    await this.expectUnauthenticated(/\/signup$/);
  }

  async expectUnauthenticated(expectedPath = /\/login$/) {
    await expect(this.page).toHaveURL(expectedPath);
    await expect(this.logoutLink).toHaveCount(0);
  }
}
