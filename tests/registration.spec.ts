import { test } from '../src/fixtures/test';

test.describe('01. Registration form @smoke', () => {
  test('Register after correcting the required password', async ({
    user, homePage, authPage, signupPage, submitAccount,
  }) => {
    await test.step('Open signup and verify account information', async () => {
      await homePage.open();
      await homePage.expectLoaded();
      await homePage.openSignupLogin();
      await authPage.expectLoaded();
      await authPage.signup(user.name, user.email);
      await signupPage.expectLoaded(user);
    });

    await test.step('Reject the form when the required password is empty', async () => {
      await signupPage.fillAccountInformation(user);
      await signupPage.clearPassword();
      await signupPage.submitAccount();
      await signupPage.expectRequiredPasswordError();
    });

    await test.step('Accept correct data after fixing the password', async () => {
      await signupPage.fillPassword(user.password);
      await signupPage.expectFormValid();
    });

    await test.step('Create the account and verify success', async () => {
      await submitAccount();
      await signupPage.continueToHome();
      await homePage.expectLoaded();
      await homePage.expectLoggedIn(user.name);
    });
  });
});

test.describe('02. Duplicate signup and login @smoke', () => {
  test('Reject registration with the same username and email', async ({
    registeredUser, authPage, signupPage,
  }) => {
    await authPage.signup(registeredUser.name, registeredUser.email);
    await authPage.expectDuplicateEmailRejected();
    await signupPage.expectFormNotVisible();
  });

  test('Login with the same account and verify the home page', async ({
    registeredUser, homePage, authPage,
  }) => {
    await authPage.expectUnauthenticated();
    await authPage.login(registeredUser.email, registeredUser.password);
    await homePage.expectLoaded();
    await homePage.expectLoggedIn(registeredUser.name);
  });
});

test.describe('03. Required field validation @negative', () => {
  test.beforeEach(async ({ homePage, authPage }) => {
    await homePage.open();
    await homePage.openSignupLogin();
    await authPage.expectLoaded();
  });

  test('Reject signup when both required fields are empty', async ({
    authPage, signupPage,
  }) => {
    await authPage.submitSignup();
    await authPage.expectRequiredNameError();
    await authPage.expectUnauthenticated();
    await signupPage.expectFormNotVisible();
  });

  test('Reject signup when the required email is empty', async ({
    user, authPage, signupPage,
  }) => {
    await authPage.fillSignupName(user.name);
    await authPage.submitSignup();
    await authPage.expectRequiredEmailError();
    await authPage.expectUnauthenticated();
    await signupPage.expectFormNotVisible();
  });
});
