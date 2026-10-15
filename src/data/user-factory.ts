import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';

export type User = {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
};

// Values supported by the country dropdown.
const supportedCountries = [
  'India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore',
] as const;

export function createUser(): User {
  const id = randomUUID().replaceAll('-', '');
  const title = faker.helpers.arrayElement(['Mr', 'Mrs'] as const);
  const firstName = faker.person.firstName(title === 'Mr' ? 'male' : 'female');
  const lastName = faker.person.lastName();
  const birthday = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });

  return {
    name: `user_${id}`,
    email: `pw.${id}@example.com`,
    password: randomUUID(),
    title,
    birthDay: String(birthday.getUTCDate()),
    birthMonth: String(birthday.getUTCMonth() + 1),
    birthYear: String(birthday.getUTCFullYear()),
    firstName,
    lastName,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement(supportedCountries),
    state: faker.location.state(),
    city: faker.location.city(),
    zipCode: faker.location.zipCode(),
    mobileNumber: faker.string.numeric({ length: 10, allowLeadingZeros: false }),
  };
}
