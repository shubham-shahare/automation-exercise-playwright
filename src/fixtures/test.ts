import { test as base } from '@playwright/test';
import { createUser, type User } from '../data/user-factory';
import { HomePage } from '../pages/home.page';
import { AuthPage } from '../pages/auth.page';
import { SignupPage } from '../pages/signup.page';

type TestFixtures = {
  user: User;
  homePage: HomePage;
  authPage: AuthPage;
  signupPage: SignupPage;
  submitAccount: () => Promise<void>;
  registeredUser: User;
};

export const test = base.extend<TestFixtures>({
  user: async ({}, use) => {
    await use(createUser());
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  submitAccount: async ({ user, homePage, authPage, signupPage }, use) => {
    let creationAttempted = false;
    let creationConfirmed = false;

    try {
      await use(async () => {
        creationAttempted = true;
        await signupPage.submitAccount();
        await signupPage.expectAccountCreated();
        creationConfirmed = true;
      });
    } finally {
      if (creationAttempted) {
        await base.step('Delete the generated account', async () => {
          await homePage.open();
          if (!(await homePage.isLoggedIn())) {
            await homePage.openSignupLogin();
            await authPage.login(user.email, user.password);
            const loggedIn = await authPage.expectLoginResult();
            if (!loggedIn && !creationConfirmed) return;
          }
          await homePage.deleteAccount(user.name);
        });
      }
    }
  },

  registeredUser: async ({ user, homePage, authPage, signupPage, submitAccount }, use) => {
    await base.step('Create an account through the UI', async () => {
      await homePage.open();
      await homePage.openSignupLogin();
      await authPage.expectLoaded();
      await authPage.signup(user.name, user.email);
      await signupPage.expectLoaded(user);
      await signupPage.fillAccountInformation(user);
      await submitAccount();
      await signupPage.continueToHome();
      await homePage.expectLoggedIn(user.name);
      await homePage.logout();
      await authPage.expectLoaded();
    });

    await use(user);
  },
});

export { expect } from '@playwright/test';
