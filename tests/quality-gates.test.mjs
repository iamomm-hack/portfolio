import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
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
const controlRail = await readFile(
  new URL("../src/components/header/header.tsx", import.meta.url),
  "utf8",
);
const expandedNavigation = await readFile(
  new URL("../src/components/header/nav/index.tsx", import.meta.url),
  "utf8",
);
const controlRailStyles = await readFile(
  new URL("../src/components/header/style.module.scss", import.meta.url),
  "utf8",
);
const navigationStyles = await readFile(
  new URL("../src/components/header/nav/style.module.scss", import.meta.url),
  "utf8",
);
const hero = await readFile(
  new URL("../src/components/sections/hero.tsx", import.meta.url),
  "utf8",
);
const heroStyles = await readFile(
  new URL("../src/components/sections/hero.module.scss", import.meta.url),
  "utf8",
);
const heroChoreography = await readFile(
  new URL("../src/components/sections/hero-choreography.ts", import.meta.url),
  "utf8",
);
const motionTokens = await readFile(
  new URL("../src/lib/motion-tokens.ts", import.meta.url),
  "utf8",
);
const skills = await readFile(
  new URL("../src/components/sections/skills.tsx", import.meta.url),
  "utf8",
);
const skillsStyles = await readFile(
  new URL("../src/components/sections/skills.module.scss", import.meta.url),
  "utf8",
);
const experience = await readFile(
  new URL("../src/components/sections/experience.tsx", import.meta.url),
  "utf8",
);
const experienceStyles = await readFile(
  new URL("../src/components/sections/experience.module.scss", import.meta.url),
  "utf8",
);
const projectsSection = await readFile(
  new URL("../src/components/sections/projects.tsx", import.meta.url),
  "utf8",
);
const projectsStyles = await readFile(
  new URL("../src/components/sections/projects.module.scss", import.meta.url),
  "utf8",
);
const projectRecords = await readFile(
  new URL("../src/data/project-records.ts", import.meta.url),
  "utf8",
);
const caseStudyPage = await readFile(
  new URL("../src/app/projects/[slug]/page.tsx", import.meta.url),
  "utf8",
);
const caseStudyLayout = await readFile(
  new URL(
    "../src/components/case-study/case-study-layout.tsx",
    import.meta.url,
  ),
  "utf8",
);
const caseStudyStyles = await readFile(
  new URL(
    "../src/components/case-study/case-study-layout.module.scss",
    import.meta.url,
  ),
  "utf8",
);
const contactSection = await readFile(
  new URL("../src/components/sections/contact.tsx", import.meta.url),
  "utf8",
);
const contactForm = await readFile(
  new URL("../src/components/ContactForm.tsx", import.meta.url),
  "utf8",
);
const contactStyles = await readFile(
  new URL("../src/components/sections/contact.module.scss", import.meta.url),
  "utf8",
);
const contactApi = await readFile(
  new URL("../src/app/api/send/route.ts", import.meta.url),
  "utf8",
);
const environmentExample = await readFile(
  new URL("../.env.example", import.meta.url),
  "utf8",
);
const footer = await readFile(
  new URL("../src/components/footer/footer.tsx", import.meta.url),
  "utf8",
);
const aboutPage = await readFile(
  new URL("../src/app/about/page.tsx", import.meta.url),
  "utf8",
);
const contactPage = await readFile(
  new URL("../src/app/contact/page.tsx", import.meta.url),
  "utf8",
);
const sitemapRoute = await readFile(
  new URL("../src/app/sitemap.ts", import.meta.url),
  "utf8",
);
const robotsRoute = await readFile(
  new URL("../src/app/robots.ts", import.meta.url),
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
  assert.match(labScene, /useSceneActivationIntent/);
  assert.match(labScene, /pointerdown/);
  assert.match(labScene, /keydown/);
  assert.match(labScene, /scroll/);
  assert.doesNotMatch(labScene, /pointermove|mousemove/);
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

test("the laboratory control rail preserves accessible navigation contracts", () => {
  assert.match(controlRail, /<header/);
  assert.match(controlRail, /aria-expanded=\{isActive\}/);
  assert.match(controlRail, /aria-controls="primary-navigation-dialog"/);
  assert.match(controlRail, /dialog\.showModal\(\)/);
  assert.match(controlRail, /event\.key === "Escape"/);
  assert.match(controlRail, /removeEventListener\("keydown", handleEscape\)/);
  assert.match(controlRail, /triggerRef\.current\?\.focus\(\)/);
  assert.match(expandedNavigation, /<dialog/);
  assert.match(expandedNavigation, /onCancel=\{handleCancel\}/);
  assert.match(expandedNavigation, /<nav aria-label="Primary navigation"/);
  assert.match(expandedNavigation, /aria-current=/);
  assert.match(controlRailStyles, /env\(safe-area-inset-top\)/);
  assert.match(navigationStyles, /env\(safe-area-inset-bottom\)/);
  assert.match(controlRailStyles, /min-height:\s*2\.75rem/);
  assert.match(navigationStyles, /min-height:\s*2\.75rem/);
});

test("the control rail has no preview or continuous input runtime", async () => {
  const removedNavigationFiles = [
    "../src/components/header/nav/body/body.tsx",
    "../src/components/header/nav/image/image.tsx",
    "../src/components/header/nav/footer/footer.tsx",
  ];

  await Promise.all(
    removedNavigationFiles.map((file) =>
      assert.rejects(access(new URL(file, import.meta.url))),
    ),
  );

  const navigationRuntime = `${controlRail}\n${expandedNavigation}`;
  assert.doesNotMatch(navigationRuntime, /thumbnail|framer-motion/);
  assert.doesNotMatch(
    navigationRuntime,
    /requestAnimationFrame|ResizeObserver|pointermove|mousemove/,
  );
});

test("the frozen Hero exposes one static editorial hierarchy", () => {
  assert.equal((hero.match(/<h1\b/g) ?? []).length, 1);
  assert.match(hero, /Om Kumar/);
  assert.match(hero, /I engineer resilient digital products/);
  assert.match(hero, /href="#projects"/);
  assert.match(hero, />Resume</);
  assert.match(hero, /<nav[\s\S]*?aria-label="Social profiles"/);
  assert.match(hero, /GitHub/);
  assert.match(hero, /LinkedIn/);
  assert.match(hero, /X/);
  assert.doesNotMatch(hero, /framer-motion|BlurIn|BoxReveal|SectionWrapper|gsap/);
  assert.doesNotMatch(heroStyles, /animation\s*:|transition\s*:/);
});

test("the keyboard poster reserves the live scene geometry", async () => {
  await assert.doesNotReject(
    access(new URL("../public/assets/keyboard-poster.jpg", import.meta.url)),
  );

  assert.match(hero, /src="\/assets\/keyboard-poster\.jpg"/);
  assert.match(hero, /width=\{1586\}/);
  assert.match(hero, /height=\{992\}/);
  assert.match(heroStyles, /aspect-ratio:\s*793 \/ 496/);
  assert.doesNotMatch(heroStyles, /display:\s*none/);
  assert.match(labScene, /data-lab-scene-ready=\{isSceneReady\}/);
  assert.match(animatedBackground, /onSceneVisible\(\)/);
});

test("GSAP exclusively owns the frozen Hero choreography", () => {
  assert.match(hero, /createHeroChoreography/);
  assert.match(heroChoreography, /gsap\.timeline/);
  assert.equal((heroChoreography.match(/gsap\.timeline/g) ?? []).length, 1);
  assert.match(heroChoreography, /requestAnimationFrame/);
  assert.match(heroChoreography, /data-lab-scene-ready/);
  assert.match(heroChoreography, /scrollTrigger/);
  assert.match(heroChoreography, /prefers-reduced-motion: reduce/);
  assert.match(heroChoreography, /MOTION_TOKENS/);
  assert.doesNotMatch(heroStyles, /animation\s*:|transition\s*:/);
  assert.doesNotMatch(heroChoreography, /setInterval|pointermove|mousemove/);
  assert.match(motionTokens, /duration/);
  assert.match(motionTokens, /easing/);
  assert.match(motionTokens, /scroll/);
});

test("the Skills narrative preserves a semantic text equivalent for every key", () => {
  assert.match(skills, /<section/);
  assert.match(skills, /aria-labelledby="skills-title"/);
  assert.match(skills, /<h2 id="skills-title"/);
  assert.match(skills, /Capability index \/ 24 instruments/);
  assert.match(skills, /SKILL_GROUPS\.map/);
  assert.match(skills, /SKILLS\[skillName\]/);
  assert.match(skills, /skill\.shortDescription/);
  assert.doesNotMatch(skills, /SectionWrapper|SectionHeader|framer-motion/);
  assert.doesNotMatch(skills, /canvas|Spline|gsap|requestAnimationFrame/);
  assert.doesNotMatch(skillsStyles, /animation\s*:|transition\s*:/);
  assert.match(skillsStyles, /height:\s*100svh/);
  assert.match(skillsStyles, /height:\s*150svh/);
});

test("the Experience narrative is a static semantic record of outcomes", () => {
  assert.equal((experience.match(/<h2\b/g) ?? []).length, 1);
  assert.match(experience, /aria-labelledby="experience-title"/);
  assert.match(experience, /<ol[\s\S]*?aria-label="Professional experience"/);
  assert.match(experience, /EXPERIENCE\.map/);
  assert.match(experience, /experience\.title/);
  assert.match(experience, /experience\.company/);
  assert.match(experience, /experience\.startDate/);
  assert.match(experience, /experience\.endDate/);
  assert.match(experience, />\s*Impact\s*</);
  assert.match(experience, />\s*Technologies\s*</);
  assert.match(experience, /experience\.description\.map/);
  assert.match(experience, /experience\.skills\.map/);
  assert.doesNotMatch(
    experience,
    /framer-motion|SectionWrapper|SectionHeader|canvas|Spline|gsap/,
  );
  assert.doesNotMatch(experienceStyles, /animation\s*:|transition\s*:/);
});

test("the Projects overview is one compact seven-project gallery", () => {
  assert.equal((projectsSection.match(/<h2\b/g) ?? []).length, 1);
  assert.match(projectsSection, /aria-labelledby="projects-title"/);
  assert.match(projectsSection, /projects\.map/);
  assert.match(projectsSection, /aria-label="Featured projects"/);
  assert.match(projectsSection, /tabIndex=\{0\}/);
  assert.match(projectsSection, /project\.valueProposition/);
  assert.match(projectsSection, /data-project-card/);
  assert.match(projectsSection, /data-project-media/);
  assert.match(projectsSection, /next\/image/);
  assert.match(projectsSection, /Open \$\{project\.title\} live demo in a new tab/);
  assert.match(projectsSection, /Open \$\{project\.title\} GitHub repository in a new tab/);
  assert.doesNotMatch(
    projectsSection,
    /FEATURED_PROJECT_COUNT|Project archive|record count|project\.year|project\.status|project\.coreTechnologies|data-case-study-path/,
  );
  assert.doesNotMatch(
    projectsSection,
    /Modal|FloatingDock|SectionWrapper|SectionHeader|canvas|Spline|gsap/,
  );
  assert.match(projectsStyles, /max-width:\s*1400px/);
  assert.match(projectsStyles, /grid-template-columns:\s*repeat\(2, minmax\(0, 620px\)\)/);
  assert.match(projectsStyles, /gap:\s*32px/);
  assert.match(projectsStyles, /aspect-ratio:\s*16 \/ 9/);
  assert.match(projectsStyles, /max-width:\s*568px/);
  assert.match(projectsStyles, /max-height:\s*320px/);
  assert.match(projectsStyles, /border-radius:\s*18px/);
  assert.match(projectsStyles, /-webkit-line-clamp:\s*2/);
  assert.match(projectsStyles, /@media \(max-width: 700px\)/);
  assert.match(projectsStyles, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(projectsStyles, /animation\s*:/);
  assert.doesNotMatch(projectsStyles, /transition(?:-property)?\s*:/);
  assert.doesNotMatch(
    projectsStyles,
    /transition(?:-property)?\s*:[^;]*(?:all|background|border|box-shadow|filter|width|height)/,
  );
  assert.match(projectsSection, /framer-motion/);
  assert.match(projectsSection, /whileHover="hover"/);
  assert.match(projectsSection, /whileFocus="hover"/);
  assert.match(projectsSection, /whileInView/);
  assert.match(projectsSection, /duration: reducedMotion \? 0 : 0\.35/);
  assert.match(projectsSection, /scale: reducedMotion \? 1 : 1\.04/);
  assert.match(projectsSection, /y: reducedMotion \? 0 : -8/);
  assert.doesNotMatch(
    projectsSection,
    /requestAnimationFrame|setInterval|canvas|Spline|filter\s*:|elastic|bounce/,
  );
  assert.match(projectsSection, /@\/data\/project-records/);
  assert.doesNotMatch(projectsSection, /@\/data\/projects/);
  assert.equal((projectRecords.match(/valueProposition:/g) ?? []).length, 8);
  assert.equal((projectRecords.match(/coreTechnologies:/g) ?? []).length, 8);
});

test("featured projects share one static case-study architecture", () => {
  assert.match(caseStudyPage, /FEATURED_PROJECT_IDS\.map/);
  assert.match(caseStudyPage, /dynamicParams = false/);
  assert.match(caseStudyPage, /generateStaticParams/);
  assert.match(caseStudyPage, /notFound\(\)/);
  assert.equal((caseStudyLayout.match(/<h1\b/g) ?? []).length, 1);
  assert.match(caseStudyLayout, /aria-label="Breadcrumb"/);
  assert.match(caseStudyLayout, /aria-label="Case study sections"/);
  assert.match(caseStudyLayout, /id="overview"/);
  assert.match(caseStudyLayout, /id="problem"/);
  assert.match(caseStudyLayout, /id="solution"/);
  assert.match(caseStudyLayout, /id="architecture"/);
  assert.match(caseStudyLayout, /id="results"/);
  assert.match(caseStudyLayout, /id="technology"/);
  assert.match(caseStudyLayout, /id="links"/);
  assert.match(caseStudyLayout, /data-editorial-placeholder="true"/);
  assert.match(caseStudyLayout, /project\.coreTechnologies\.map/);
  assert.match(caseStudyLayout, /opens in a new tab/);
  assert.doesNotMatch(
    `${caseStudyPage}\n${caseStudyLayout}`,
    /use client|framer-motion|gsap|requestAnimationFrame|canvas|Spline/,
  );
  assert.doesNotMatch(caseStudyStyles, /animation\s*:|transition\s*:/);
  assert.match(caseStudyStyles, /prefers-reduced-motion: reduce/);
});

test("the Contact finale preserves the email flow with accessible feedback", () => {
  assert.equal((contactSection.match(/<h2\b/g) ?? []).length, 1);
  assert.match(contactSection, /aria-labelledby="contact-title"/);
  assert.match(contactSection, /Direct channels/);
  assert.match(contactSection, /Project inquiry/);
  assert.match(contactSection, /closingMetadata/);
  assert.match(contactForm, /fetch\("\/api\/send"/);
  assert.match(contactForm, /JSON\.stringify\(\{[\s\S]*fullName,[\s\S]*email,[\s\S]*message/);
  assert.match(contactForm, /htmlFor="contact-full-name"/);
  assert.match(contactForm, /name="fullName"/);
  assert.match(contactForm, /type="email"/);
  assert.match(contactForm, /name="message"/);
  assert.match(contactForm, /minLength=\{10\}/);
  assert.match(contactForm, /role=\{submissionState === "error" \? "alert" : "status"\}/);
  assert.match(contactForm, /aria-live=/);
  assert.match(contactForm, /<noscript>/);
  assert.doesNotMatch(
    `${contactSection}\n${contactForm}`,
    /SectionWrapper|SectionHeader|framer-motion|useToast|useRouter|setTimeout/,
  );
  assert.doesNotMatch(contactStyles, /animation\s*:|transition\s*:/);
  assert.match(contactStyles, /prefers-reduced-motion: reduce/);
  assert.match(contactApi, /Email\.safeParse\(body\)/);
  assert.match(contactApi, /resend\.emails\.send/);
  assert.doesNotMatch(contactApi, /console\.log\(body\)/);
  assert.match(environmentExample, /RESEND_API_KEY=/);
  assert.match(environmentExample, /UMAMI_DOMAIN=/);
  assert.match(environmentExample, /UMAMI_SITE_ID=/);
  assert.doesNotMatch(environmentExample, /NEXT_PUBLIC_WS_URL|ADMIN_PASSWORD/);
});

test("the global polish pass preserves the frozen editorial rhythm", () => {
  assert.match(
    contactStyles,
    /padding:\s*var\(--space-24\) var\(--gutter-page\)/,
  );
  assert.match(contactStyles, /@media \(max-width: 56rem\)/);
  assert.match(contactStyles, /overflow-wrap:\s*anywhere/);
  assert.match(footer, /px-\[var\(--gutter-page\)\]/);
  assert.doesNotMatch(
    `${contactStyles}\n${footer}`,
    /animation\s*:|transition\s*:|framer-motion|requestAnimationFrame/,
  );
});

test("the production metadata surface is complete", () => {
  assert.match(rootLayout, /metadataBase: new URL\(config\.site\)/);
  assert.match(rootLayout, /canonical: "\/"/);
  assert.match(rootLayout, /application\/ld\+json/);
  assert.match(rootLayout, /"@type": "Person"/);
  assert.match(sitemapRoute, /FEATURED_PROJECT_IDS/);
  assert.match(sitemapRoute, /getBlogPosts\(\)/);
  assert.match(robotsRoute, /sitemap:/);
  assert.match(robotsRoute, /disallow: \["\/admin", "\/api\/"\]/);
});

test("secondary documents preserve one accessible primary heading", () => {
  assert.equal((aboutPage.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((contactPage.match(/<h1\b/g) ?? []).length, 1);
  assert.match(contactPage, /<main>/);
  assert.match(contactPage, /name="email"/);
  assert.match(contactPage, /name="message"/);
  assert.match(footer, /aria-label="Footer navigation"/);
  assert.match(aboutPage, /w-full min-w-0 lg:basis-3\/4/);
  assert.doesNotMatch(aboutPage, /w-\[500px\]/);
});

test("the optimized poster stays within its production budget", async () => {
  const poster = await stat(
    new URL("../public/assets/keyboard-poster.jpg", import.meta.url),
  );

  assert.ok(poster.size <= 150_000);
  await assert.rejects(
    access(new URL("../public/assets/keyboard-poster.png", import.meta.url)),
  );
  await assert.doesNotReject(
    access(new URL("../public/assets/seo/og-image.jpg", import.meta.url)),
  );
});
