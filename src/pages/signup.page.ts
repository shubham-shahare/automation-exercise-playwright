import { expect, type Locator, type Page } from '@playwright/test';
import type { User } from '../data/user-factory';

export class SignupPage {
  private readonly accountHeading: Locator;
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly mrRadio: Locator;
  private readonly mrsRadio: Locator;
  private readonly passwordInput: Locator;
  private readonly daySelect: Locator;
  private readonly monthSelect: Locator;
  private readonly yearSelect: Locator;
  private readonly newsletterCheckbox: Locator;
  private readonly offersCheckbox: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly companyInput: Locator;
  private readonly addressInput: Locator;
  private readonly address2Input: Locator;
  private readonly countrySelect: Locator;
  private readonly stateInput: Locator;
  private readonly cityInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly mobileInput: Locator;
  private readonly createAccountButton: Locator;
  private readonly accountCreatedMessage: Locator;
  private readonly continueButton: Locator;
  private readonly accountForm: Locator;
  private readonly invalidInputs: Locator;
  private readonly invalidFields: Locator;

  constructor(private readonly page: Page) {
    this.accountHeading = page.getByText('Enter Account Information', { exact: true });
    this.nameInput = page.getByTestId('name');
    this.emailInput = page.getByTestId('email');
    this.mrRadio = page.getByLabel('Mr.', { exact: true });
    this.mrsRadio = page.getByLabel('Mrs.', { exact: true });
    this.passwordInput = page.getByTestId('password');
    this.daySelect = page.getByTestId('days');
    this.monthSelect = page.getByTestId('months');
    this.yearSelect = page.getByTestId('years');
    this.newsletterCheckbox = page.getByLabel('Sign up for our newsletter!');
    this.offersCheckbox = page.getByLabel('Receive special offers from our partners!');
    this.firstNameInput = page.getByTestId('first_name');
    this.lastNameInput = page.getByTestId('last_name');
    this.companyInput = page.getByTestId('company');
    this.addressInput = page.getByTestId('address');
    this.address2Input = page.getByTestId('address2');
    this.countrySelect = page.getByTestId('country');
    this.stateInput = page.getByTestId('state');
    this.cityInput = page.getByTestId('city');
    this.zipCodeInput = page.getByTestId('zipcode');
    this.mobileInput = page.getByTestId('mobile_number');
    this.createAccountButton = page.getByTestId('create-account');
    this.accountCreatedMessage = page.getByTestId('account-created');
    this.continueButton = page.getByTestId('continue-button');
    this.accountForm = page.locator('form').filter({ has: this.createAccountButton });
    this.invalidInputs = this.accountForm.locator('input:invalid');
    this.invalidFields = this.accountForm.locator('input:invalid, select:invalid');
  }

  async expectLoaded(user: User) {
    await expect(this.accountHeading).toBeVisible();
    await expect(this.nameInput).toHaveValue(user.name);
    await expect(this.emailInput).toHaveValue(user.email);
    await expect(this.emailInput).toBeDisabled();
  }

  async fillAccountInformation(user: User) {
    if (user.title === 'Mr') {
      await this.mrRadio.check();
    } else {
      await this.mrsRadio.check();
    }
    await this.passwordInput.fill(user.password);
    await this.daySelect.selectOption(user.birthDay);
    await this.monthSelect.selectOption(user.birthMonth);
    await this.yearSelect.selectOption(user.birthYear);
    await this.newsletterCheckbox.check();
    await this.offersCheckbox.check();
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.addressInput.fill(user.address1);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipCodeInput.fill(user.zipCode);
    await this.mobileInput.fill(user.mobileNumber);
  }

  async clearPassword() {
    await this.passwordInput.clear();
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async expectFormValid() {
    await expect(this.invalidFields).toHaveCount(0);
  }

  async expectFormNotVisible() {
    await expect(this.accountForm).toHaveCount(0);
  }

  async submitAccount() {
    await this.createAccountButton.click();
  }

  async expectRequiredPasswordError() {
    await expect(this.passwordInput).toHaveValue('');
    await expect(this.passwordInput).toHaveAttribute('required');
    await expect(this.passwordInput).toBeFocused();
    await expect(this.invalidInputs).toHaveCount(1);
    await expect(this.page).toHaveURL(/\/signup$/);
    await expect(this.accountCreatedMessage).toHaveCount(0);
    await expect(this.createAccountButton).toBeVisible();
  }

  async expectAccountCreated() {
    await expect(this.accountCreatedMessage).toHaveText('Account Created!');
    await expect(this.page).toHaveURL(/\/account_created$/);
  }

  async continueToHome() {
    await this.continueButton.click();
  }
}
