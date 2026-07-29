import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const nextConfig = await readFile(new URL("../next.config.mjs", import.meta.url), "utf8");
const adminPage = await readFile(new URL("../src/app/admin/page.tsx", import.meta.url), "utf8");
const rootLayout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const globalStyles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
const homePage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const notFoundPage = await readFile(new URL("../src/app/not-found.tsx", import.meta.url), "utf8");
const labScene = await readFile(
  new URL("../src/components/lab-scene/lab-scene.tsx", import.meta.url),
  "utf8",
);
const experienceOwner = await readFile(
  new URL("../src/components/lab-scene/experience-owner.ts", import.meta.url),
  "utf8",
);
const animatedBackground = await readFile(
  new URL("../src/components/animated-background.tsx", import.meta.url),
  "utf8",
);
const laboratoryEnvironment = await readFile(
  new URL("../src/components/lab-scene/laboratory-environment.tsx", import.meta.url),
  "utf8",
);
const grainTexture = await readFile(
  new URL("../public/assets/lab-grain.svg", import.meta.url),
  "utf8",
);

function relativeLuminance([red, green, blue]) {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground, background) {
  const light = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const dark = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (light + 0.05) / (dark + 0.05);
}

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

test("obsolete global runtime systems remain removed", async () => {
  const removedFiles = [
    "../server/index.js",
    "../src/components/app-overlays.tsx",
    "../src/components/Particles.tsx",
    "../src/components/smooth-scroll.tsx",
    "../src/components/ui/ElasticCursor.tsx",
    "../src/contexts/socketio.tsx",
  ];

  await Promise.all(
    removedFiles.map((file) => assert.rejects(access(new URL(file, import.meta.url)))),
  );

  const removedDependencies = [
    "@types/canvas-confetti",
    "canvas-confetti",
    "cors",
    "devtools-detector",
    "dotenv",
    "express",
    "lenis",
    "motion",
    "socket.io",
    "socket.io-client",
  ];

  for (const dependency of removedDependencies) {
    assert.equal(packageJson.dependencies[dependency], undefined);
    assert.equal(packageJson.devDependencies[dependency], undefined);
  }
});

test("the frozen visual foundation remains local and dark-only", async () => {
  assert.match(rootLayout, /@fontsource-variable\/inter\/wght\.css/);
  assert.match(rootLayout, /@fontsource\/archivo-black\/latin-400\.css/);
  assert.doesNotMatch(rootLayout, /next\/font\/google/);
  assert.match(rootLayout, /className="dark font-sans"/);
  assert.equal(packageJson.dependencies["next-themes"], undefined);
  assert.equal(packageJson.devDependencies["next-themes"], undefined);

  await assert.rejects(access(new URL("../src/components/theme-provider.tsx", import.meta.url)));
  await assert.rejects(access(new URL("../src/components/theme/funny-theme-toggle.tsx", import.meta.url)));
  await assert.rejects(access(new URL("../src/components/theme/mode-toggle.tsx", import.meta.url)));

  assert.match(globalStyles, /--color-carbon:\s*5 6 8/);
  assert.match(globalStyles, /--color-bone:\s*242 240 233/);
  assert.match(globalStyles, /--radius-control:\s*0\.375rem/);
  assert.match(globalStyles, /--container-content:\s*75rem/);
  assert.match(globalStyles, /--border-focus:\s*2px solid/);
});

test("the LabScene exclusively owns the Spline experience", async () => {
  assert.match(homePage, /<LabScene\s*\/>/);
  assert.doesNotMatch(homePage, /<AnimatedBackground/);
  assert.doesNotMatch(notFoundPage, /@splinetool|<Spline/);

  const sourceRoot = new URL("../src/", import.meta.url);
  const sourceFiles = (await readdir(sourceRoot, { recursive: true }))
    .filter((file) => /\.tsx?$/.test(file));
  const reactSplineImports = [];

  for (const file of sourceFiles) {
    const source = await readFile(
      new URL(file.replaceAll("\\", "/"), sourceRoot),
      "utf8",
    );
    if (source.includes("@splinetool/react-spline")) reactSplineImports.push(file);
    if (file.includes("components\\sections") || file.includes("components/sections")) {
      assert.doesNotMatch(source, /@splinetool|<Spline/);
    }
  }

  assert.deepEqual(
    reactSplineImports.map((file) => file.replaceAll("\\", "/")),
    ["components/animated-background.tsx"],
  );
});

test("the scene lifecycle has explicit ownership and pause gates", () => {
  assert.match(experienceOwner, /class ExpensiveExperienceOwner/);
  assert.match(experienceOwner, /acquire\(token/);
  assert.match(experienceOwner, /release\(token/);
  assert.match(labScene, /IntersectionObserver/);
  assert.match(labScene, /visibilitychange/);
  assert.match(labScene, /prefers-reduced-motion: reduce/);
  assert.match(labScene, /application\.play\(\)/);
  assert.match(labScene, /application\.stop\(\)/);
  assert.match(animatedBackground, /gsap\.ticker\.wake\(\)/);
  assert.match(animatedBackground, /gsap\.ticker\.sleep\(\)/);
  assert.doesNotMatch(labScene, /requestAnimationFrame/);
  assert.doesNotMatch(animatedBackground, /requestAnimationFrame/);
});

test("the laboratory environment is singular, decorative, and static", () => {
  assert.match(laboratoryEnvironment, /aria-hidden="true"/);
  assert.match(laboratoryEnvironment, /data-laboratory-environment="carbon-field"/);
  assert.match(globalStyles, /\.laboratory-environment\s*\{/);
  assert.match(globalStyles, /--environment-grid-minor:/);
  assert.match(globalStyles, /--environment-grid-major:/);
  assert.match(globalStyles, /background-image:\s*url\("\/assets\/lab-grain\.svg"\)/);
  assert.doesNotMatch(globalStyles, /\.laboratory-environment[\s\S]*?animation\s*:/);
  assert.doesNotMatch(grainTexture, /<animate|<script/);
});

test("the carbon environment preserves AA text contrast", () => {
  const carbon = [5, 6, 8];
  const bone = [242, 240, 233];
  const secondary = [163, 169, 178];

  assert.ok(contrastRatio(bone, carbon) >= 4.5);
  assert.ok(contrastRatio(secondary, carbon) >= 4.5);
});
