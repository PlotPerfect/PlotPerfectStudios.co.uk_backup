const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(process.argv[2] || process.cwd());
const endpoint = "https://api.emailjs.com/api/v1.0/email/send";

function serveSite() {
  const types = { ".css": "text/css", ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relative = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
    const target = path.resolve(root, relative.endsWith("/") ? `${relative}index.html` : relative);
    if (!target.startsWith(`${root}${path.sep}`) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": types[path.extname(target).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(target).pipe(response);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

async function fillContact(page, suffix = "one") {
  await page.fill('[name="name"]', "Test Person");
  await page.fill('[name="email"]', `test-${suffix}@example.com`);
  await page.fill('[name="company"]', "Example Ltd");
  await page.selectOption('[name="service"]', { index: 1 });
  await page.selectOption('[name="budget"]', { index: 1 });
  await page.selectOption('[name="timeline"]', { index: 1 });
  await page.fill('[name="message"]', "This is a mock browser test enquiry only.");
  await page.check('[name="consent"]');
}

async function fillFree(page) {
  await page.fill('[name="name"]', "Test Person");
  await page.fill('[name="email"]', "free-test@example.com");
  await page.fill('[name="business"]', "Example service business");
  await page.fill('[name="goals"]', "Generate more relevant mock enquiries.");
  await page.check('[name="consent"]');
}

(async () => {
  const server = await serveSite();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
  const failures = [];
  const checks = [];
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    window.__FORM_TIMEOUT_MS__ = 120;
    window.__MOCK_EMAIL_MODE__ = "success";
    window.__EMAIL_REQUEST_COUNT__ = 0;
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, options = {}) => {
      const url = typeof input === "string" ? input : input.url;
      if (url !== "https://api.emailjs.com/api/v1.0/email/send") return nativeFetch(input, options);
      window.__EMAIL_REQUEST_COUNT__ += 1;
      if (window.__MOCK_EMAIL_MODE__ === "success") {
        return new Promise((resolve) => setTimeout(() => resolve(new Response("OK", { status: 200 })), 120));
      }
      if (window.__MOCK_EMAIL_MODE__ === "failure") return Promise.resolve(new Response("Mock failure", { status: 500 }));
      return new Promise((resolve, reject) => {
        options.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
      });
    };
  });
  const page = await context.newPage();
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith(base)) return route.continue();
    return route.abort();
  });

  const record = (name, pass, detail = "") => {
    checks.push({ name, pass, detail });
    if (!pass) failures.push({ name, detail });
  };

  await page.goto(`${base}/contact.html`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  await page.click("#submitBtn");
  record("contact invalid submit focuses first field", await page.evaluate(() => document.activeElement?.getAttribute("name") === "name"));
  record("contact invalid submit makes no request", await page.evaluate(() => window.__EMAIL_REQUEST_COUNT__ === 0));
  record("contact invalid state is announced", (await page.locator("#formStatus").getAttribute("data-state")) === "error");

  await fillContact(page, "success");
  await page.evaluate(() => { window.__MOCK_EMAIL_MODE__ = "success"; });
  const beforeSuccess = await page.evaluate(() => window.__EMAIL_REQUEST_COUNT__);
  await page.click("#submitBtn");
  await page.click("#submitBtn", { force: true });
  await page.waitForFunction(() => document.querySelector("#formStatus")?.dataset.state === "success");
  const afterSuccess = await page.evaluate(() => window.__EMAIL_REQUEST_COUNT__);
  record("contact success requires one acknowledged request", afterSuccess - beforeSuccess === 1, `requests=${afterSuccess - beforeSuccess}`);
  record("contact success resets fields", (await page.inputValue('[name="name"]')) === "");
  record("contact submit does not put PII in URL", page.url() === `${base}/contact.html`, page.url());

  await fillContact(page, "failure");
  await page.evaluate(() => { window.__MOCK_EMAIL_MODE__ = "failure"; });
  await page.click("#submitBtn");
  await page.waitForFunction(() => document.querySelector("#formStatus")?.dataset.state === "error");
  record("contact failure preserves entered values", (await page.inputValue('[name="email"]')) === "test-failure@example.com");
  record("contact failure explains delivery is unconfirmed", (await page.locator("#formStatus").textContent()).includes("couldn’t confirm delivery"));

  await page.evaluate(() => { window.__MOCK_EMAIL_MODE__ = "timeout"; });
  await page.click("#submitBtn");
  await page.waitForFunction(() => document.querySelector("#formStatus")?.textContent.includes("timed out"), null, { timeout: 2000 });
  record("contact timeout preserves entered values", (await page.inputValue('[name="email"]')) === "test-failure@example.com");

  await page.goto(`${base}/free-homepage-design.html`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  const beforeFreeInvalid = await page.evaluate(() => window.__EMAIL_REQUEST_COUNT__);
  await page.click("#submitFreeBtn");
  record("free-homepage invalid submit makes no request", await page.evaluate((before) => window.__EMAIL_REQUEST_COUNT__ === before, beforeFreeInvalid));
  record("free-homepage invalid submit focuses first field", await page.evaluate(() => document.activeElement?.getAttribute("name") === "name"));
  await fillFree(page);
  await page.evaluate(() => { window.__MOCK_EMAIL_MODE__ = "success"; });
  const beforeFreeSuccess = await page.evaluate(() => window.__EMAIL_REQUEST_COUNT__);
  await page.click("#submitFreeBtn");
  await page.waitForFunction(() => document.querySelector("#freeFormStatus")?.dataset.state === "success");
  record("free-homepage success uses acknowledged request", await page.evaluate((before) => window.__EMAIL_REQUEST_COUNT__ - before === 1, beforeFreeSuccess));
  record("free-homepage success resets fields", (await page.inputValue('[name="name"]')) === "");
  record("free-homepage CTA stays on the request form", (await page.locator('a.btn.primary[href="#request"]').count()) >= 2);

  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  const report = JSON.stringify({ checks, failures }, null, 2);
  console.log(report);
  process.exitCode = failures.length ? 1 : 0;
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
