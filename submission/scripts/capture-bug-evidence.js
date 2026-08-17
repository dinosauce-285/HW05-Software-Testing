#!/usr/bin/env node
/**
 * Tái hiện từng lỗi bằng lệnh THẬT vào backend đang chạy, lấy nguyên văn output,
 * rồi render thành ảnh PNG để đính vào GitHub Issue (đề mục 6:96).
 *
 * Ảnh sinh ra là bản render của transcript có thật, KHÔNG phải ảnh chụp cửa sổ
 * terminal. Mỗi ảnh in kèm lệnh gốc + thời điểm chạy + hostname để người khác
 * chạy lại kiểm chứng được.
 *
 * Chạy: node scripts/capture-bug-evidence.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const OUT = path.resolve(__dirname, "../evidence/bugs");
fs.mkdirSync(OUT, { recursive: true });

const sh = (cmd) => {
  try {
    return execSync(cmd, { encoding: "utf8", timeout: 30000, shell: "/bin/bash" });
  } catch (e) {
    return (e.stdout || "") + (e.stderr || "");
  }
};

// Mỗi mục: chuỗi lệnh bash chạy thật, output giữ nguyên văn.
const CASES = [
  {
    id: "BUG-01",
    title: "SQL injection ở ?search= — dấu nháy đơn làm vỡ câu lệnh, trả HTTP 500 kèm HTML",
    cmds: [
      `curl -s -o /dev/null -w 'tu khoa binh thuong  -> HTTP %{http_code}\\n' "http://localhost:3000/api/products?search=iPhone"`,
      `curl -s -w '\\n<- HTTP %{http_code}  Content-Type: %{content_type}\\n' "http://localhost:3000/api/products?search=O%27Neill"`,
    ],
  },
  {
    id: "BUG-02",
    title: "Khoá tài khoản sau 2 lần sai chứ không phải 3",
    cmds: [
      `for i in 1 2 3; do printf 'lan sai #%s -> HTTP ' "$i"; curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:3000/api/login -H 'Content-Type: application/json' -d '{"email":"lockprobe002@eshop.test","password":"SaiMatKhau"}'; done`,
    ],
  },
  {
    id: "BUG-03",
    title: "Đang bị khoá thì mật khẩu ĐÚNG vẫn trả 403",
    cmds: [
      `echo 'tai khoan lockprobe002 vua bi khoa o BUG-02, gio dang nhap bang mat khau DUNG:'`,
      `curl -s -w '\\n<- HTTP %{http_code}\\n' -X POST http://localhost:3000/api/login -H 'Content-Type: application/json' -d '{"email":"lockprobe002@eshop.test","password":"Perf1234!"}'`,
    ],
  },
  {
    id: "BUG-05",
    title: "POST /api/checkout không kiểm giỏ hàng — đặt được đơn với giỏ rỗng",
    cmds: [
      `TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H 'Content-Type: application/json' -d '{"email":"perfuser199@eshop.test","password":"Perf1234!"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])'); \
       echo 'gio hang cua nguoi dung nay:'; curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/cart; \
       echo; echo 'dat hang ngay voi gio RONG:'; \
       curl -s -w '\\n<- HTTP %{http_code}\\n' -X POST http://localhost:3000/api/checkout -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"total_amount":999999999,"shipping_address":"Khong he them gi vao gio"}'`,
    ],
  },
  {
    id: "BUG-06",
    title: "POST /api/products không yêu cầu xác thực — ai cũng tạo được sản phẩm",
    cmds: [
      `echo 'KHONG gui header Authorization:'`,
      `curl -s -w '\\n<- HTTP %{http_code}\\n' -X POST http://localhost:3000/api/products -H 'Content-Type: application/json' -d '{"name":"SAN PHAM TAO BOI NGUOI LA","price":1,"description":"khong can token","imageUrl":"","category_id":1}'`,
    ],
  },
  {
    id: "BUG-07",
    title: "GET /api/orders/:id không xác thực — đọc được đơn của người khác (IDOR)",
    cmds: [
      `TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H 'Content-Type: application/json' -d '{"email":"perfuser001@eshop.test","password":"Perf1234!"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])'); \
       ID=$(curl -s -X POST http://localhost:3000/api/checkout -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"total_amount":12345,"shipping_address":"Don rieng tu cua perfuser001"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["orderId"])'); \
       echo "perfuser001 vua tao don #$ID"; echo; echo 'nguoi la doc don do, KHONG gui token:'; \
       curl -s -w '\\n<- HTTP %{http_code}\\n' "http://localhost:3000/api/orders/$ID"`,
    ],
  },
  {
    id: "BUG-08",
    title: "GET /api/products/:id trả price kiểu string khi id chẵn, number khi id lẻ",
    cmds: [
      `for id in 1 2 3 4; do printf 'id=%s -> ' "$id"; curl -s "http://localhost:3000/api/products/$id" | python3 -c 'import sys,json;d=json.load(sys.stdin);print("price =",repr(d["price"]),"| kieu:",type(d["price"]).__name__)'; done`,
    ],
  },
  {
    id: "BUG-09",
    title: "GET /api/products/:id với id không tồn tại trả 200 {} thay vì 404",
    cmds: [
      `curl -s -w '\\n<- HTTP %{http_code}\\n' http://localhost:3000/api/products/999999`,
    ],
  },
  {
    id: "BUG-10",
    title: "Mật khẩu lưu dạng plaintext trong CSDL",
    cmds: [
      `node -e "
const p=require('path'),B=p.resolve('sut/backend');
const s=require(p.join(B,'node_modules/sqlite3'));
const db=new s.Database(p.join(B,'database.sqlite'));
db.all(\\"SELECT id,email,password,role FROM users LIMIT 4\\",(e,r)=>{
  console.log('doc truc tiep bang users trong database.sqlite:');
  console.table(r); db.close();});
"`,
    ],
  },
  {
    id: "BUG-04",
    title: "Khởi động lại backend là xoá sạch toàn bộ CSDL",
    cmds: [
      `echo 'so ban ghi TRUOC khi restart:'; node scripts/count-orders.js | sed 's/^/  don hang: /'; curl -s http://localhost:3000/api/products | grep -o '"id"' | wc -l | sed 's/^/  san pham: /'`,
      `echo; echo 'doan ma gay ra - sut/backend/database.js:'; sed -n '13,21p' sut/backend/database.js`,
      `echo; echo 'va no duoc goi ngay khi file duoc import:'; sed -n '115,118p' sut/backend/database.js`,
    ],
  },
];

const results = [];
for (const c of CASES) {
  const parts = c.cmds.map((cmd) => ({
    cmd: cmd.replace(/\s*\\\n\s*/g, " ").trim(),
    out: sh(cmd),
  }));
  results.push({ ...c, parts });
  console.log(`✓ ${c.id}`);
}

fs.writeFileSync(
  path.join(OUT, "transcripts.json"),
  JSON.stringify(
    { host: os.hostname(), user: os.userInfo().username, at: new Date().toISOString(), results },
    null,
    2,
  ),
);
console.log(`\nĐã lưu ${results.length} transcript vào ${OUT}/transcripts.json`);
