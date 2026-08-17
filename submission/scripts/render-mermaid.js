#!/usr/bin/env node
/**
 * Render sơ đồ Mermaid trong một file Markdown thành ảnh PNG.
 *
 * Vì sao cần: GitHub render Mermaid trực tiếp trong Markdown, nhưng phần lớn công
 * cụ xuất PDF thì không — mà đề mục 2:23 đòi nộp kèm bản PDF, và mục 6:108 đòi
 * flow chart. Ảnh PNG bảo đảm sơ đồ hiện được ở cả hai định dạng.
 *
 * Chạy: node scripts/render-mermaid.js <file.md> <thu-muc-dau-ra>
 */

const fs = require("fs");
const path = require("path");
const { chromium } = require("/home/qt/.npm/_npx/9833c18b2d85bc59/node_modules/playwright");

const [mdPath, outDir] = process.argv.slice(2);
if (!mdPath || !outDir) {
  console.error("Dùng: node scripts/render-mermaid.js <file.md> <thu-muc-dau-ra>");
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const md = fs.readFileSync(mdPath, "utf8");
const blocks = [...md.matchAll(/```mermaid\n([\s\S]*?)```/g)].map((m) => m[1]);

if (!blocks.length) {
  console.error("Không tìm thấy khối ```mermaid nào trong " + mdPath);
  process.exit(1);
}

const page = (code) => `<!doctype html><meta charset="utf-8">
<style>
  body{margin:0;background:#fff;font-family:"Noto Sans","DejaVu Sans",sans-serif}
  #d{padding:28px;display:inline-block}
</style>
<div id="d" class="mermaid">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      fontFamily: 'Noto Sans, DejaVu Sans, sans-serif',
      fontSize: '15px',
      primaryColor: '#eef4ff',
      primaryTextColor: '#111',
      primaryBorderColor: '#5b8def',
      lineColor: '#555',
　　  },
    flowchart: { htmlLabels: true, curve: 'basis', nodeSpacing: 45, rankSpacing: 55 },
  });
  await mermaid.run();
  document.title = 'ok';
</script>`;

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(e.message));
  pg.on("console", (m) => m.type() === "error" && errs.push(m.text()));

  const base = path.basename(mdPath, ".md");
  for (let i = 0; i < blocks.length; i++) {
    errs.length = 0;
    await pg.setContent(page(blocks[i]), { waitUntil: "networkidle" });
    try {
      await pg.waitForFunction(() => document.querySelector("#d svg") !== null, { timeout: 20000 });
    } catch {
      console.error(`✗ sơ đồ #${i + 1} KHÔNG render được — cú pháp Mermaid sai`);
      errs.slice(0, 5).forEach((e) => console.error("   " + e));
      await browser.close();
      process.exit(1);
    }
    const name = blocks.length > 1 ? `${base}-${i + 1}.png` : `${base}.png`;
    await pg.locator("#d").screenshot({ path: path.join(outDir, name) });
    const box = await pg.locator("#d svg").boundingBox();
    console.log(`✓ ${name}  (${Math.round(box.width)}x${Math.round(box.height)} px)`);
  }
  await browser.close();
})();
