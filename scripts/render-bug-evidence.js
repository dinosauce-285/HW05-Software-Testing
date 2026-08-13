#!/usr/bin/env node
/**
 * Render transcript có thật (evidence/bugs/transcripts.json) thành ảnh PNG,
 * và chụp màn hình các dashboard HTML do JMeter sinh ra, để đính vào GitHub Issue.
 *
 * Hai loại ảnh, ghi rõ trong chân ảnh để không gây hiểu nhầm:
 *  - "transcript"  : bản render của output lệnh chạy thật (không phải ảnh chụp terminal)
 *  - "dashboard"   : ảnh chụp thật trang HTML do JMeter sinh, mở bằng Chromium
 *
 * Chạy: node scripts/render-bug-evidence.js
 */

const fs = require("fs");
const path = require("path");
const { chromium } = require("/home/qt/.npm/_npx/9833c18b2d85bc59/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "evidence/bugs");
const data = JSON.parse(fs.readFileSync(path.join(OUT, "transcripts.json"), "utf8"));

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page(bug) {
  const blocks = bug.parts
    .map(
      (p) => `
      <div class="blk">
        <div class="cmd"><span class="p">$</span> ${esc(p.cmd)}</div>
        <pre class="out">${esc(p.out.replace(/\n+$/, "")) || "<em>(khong co output)</em>"}</pre>
      </div>`,
    )
    .join("");

  return `<!doctype html><meta charset="utf-8"><style>
  /* Tieng Viet dung Noto Sans - font monospace tren may nay dat sai dau thanh
     (vi du "lan" thanh "lâǹ"). Monospace chi dung cho lenh va output, von la ASCII. */
  *{box-sizing:border-box} body{margin:0;background:#0d1117;font-family:"Noto Sans","DejaVu Sans",sans-serif}
  .wrap{width:1180px;padding:26px}
  .hd{border-left:4px solid #f85149;padding:2px 0 2px 14px;margin-bottom:18px}
  .id{color:#f85149;font-size:15px;font-weight:700;letter-spacing:.5px;font-family:"DejaVu Sans Mono",monospace}
  .ti{color:#e6edf3;font-size:22px;font-weight:700;margin-top:6px;line-height:1.4}
  .blk{margin-bottom:16px}
  .cmd{font-family:"DejaVu Sans Mono",monospace;background:#161b22;border:1px solid #30363d;border-bottom:none;border-radius:7px 7px 0 0;
       padding:11px 14px;color:#79c0ff;font-size:14.5px;line-height:1.6;word-break:break-all;white-space:pre-wrap}
  .p{color:#7ee787;font-weight:700;margin-right:8px}
  .out{font-family:"DejaVu Sans Mono",monospace;margin:0;background:#010409;border:1px solid #30363d;border-radius:0 0 7px 7px;
       padding:13px 14px;color:#c9d1d9;font-size:14.5px;line-height:1.65;white-space:pre-wrap;word-break:break-all}
  .ft{margin-top:20px;padding-top:14px;border-top:1px solid #21262d;color:#7d8590;font-size:13px;line-height:1.8}
  .ft b{color:#adbac7;font-weight:600}
  </style><body><div class="wrap">
    <div class="hd"><div class="id">${esc(bug.id)}</div><div class="ti">${esc(bug.title)}</div></div>
    ${blocks}
    <div class="ft">
      <b>Bản render transcript của lệnh chạy thật</b> — không phải ảnh chụp cửa sổ terminal.
      Lệnh gốc in kèm phía trên, chạy lại được để kiểm chứng.<br>
      Máy: <b>${esc(data.host)}</b> · user <b>${esc(data.user)}</b> · thời điểm chạy <b>${esc(data.at)}</b><br>
      SUT: EShop backend <b>http://localhost:3000</b> · HW05 Performance Testing · MSSV 23127262
    </div>
  </div></body>`;
}

(async () => {
  // Dùng Google Chrome cài sẵn trên máy: browser trong cache ms-playwright là bản
  // cũ hơn build mà package playwright này yêu cầu, và máy không có quyền sudo để
  // tải bản mới về đúng chỗ.
  const browser = await chromium.launch({ channel: "chrome" });
  const ctx = await browser.newContext({
    viewport: { width: 1180, height: 900 },
    deviceScaleFactor: 2,
  });
  const pg = await ctx.newPage();

  for (const bug of data.results) {
    await pg.setContent(page(bug), { waitUntil: "load" });
    const file = path.join(OUT, `${bug.id}.png`);
    await pg.locator(".wrap").screenshot({ path: file });
    console.log(`✓ ${bug.id}.png`);
  }

  // Ảnh chụp thật dashboard HTML của JMeter
  const dashboards = [
    { id: "PERF-02", dir: process.argv[2], note: "Stress 2000 luong" },
    { id: "PERF-03", dir: process.argv[3], note: "Soak 11 phut" },
    { id: "BUG-01-dashboard", dir: process.argv[4], note: "Load - ti le loi" },
  ];

  for (const d of dashboards) {
    if (!d.dir) continue;
    const idx = path.join(ROOT, "results/html", d.dir, "index.html");
    if (!fs.existsSync(idx)) {
      console.log(`- bo qua ${d.id}: khong thay ${idx}`);
      continue;
    }
    await pg.setViewportSize({ width: 1500, height: 1000 });
    await pg.goto("file://" + idx, { waitUntil: "networkidle" });
    await pg.waitForTimeout(1500);
    const file = path.join(OUT, `${d.id}.png`);
    await pg.screenshot({ path: file, fullPage: false });
    console.log(`✓ ${d.id}.png  (${d.note})`);
  }

  await browser.close();
})();
