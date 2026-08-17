#!/usr/bin/env node
/**
 * Sinh 3 file CSV đầu vào - mỗi endpoint group một file riêng (đề mục 6:89:
 * "Each endpoint group must have its own CSV input file... A single shared
 * CSV is not sufficient").
 *
 * Nguyên tắc: giá trị kỳ vọng trong CSV được tính từ danh mục sản phẩm mà
 * scripts/seed-data.js tạo ra, KHÔNG lấy ngược từ phản hồi của SUT. Nếu suy
 * ngược từ SUT thì assertion chỉ chép lại hành vi hiện tại và không bao giờ
 * bắt được lỗi.
 *
 * Chạy: node scripts/gen-csv.js
 */

const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "data");

// ---------------------------------------------------------------- danh mục
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

// 5 sản phẩm có sẵn trong seed gốc của SUT (sut/backend/database.js:98-102)
const SUT_SEED = [
  "iPhone 15 Pro Max",
  "Samsung Galaxy S24 Ultra",
  "MacBook Pro M3",
  "Tai nghe AirPods Pro 2",
  "Bàn phím cơ Keychron Q1",
];

function allProductNames() {
  const names = [...SUT_SEED];
  for (const brand of BRANDS) {
    for (let gen = 1; gen <= 3; gen++) {
      for (const variant of VARIANTS) {
        names.push(
          `${brand.name} ${brand.name === "iPhone" ? 13 + gen : gen} ${variant}`,
        );
      }
    }
  }
  return names;
}

// SQLite LIKE '%x%' không phân biệt hoa thường với ký tự ASCII
const countMatches = (names, term) =>
  names.filter((n) => n.toLowerCase().includes(term.toLowerCase())).length;

// ------------------------------------------------- 1. read-heavy: tìm kiếm
function writeProductsCsv() {
  const names = allProductNames();

  const terms = [
    "iPhone",
    "Samsung",
    "Xiaomi",
    "MacBook",
    "ThinkPad",
    "AirPods",
    "Keychron",
    "Pro Max",
    "Ultra",
    "Plus",
    "Air",
    "Lite",
  ];

  const rows = terms.map((t) => ({
    search_term: t,
    expect_min_count: countMatches(names, t),
    expect_code: "200",
    note: "tu khoa khop",
  }));

  // Từ khoá không khớp gì - kiểm SUT trả mảng rỗng chứ không phải lỗi
  rows.push({
    search_term: "KhongTonTaiXYZ",
    expect_min_count: 0,
    expect_code: "200",
    note: "khong khop - phai tra mang rong",
  });

  // Dấu nháy đơn: server.js:144 nối thẳng chuỗi vào SQL nên câu lệnh vỡ.
  // Theo đặc tả đúng, tìm kiếm một chuỗi bất kỳ phải trả 200 + JSON.
  // Dòng này DỰ KIẾN FAIL và chính cái fail đó là bằng chứng lỗi.
  rows.push({
    search_term: "O'Neill",
    expect_min_count: 0,
    expect_code: "200",
    note: "dau nhay don - du kien lo loi SQL injection",
  });

  write("products.csv", ["search_term", "expect_min_count", "expect_code", "note"], rows);
  return rows.length;
}

// ------------------------------------------------- 2. auth-heavy: đăng nhập
function writeCredentialsCsv() {
  const rows = [];

  // 200 tài khoản hợp lệ - đo throughput thật của luồng xác thực
  for (let i = 1; i <= 200; i++) {
    const id = String(i).padStart(3, "0");
    rows.push({
      email: `perfuser${id}@eshop.test`,
      password: "Perf1234!",
      expect_code: "200",
      label: "valid",
    });
  }

  // 10 tài khoản riêng để thăm dò khoá tài khoản. Mật khẩu sai có chủ đích.
  // expect_code là biểu thức chính quy vì lần sai đầu trả 401, từ lần sau
  // tài khoản đã bị khoá nên trả 403 (server.js:40-44, 54-58).
  for (let i = 1; i <= 10; i++) {
    const id = String(i).padStart(3, "0");
    rows.push({
      email: `lockprobe${id}@eshop.test`,
      password: "SaiMatKhau!",
      expect_code: "401|403",
      label: "lockout-probe",
    });
  }

  write("credentials.csv", ["email", "password", "expect_code", "label"], rows);
  return rows.length;
}

// --------------------------------------- 3. transactional: giỏ hàng + đặt hàng
function writeOrdersCsv() {
  const ADDRESSES = [
    "12 Nguyen Hue, Quan 1, TP.HCM",
    "227 Nguyen Van Cu, Quan 5, TP.HCM",
    "45 Le Loi, Quan 1, TP.HCM",
    "88 Tran Hung Dao, Quan 1, TP.HCM",
    "3 Cong Hoa, Tan Binh, TP.HCM",
  ];

  const rows = [];
  // Dùng chính 200 tài khoản đã seed để mỗi luồng tự đăng nhập lấy token -
  // file này tự đủ, không phụ thuộc credentials.csv.
  for (let i = 1; i <= 200; i++) {
    const id = String(i).padStart(3, "0");
    const productId = ((i - 1) % 152) + 1;
    const quantity = (i % 3) + 1;
    const price = 5000000 + (productId % 10) * 1000000;
    rows.push({
      email: `perfuser${id}@eshop.test`,
      password: "Perf1234!",
      product_id: productId,
      quantity,
      price,
      total_amount: price * quantity,
      shipping_address: ADDRESSES[i % ADDRESSES.length],
    });
  }

  write(
    "orders.csv",
    ["email", "password", "product_id", "quantity", "price", "total_amount", "shipping_address"],
    rows,
  );
  return rows.length;
}

// ------------------------------------------------------------------ tiện ích
function write(file, headers, rows) {
  const esc = (v) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv =
    headers.join(",") +
    "\n" +
    rows.map((r) => headers.map((h) => esc(r[h])).join(",")).join("\n") +
    "\n";
  fs.writeFileSync(path.join(OUT, file), csv, "utf8");
  console.log(`${file.padEnd(18)} ${rows.length} dòng`);
}

console.log(`products.csv  ${writeProductsCsv()} dòng (đã in ở trên)`);
writeCredentialsCsv();
writeOrdersCsv();
