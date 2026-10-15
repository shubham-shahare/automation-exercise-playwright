import { rm } from 'node:fs/promises';
import path from 'node:path';

export default async function globalSetup() {
  await rm(path.resolve(__dirname, '../allure-results'), { recursive: true, force: true });
}
