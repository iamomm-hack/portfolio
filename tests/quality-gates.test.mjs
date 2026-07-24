import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const nextConfig = await readFile(new URL("../next.config.mjs", import.meta.url), "utf8");
const adminPage = await readFile(new URL("../src/app/admin/page.tsx", import.meta.url), "utf8");
const chatServer = await readFile(new URL("../server/index.js", import.meta.url), "utf8");

test("quality scripts are available", () => {
  assert.equal(packageJson.scripts.lint, "next lint");
  assert.equal(packageJson.scripts.typecheck, "tsc --noEmit --incremental false");
  assert.equal(packageJson.scripts.test, "node --test tests/quality-gates.test.mjs");
  assert.match(packageJson.scripts.check, /npm run lint/);
  assert.match(packageJson.scripts.check, /npm run typecheck/);
  assert.match(packageJson.scripts.check, /npm run test/);
  assert.match(packageJson.scripts.check, /npm run build/);
});

test("production builds do not bypass lint", () => {
  assert.doesNotMatch(nextConfig, /ignoreDuringBuilds\s*:\s*true/);
});

test("npm is the only supported package manager", async () => {
  assert.equal(packageJson.packageManager, "npm@10.9.4");
  assert.equal(packageJson.engines.npm, ">=10 <11");
  await assert.doesNotReject(access(new URL("../package-lock.json", import.meta.url)));
  await assert.rejects(access(new URL("../pnpm-lock.yaml", import.meta.url)));
  await assert.rejects(access(new URL("../yarn.lock", import.meta.url)));
});

test("the public admin dashboard is unavailable", () => {
  assert.match(adminPage, /notFound\(\)/);
  assert.doesNotMatch(adminPage, /[\"']use client[\"']/);
  assert.doesNotMatch(adminPage, /NEXT_PUBLIC_WS_URL/);
});

test("admin APIs fail closed and compare credentials safely", () => {
  assert.doesNotMatch(chatServer, /admin123/);
  assert.match(chatServer, /const ADMIN_PASSWORD = process\.env\.ADMIN_PASSWORD/);
  assert.match(chatServer, /timingSafeEqual/);
  assert.match(chatServer, /Admin API is disabled/);
});
