#!/usr/bin/env node
/**
 * Vẽ biểu đồ RSS + CPU của tiến trình backend từ file đo tài nguyên có thật
 * (evidence/monitor/*.csv) rồi chụp thành PNG để đính vào GitHub Issue.
 *
 * Dữ liệu vẽ lấy nguyên từ CSV, không làm mượt, không nội suy.
 *
 * Chạy: node scripts/render-perf-chart.js <file.csv> <id> "<tieu de>" "<chu thich>"
 */

const fs = require("fs");
const path = require("path");
const { chromium } = require("/home/qt/.npm/_npx/9833c18b2d85bc59/node_modules/playwright");

const [csvPath, id, title, caption] = process.argv.slice(2);
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "evidence/bugs");

const lines = fs.readFileSync(csvPath, "utf8").trim().split("\n").slice(1);
const pts = lines.map((l) => {
  const c = l.split(",");
  return { cpu: parseFloat(c[2]) || 0, rss: (parseFloat(c[3]) || 0) / 1024 };
});

const W = 1080, H = 380, PAD = 62;
const maxRss = Math.ceil(Math.max(...pts.map((p) => p.rss)) / 10) * 10 + 10;
const maxCpu = Math.max(120, Math.ceil(Math.max(...pts.map((p) => p.cpu)) / 20) * 20);
const x = (i) => PAD + (i / (pts.length - 1)) * (W - PAD - 20);
const yR = (v) => H - PAD - (v / maxRss) * (H - PAD - 24);
const yC = (v) => H - PAD - (v / maxCpu) * (H - PAD - 24);

const line = (fn, key) => pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${fn(p[key]).toFixed(1)}`).join(" ");

const gridY = [0, 0.25, 0.5, 0.75, 1]
  .map((f) => {
    const v = maxRss * f, y = yR(v);
    return `<line x1="${PAD}" y1="${y}" x2="${W - 20}" y2="${y}" stroke="#21262d"/>
            <text x="${PAD - 10}" y="${y + 4}" fill="#7d8590" font-size="12" text-anchor="end">${Math.round(v)}</text>`;
  })
  .join("");

const first = pts[0].rss, peak = Math.max(...pts.map((p) => p.rss)), last = pts[pts.length - 1].rss;
const peakIdx = pts.findIndex((p) => p.rss === peak);

const html = `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box} body{margin:0;background:#0d1117;font-family:"Noto Sans","DejaVu Sans",sans-serif}
.wrap{width:1140px;padding:26px}
.hd{border-left:4px solid #d29922;padding:2px 0 2px 14px;margin-bottom:18px}
.id{color:#d29922;font-size:15px;font-weight:700;font-family:"DejaVu Sans Mono",monospace}
.ti{color:#e6edf3;font-size:22px;font-weight:700;margin-top:6px;line-height:1.4}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:14px}
.kpi{display:flex;gap:12px;margin:16px 0 4px}
.k{flex:1;background:#161b22;border:1px solid #30363d;border-radius:8px;padding:12px 14px}
.kl{color:#7d8590;font-size:12.5px}
.kv{color:#e6edf3;font-size:20px;font-weight:700;margin-top:5px;font-family:"DejaVu Sans Mono",monospace}
.lg{color:#7d8590;font-size:13px;margin-top:10px}
.lg b{color:#58a6ff}.lg i{color:#f85149;font-style:normal}
.ft{margin-top:18px;padding-top:13px;border-top:1px solid #21262d;color:#7d8590;font-size:13px;line-height:1.8}
.ft b{color:#adbac7}
</style><body><div class="wrap">
<div class="hd"><div class="id">${id}</div><div class="ti">${title}</div></div>
<div class="card"><svg width="${W}" height="${H}">
  ${gridY}
  <path d="${line(yC, "cpu")}" fill="none" stroke="#f85149" stroke-width="1.5" opacity=".75"/>
  <path d="${line(yR, "rss")}" fill="none" stroke="#58a6ff" stroke-width="2.5"/>
  <line x1="${x(peakIdx)}" y1="24" x2="${x(peakIdx)}" y2="${H - PAD}" stroke="#d29922" stroke-dasharray="4 4"/>
  <text x="${x(peakIdx) + 8}" y="38" fill="#d29922" font-size="13" font-weight="700">đỉnh ${peak.toFixed(1)} MB</text>
  <text x="${PAD - 10}" y="18" fill="#7d8590" font-size="12" text-anchor="end">MB</text>
  <text x="${PAD}" y="${H - 22}" fill="#7d8590" font-size="12">bắt đầu</text>
  <text x="${W - 20}" y="${H - 22}" fill="#7d8590" font-size="12" text-anchor="end">kết thúc</text>
</svg>
<div class="lg"><b>▬ RSS (MB)</b> &nbsp;·&nbsp; <i>▬ CPU (%)</i> &nbsp;·&nbsp; ${pts.length} mẫu lấy từ /proc/&lt;pid&gt;/stat</div>
</div>
<div class="kpi">
  <div class="k"><div class="kl">RSS lúc bắt đầu</div><div class="kv">${first.toFixed(1)} MB</div></div>
  <div class="k"><div class="kl">RSS đỉnh</div><div class="kv">${peak.toFixed(1)} MB</div></div>
  <div class="k"><div class="kl">RSS lúc kết thúc</div><div class="kv">${last.toFixed(1)} MB</div></div>
  <div class="k"><div class="kl">Không nhả lại</div><div class="kv">${(last - first).toFixed(1)} MB</div></div>
</div>
<div class="ft">${caption}<br>
Nguồn: <b>${path.basename(csvPath)}</b> · máy <b>qt-ThinkBook-14-G5-IRH</b> · HW05 · MSSV 23127262</div>
</div></body>`;

(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  const p = await (await b.newContext({ viewport: { width: 1140, height: 800 }, deviceScaleFactor: 2 })).newPage();
  await p.setContent(html, { waitUntil: "load" });
  await p.locator(".wrap").screenshot({ path: path.join(OUT, `${id}.png`) });
  console.log(`✓ ${id}.png`);
  await b.close();
})();
