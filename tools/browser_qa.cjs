const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");

const siteRoot = path.resolve(process.argv[2] || process.cwd());
const screenshotDir = process.argv[3] || process.cwd();
const routeOverride = process.argv[4] || "";
const widthOverride = Number(process.argv[5] || 0);
const routes = [
  "/",
  "/services.html",
  "/ui-ux-design.html",
  "/free-homepage-design.html",
  "/web-design-epping.html",
  "/web-design-hertfordshire.html",
  "/web-design-kent.html",
  "/web-development.html",
  "/vehicle-wrap-designs.html",
  "/work/bark-lane-daycare.html",
  "/work/ewing-law.html",
  "/contact.html",
];

(async () => {
  fs.mkdirSync(screenshotDir, { recursive: true });
  const mimeTypes = {
    ".css": "text/css",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".json": "application/json",
    ".mp4": "video/mp4",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
    const filePath = path.resolve(siteRoot, relativePath.endsWith("/") ? `${relativePath}index.html` : relativePath);
    if (!filePath.startsWith(`${siteRoot}${path.sep}`) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const failures = [];
  const results = [];

  const viewports = [
    { name: "phone-360", width: 360, height: 800 },
    { name: "phone-390", width: 390, height: 844 },
    { name: "phone-412", width: 412, height: 915 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-1366", width: 1366, height: 900 },
  ].filter((viewport) => !widthOverride || viewport.width === widthOverride);
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.route("**/*", (route) => {
      const requestUrl = route.request().url();
      return requestUrl.startsWith(baseUrl) ? route.continue() : route.abort();
    });
    const browserErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().includes("ERR_FAILED")) {
        browserErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));

    const viewportRoutes = routeOverride ? [routeOverride] : viewport.width === 390
      ? routes
      : viewport.width === 1366
        ? ["/", "/contact.html", "/free-homepage-design.html", "/vehicle-wrap-designs.html"]
        : ["/", "/contact.html", "/free-homepage-design.html"];
    for (const route of viewportRoutes) {
      browserErrors.length = 0;
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(50);
      const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.evaluate((top) => window.scrollTo(0, top), pageHeight);
      await page.waitForTimeout(10);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
      const data = await page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || "",
        canonical: document.querySelector('link[rel="canonical"]')?.href || "",
        robots: document.querySelector('meta[name="robots"]')?.content || "",
        h1Count: document.querySelectorAll("h1").length,
        bodyWidth: document.body.scrollWidth,
        viewportWidth: window.innerWidth,
        floatingPosition: document.querySelector(".pps-floating-widgets")
          ? getComputedStyle(document.querySelector(".pps-floating-widgets")).position
          : "missing",
        overflowElements: [...document.querySelectorAll("body *")]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              className: String(element.className || "").slice(0, 100),
              right: Math.round(rect.right),
              left: Math.round(rect.left),
              width: Math.round(rect.width),
              text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
            };
          })
          .filter((item) => item.right > window.innerWidth + 1 || item.left < -1)
          .slice(0, 12),
        images: [...document.images].map((image) => ({
          src: image.currentSrc || image.src,
          complete: image.complete,
          width: image.naturalWidth,
        })),
      }));
      const brokenImages = data.images.filter((image) => !image.complete || image.width === 0);
      const item = {
        viewport: viewport.name,
        route,
        status: response?.status() || 0,
        ...data,
        brokenImages,
        browserErrors: [...browserErrors],
      };
      results.push(item);
      if (
        item.status !== 200 ||
        item.h1Count !== 1 ||
        item.bodyWidth > item.viewportWidth + 1 ||
        (viewport.width <= 760 && item.floatingPosition === "fixed") ||
        brokenImages.length ||
        browserErrors.length
      ) {
        failures.push(item);
      }

    }
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route("**/*", (route) => {
    const requestUrl = route.request().url();
    return requestUrl.startsWith(baseUrl) ? route.continue() : route.abort();
  });
  await page.goto(`${baseUrl}/contact.html`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(350);
  const formCheck = await page.evaluate(() => {
    const form = document.querySelector("form");
    if (!form) return { exists: false };
    const submit = form.querySelector('[type="submit"]');
    submit?.focus();
    const submitStyle = submit ? getComputedStyle(submit) : null;
    return {
      exists: true,
      action: form.getAttribute("action"),
      requiredFields: form.querySelectorAll("[required]").length,
      submitLabel: submit?.textContent?.trim() || submit?.value || "",
      focusVisible: Boolean(submitStyle && submitStyle.outlineStyle !== "none" && submitStyle.outlineWidth !== "0px"),
    };
  });
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(150);
  await page.click("#navToggle");
  const menuCheck = await page.evaluate(() => ({
    expanded: document.querySelector("#navToggle")?.getAttribute("aria-expanded") === "true",
    exposed: document.querySelector("#mobileNav")?.getAttribute("aria-hidden") === "false",
  }));
  await page.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));

  if (!formCheck.focusVisible || !menuCheck.expanded || !menuCheck.exposed) {
    failures.push({ route: "interaction-checks", formCheck, menuCheck });
  }
  const report = JSON.stringify({ routes: results.length, failures, formCheck, menuCheck }, null, 2);
  console.log(report);
  process.exitCode = failures.length ? 1 : 0;
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
