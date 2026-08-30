import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Cadence practice-room entry point", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cadence — Assisted Piano Practice<\/title>/);
  assert.match(html, /Don’t just repeat it\./);
  assert.match(html, /<em>Solve it\.<\/em>/);
  assert.match(html, /Begin a practice session/);
  assert.match(html, /View past sessions/);
  assert.match(html, /Play first\. Fix second\./);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/);
  assert.doesNotMatch(html, /name=["']codex-preview["']/i);
});

test("server-renders Cadence metadata and branded assets", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /<meta name="description" content="A thoughtful piano practice companion/);
  assert.match(html, /<meta property="og:title" content="Cadence — Assisted Piano Practice"/);
  assert.match(html, /<meta property="og:description" content="Don’t just repeat it\. Solve it\."/);
  assert.match(html, /<meta property="og:image" content="[^"]*\/og\.png"/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  assert.match(html, /<link rel="shortcut icon" href="\/favicon\.ico"/);
  assert.match(html, /<link rel="icon" href="\/favicon\.ico" type="image\/x-icon"/);
});
