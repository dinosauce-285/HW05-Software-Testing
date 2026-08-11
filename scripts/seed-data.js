#!/usr/bin/env node
/**
 * Sinh dữ liệu nền cho 3 kịch bản hiệu năng HW05.
 *
 * Vì sao cần: DB seed sẵn của EShop chỉ có 5 sản phẩm và 2 tài khoản
 * (sut/backend/database.js:91-102) - không đủ cho test data-driven, và
 * riêng kịch bản Stress trên /api/login thì 2 tài khoản chạy vài giây là
 * hết vì SUT khoá tài khoản sau 2 lần đăng nhập sai (server.js:54).
 *
 * Chạy: node scripts/seed-data.js   (backend phải đang chạy ở cổng 3000)
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

const PERF_USERS = 200; // tài khoản hợp lệ cho luồng Stress chính
const LOCK_USERS = 10; // tài khoản riêng để thăm dò lockout, không dùng ở luồng chính
const PASSWORD = "Perf1234!";

// Tên sản phẩm sinh theo tổ hợp thương hiệu x dòng máy để biết TRƯỚC số kết quả
// mà mỗi từ khoá tìm kiếm phải trả về - kỳ vọng của assertion suy từ đây, không
// suy ngược từ phản hồi của SUT.
const BRANDS = [
  { name: "iPhone", category: 1, base: 25000000 },
  { name: "Samsung", category: 1, base: 20000000 },
  { name: "Xiaomi", category: 1, base: 8000000 },
  { name: "MacBook", category: 2, base: 40000000 },
  { name: "ThinkPad", category: 2, base: 30000000 },
  { name: "AirPods", category: 3, base: 5000000 },
  { name: "Keychron", category: 3, base: 3000000 },
];
const VARIANTS = ["Pro", "Pro Max", "Plus", "Air", "Ultra", "Lite", "SE"];

function buildCatalog() {
  const items = [];
  for (const brand of BRANDS) {
    for (let gen = 1; gen <= 3; gen++) {
      for (const variant of VARIANTS) {
        items.push({
          name: `${brand.name} ${brand.name === "iPhone" ? 13 + gen : gen} ${variant}`,
          price: brand.base + gen * 1000000,
          description: `Hàng chính hãng ${brand.name}, phiên bản ${variant}`,
          imageUrl: "",
          category_id: brand.category,
        });
      }
    }
  }
  return items;
}

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

async function main() {
  // 1. Sản phẩm - POST /api/products không yêu cầu token (server.js:167)
  const catalog = buildCatalog();
  let created = 0;
  for (const item of catalog) {
    const r = await post("/api/products", item);
    if (r.status === 200) created++;
  }
  console.log(`Sản phẩm đã tạo: ${created}/${catalog.length}`);

  // 2. Tài khoản hợp lệ cho Stress
  let users = 0;
  for (let i = 1; i <= PERF_USERS; i++) {
    const id = String(i).padStart(3, "0");
    const r = await post("/api/register", {
      name: `Perf User ${id}`,
      email: `perfuser${id}@eshop.test`,
      password: PASSWORD,
    });
    if (r.status === 200) users++;
  }
  console.log(`Tài khoản hợp lệ đã tạo: ${users}/${PERF_USERS}`);

  // 3. Tài khoản dành riêng cho thăm dò lockout - tách khỏi luồng chính để
  //    số liệu độ trễ của luồng hợp lệ không bị 403 "đã khoá" làm nhiễu.
  let lockUsers = 0;
  for (let i = 1; i <= LOCK_USERS; i++) {
    const id = String(i).padStart(3, "0");
    const r = await post("/api/register", {
      name: `Lock Probe ${id}`,
      email: `lockprobe${id}@eshop.test`,
      password: PASSWORD,
    });
    if (r.status === 200) lockUsers++;
  }
  console.log(`Tài khoản thăm dò lockout đã tạo: ${lockUsers}/${LOCK_USERS}`);

  const total = await fetch(BASE + "/api/products").then((r) => r.json());
  console.log(`Tổng sản phẩm trong DB: ${total.length}`);
}

main().catch((e) => {
  console.error("Seed thất bại:", e.message);
  process.exit(1);
});
