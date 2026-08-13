#!/usr/bin/env node
/**
 * Tạo GitHub Issue cho từng lỗi đã ghi trong submission/report/Bug-Report.md,
 * mỗi issue đính ảnh bằng chứng tương ứng (đề mục 6:96 / R6).
 *
 * Chạy: node scripts/create-issues.js [--dry]
 */

const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const REPO = "dinosauce-285/HW05-Software-Testing";
const RAW = `https://raw.githubusercontent.com/${REPO}/main/evidence/bugs`;
const DRY = process.argv.includes("--dry");

const B = (id, title, sev, labels, body) => ({ id, title, sev, labels, body });

const ISSUES = [
  B("BUG-01", "SQL injection ở ?search= — dấu nháy đơn làm vỡ câu lệnh, trả HTTP 500 kèm HTML", "Nghiêm trọng", ["bug", "security"], `
**Vị trí:** \`backend/server.js:144\`

Tham số \`search\` được nối thẳng vào chuỗi SQL:

\`\`\`js
const query = \`SELECT * FROM products WHERE name LIKE '%\${searchQuery}%'\`;
\`\`\`

Chỉ cần một dấu nháy đơn trong từ khoá là câu lệnh vỡ. Ngoài ra khi lỗi, endpoint trả về **HTML** (\`server.js:149\`) trong khi client mong đợi JSON.

### Tái hiện
\`\`\`bash
curl -s -w '\\n<- HTTP %{http_code}  Content-Type: %{content_type}\\n' \\
  "http://localhost:3000/api/products?search=O%27Neill"
\`\`\`

### Kết quả thực tế
\`\`\`
<h1>Database Error</h1><p>SQLITE_ERROR: near "Neill": syntax error</p>
<- HTTP 500  Content-Type: text/html; charset=utf-8
\`\`\`

### Kỳ vọng
HTTP 200 với mảng JSON rỗng, hoặc HTTP 400 kèm body JSON. Tham số phải đi qua truy vấn tham số hoá (\`?\`).

### Phát hiện trong quá trình kiểm thử hiệu năng
Từ khoá này gây **6 808 lỗi 500** trong lượt ramp read-heavy và **480 lỗi** trong lượt Load — chiếm **100%** số lỗi của cả hai lượt.

![BUG-01](${RAW}/BUG-01.png)

Tỉ lệ lỗi trên dashboard JMeter của lượt Load:

![BUG-01 dashboard](${RAW}/BUG-01-dashboard.png)
`),

  B("BUG-02", "Khoá tài khoản sau 2 lần đăng nhập sai chứ không phải 3", "Cao", ["bug"], `
**Vị trí:** \`backend/server.js:54,56\`

\`\`\`js
const newAttempts = user.login_attempts + 2;   // cộng 2 mỗi lần sai
if (newAttempts >= 3) { ... }                  // ngưỡng khoá là 3
\`\`\`

Mỗi lần sai cộng **2** vào bộ đếm nhưng ngưỡng khoá là **3**, nên lần sai thứ hai đã đạt 4 và tài khoản bị khoá. Đặc tả (và chính đề bài HW05) mô tả cơ chế này là *"3-fail login lockout"*.

### Tái hiện
\`\`\`bash
for i in 1 2 3; do
  curl -s -o /dev/null -w "lan sai #$i -> HTTP %{http_code}\\n" \\
    -X POST http://localhost:3000/api/login -H 'Content-Type: application/json' \\
    -d '{"email":"lockprobe002@eshop.test","password":"SaiMatKhau"}'
done
\`\`\`

### Kết quả thực tế
\`\`\`
lan sai #1 -> HTTP 401
lan sai #2 -> HTTP 401
lan sai #3 -> HTTP 403      <- đã bị khoá, lẽ ra lần này mới là lần sai thứ 3
\`\`\`

### Kỳ vọng
Khoá sau **3** lần sai. Sửa \`+ 2\` thành \`+ 1\`.

### Xác nhận ở quy mô lớn
Kịch bản Stress dùng 10 tài khoản thăm dò: mỗi tài khoản nhận **đúng 2 phản hồi 401 rồi chuyển sang 403** — 20 lần 401 và 10 lần 403, không có ngoại lệ.

![BUG-02](${RAW}/BUG-02.png)
`),

  B("BUG-03", "Tài khoản đang bị khoá trả 403 ngay cả khi mật khẩu đúng", "Trung bình", ["bug"], `
**Vị trí:** \`backend/server.js:40\`

Kiểm tra trạng thái khoá đặt **trước** bước so sánh mật khẩu, nên trong 180 giây bị khoá thì người dùng nhập đúng mật khẩu vẫn bị từ chối.

### Tái hiện
Sau khi tài khoản bị khoá (xem #BUG-02), đăng nhập bằng mật khẩu **đúng**:

\`\`\`bash
curl -s -w '\\n<- HTTP %{http_code}\\n' -X POST http://localhost:3000/api/login \\
  -H 'Content-Type: application/json' \\
  -d '{"email":"lockprobe002@eshop.test","password":"Perf1234!"}'
\`\`\`

### Kết quả thực tế
\`\`\`
{"error":"Tài khoản đã bị khóa. Vui lòng thử lại sau."}
<- HTTP 403
\`\`\`

### Ảnh hưởng tới đo hiệu năng
Phản hồi 403 trả về **rất nhanh** vì bỏ qua bước so sánh mật khẩu. Nếu kịch bản đo trộn tài khoản đã khoá vào luồng chính thì throughput sẽ đẹp lên một cách giả tạo. Kịch bản Stress của bài này phải tách riêng hai luồng vì lý do đó.

![BUG-03](${RAW}/BUG-03.png)
`),

  B("BUG-04", "Khởi động lại backend là xoá sạch toàn bộ cơ sở dữ liệu", "Nghiêm trọng", ["bug"], `
**Vị trí:** \`backend/database.js:15-20\` và \`backend/database.js:117\`

\`initDatabase()\` mở đầu bằng 6 lệnh \`DROP TABLE IF EXISTS\`, và được gọi **ngay khi module được import**:

\`\`\`js
function initDatabase() {
    db.serialize(() => {
        db.run('DROP TABLE IF EXISTS coupon_usage');
        db.run('DROP TABLE IF EXISTS coupons');
        db.run('DROP TABLE IF EXISTS users');
        ...
initDatabase();   // dòng 117 - chạy khi require
\`\`\`

Vì \`server.js:4\` có \`require("./database")\`, **mỗi lần khởi động lại server là mất sạch dữ liệu**. Nguy hiểm hơn: bất kỳ script nào \`require('./database')\` chỉ để *đọc* dữ liệu cũng xoá luôn toàn bộ bảng.

### Ảnh hưởng thực tế
Trong lúc làm bài này, hai lần dữ liệu nền (200 tài khoản + 147 sản phẩm) bị mất do một lệnh chẩn đoán tưởng chỉ đọc.

### Kỳ vọng
Tách phần seed ra script riêng (\`npm run seed\`), không chạy như tác dụng phụ của việc import. Dùng \`CREATE TABLE IF NOT EXISTS\` cho đường khởi tạo thông thường.

![BUG-04](${RAW}/BUG-04.png)
`),

  B("BUG-05", "POST /api/checkout không kiểm giỏ hàng và không kiểm tồn kho", "Cao", ["bug"], `
**Vị trí:** \`backend/server.js:301\`

Endpoint insert thẳng vào bảng \`orders\` từ \`total_amount\` do client gửi lên, không đối chiếu giỏ hàng, không kiểm tồn kho, không tính lại tiền.

### Tái hiện
Đăng nhập một tài khoản **chưa từng thêm gì vào giỏ**, rồi đặt hàng ngay:

\`\`\`bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H 'Content-Type: application/json' \\
  -d '{"email":"perfuser199@eshop.test","password":"Perf1234!"}' | jq -r .token)

curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/cart      # -> []

curl -s -X POST http://localhost:3000/api/checkout -H "Authorization: Bearer $TOKEN" \\
  -H 'Content-Type: application/json' \\
  -d '{"total_amount":999999999,"shipping_address":"Khong he them gi vao gio"}'
\`\`\`

### Kết quả thực tế
\`\`\`
gio hang: []
{"message":"Checkout successful","orderId":1}
<- HTTP 200
\`\`\`

Đơn hàng 999 999 999 đ được tạo từ giỏ rỗng, số tiền do client tự khai.

### Kỳ vọng
Từ chối khi giỏ rỗng; tính \`total_amount\` từ dữ liệu phía server; kiểm tồn kho trước khi ghi đơn.

### Phát hiện trong kiểm thử hiệu năng
Kịch bản Spike tạo **8 559 đơn hàng** trong 5 phút mà không có bất kỳ ràng buộc nào chặn lại.

![BUG-05](${RAW}/BUG-05.png)
`),

  B("BUG-06", "POST/PUT/DELETE /api/products không yêu cầu xác thực", "Nghiêm trọng", ["bug", "security"], `
**Vị trí:** \`backend/server.js:167,179,191\`

Ba route ghi dữ liệu sản phẩm đều thiếu middleware \`authenticateToken\`, trong khi các route quản trị khác (\`/api/admin/*\`, \`/api/categories\`) đều có.

### Tái hiện
Không gửi header \`Authorization\`:

\`\`\`bash
curl -s -w '\\n<- HTTP %{http_code}\\n' -X POST http://localhost:3000/api/products \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"SAN PHAM TAO BOI NGUOI LA","price":1,"description":"khong can token","imageUrl":"","category_id":1}'
\`\`\`

### Kết quả thực tế
\`\`\`
{"message":"Product added","id":153}
<- HTTP 200
\`\`\`

Bất kỳ ai truy cập được API đều tạo, sửa, xoá sản phẩm tuỳ ý.

### Kỳ vọng
Bổ sung \`authenticateToken\` + kiểm quyền admin cho cả ba route.

![BUG-06](${RAW}/BUG-06.png)
`),

  B("BUG-07", "GET /api/orders/:id không xác thực — đọc được đơn hàng của người khác (IDOR)", "Cao", ["bug", "security"], `
**Vị trí:** \`backend/server.js:344\`

Đây là route duy nhất trong nhóm orders thiếu \`authenticateToken\`, trong khi \`/api/orders/my-orders\` (dòng 311) và \`/api/orders/:id/cancel\` (dòng 321) đều có. Không có cả bước đối chiếu \`user_id\`.

### Tái hiện
\`\`\`bash
# perfuser001 tạo một đơn riêng tư
TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H 'Content-Type: application/json' \\
  -d '{"email":"perfuser001@eshop.test","password":"Perf1234!"}' | jq -r .token)
ID=$(curl -s -X POST http://localhost:3000/api/checkout -H "Authorization: Bearer $TOKEN" \\
  -H 'Content-Type: application/json' \\
  -d '{"total_amount":12345,"shipping_address":"Don rieng tu cua perfuser001"}' | jq -r .orderId)

# người lạ đọc đơn đó, KHÔNG gửi token
curl -s -w '\\n<- HTTP %{http_code}\\n' "http://localhost:3000/api/orders/$ID"
\`\`\`

### Kết quả thực tế
\`\`\`
{"id":2,"user_id":3,"total_amount":12345,"status":"pending",
 "shipping_address":"Don rieng tu cua perfuser001","created_at":"2026-08-13 01:23:57"}
<- HTTP 200
\`\`\`

Lộ địa chỉ giao hàng và giá trị đơn của người dùng khác. Chỉ cần duyệt id tuần tự là lấy được toàn bộ đơn hàng của hệ thống.

### Kỳ vọng
HTTP 401 khi thiếu token, HTTP 403 khi \`order.user_id\` khác người gọi.

![BUG-07](${RAW}/BUG-07.png)
`),

  B("BUG-08", "GET /api/products/:id trả price kiểu string khi id chẵn, number khi id lẻ", "Trung bình", ["bug"], `
**Vị trí:** \`backend/server.js:162\`

\`\`\`js
if (row.id % 2 === 0) row.price = row.price.toString();
\`\`\`

Kiểu dữ liệu của cùng một trường thay đổi theo tính chẵn lẻ của id — client nào tính toán trực tiếp trên \`price\` sẽ nhận kết quả nối chuỗi thay vì phép cộng.

### Tái hiện
\`\`\`bash
for id in 1 2 3 4; do
  curl -s "http://localhost:3000/api/products/$id" | jq '.price | {value: ., type: (. | type)}'
done
\`\`\`

### Kết quả thực tế
\`\`\`
id=1 -> price = 30000000    | kieu: int
id=2 -> price = '28000000'  | kieu: str
id=3 -> price = 45000000    | kieu: int
id=4 -> price = '6000000'   | kieu: str
\`\`\`

### Kỳ vọng
\`price\` luôn là number. Dòng 162 không có mục đích nghiệp vụ nào.

![BUG-08](${RAW}/BUG-08.png)
`),

  B("BUG-09", "GET /api/products/:id với id không tồn tại trả HTTP 200 {} thay vì 404", "Thấp", ["bug"], `
**Vị trí:** \`backend/server.js:161\`

\`\`\`js
if (!row) return res.status(200).json({});
\`\`\`

### Tái hiện
\`\`\`bash
curl -s -w '\\n<- HTTP %{http_code}\\n' http://localhost:3000/api/products/999999
\`\`\`

### Kết quả thực tế
\`\`\`
{}
<- HTTP 200
\`\`\`

### Kỳ vọng
HTTP 404 kèm body mô tả lỗi. Trả 200 khiến client không phân biệt được "không tìm thấy" với "tìm thấy nhưng rỗng", và làm mọi assertion dựa trên mã trạng thái mất tác dụng.

![BUG-09](${RAW}/BUG-09.png)
`),

  B("BUG-10", "Mật khẩu lưu và so sánh dưới dạng plaintext", "Nghiêm trọng", ["bug", "security"], `
**Vị trí:** \`backend/server.js:46\` và \`backend/database.js:91\`

\`\`\`js
if (user.password === password) { ... }   // so sánh chuỗi trần
\`\`\`

Mật khẩu được ghi thẳng vào cột \`users.password\` khi đăng ký (\`server.js:23\`) và so sánh trực tiếp khi đăng nhập. Không có băm, không có salt.

### Tái hiện
Đọc thẳng bảng \`users\` trong \`database.sqlite\`:

\`\`\`bash
sqlite3 backend/database.sqlite "SELECT id,email,password,role FROM users LIMIT 4"
\`\`\`

### Kết quả thực tế
Mật khẩu hiện nguyên văn (\`Admin123!\`, \`Test1234!\`, ...) — bất kỳ ai đọc được file DB hoặc một bản backup đều lấy trọn danh sách mật khẩu.

### Kỳ vọng
Băm bằng bcrypt/argon2 kèm salt; so sánh bằng hàm compare tương ứng.

### Ghi chú về hiệu năng
Vì không băm, \`/api/login\` gần như không tốn CPU cho việc xác thực — throughput đạt tới **2 681 req/s** trước khi gãy. Con số này **không** đại diện cho một hệ thống có băm mật khẩu đúng cách; khi thêm bcrypt, throughput sẽ giảm nhiều lần.

![BUG-10](${RAW}/BUG-10.png)
`),

  B("PERF-01", "Giỏ hàng nằm trong RAM và không bao giờ được dọn (userCarts)", "Hiệu năng", ["performance"], `
**Vị trí:** \`backend/server.js:14,293\`

\`\`\`js
const userCarts = {};                 // dòng 14 - biến toàn cục trong RAM
userCarts[userId].push(req.body);     // dòng 293 - chỉ ghi thêm
\`\`\`

Không có đường xoá, không có TTL, không giới hạn kích thước. Giỏ hàng cũng không được dọn sau khi checkout thành công.

### Đo được
Kịch bản Spike (nền 20 luồng, vọt 400 luồng tại giây 120, thêm 12 767 mục vào giỏ):

| Mốc | RSS |
|---|---|
| Bắt đầu | 75,0 MB |
| Đỉnh (trong cú vọt) | 119,7 MB |
| Kết thúc (sau khi tải rút) | 94,0 MB |
| **Không nhả lại** | **19,0 MB** |

RSS không trở về mốc ban đầu sau khi tải rút hết. Với hệ thống chạy dài ngày, đây là đường tăng đơn điệu cho tới khi hết bộ nhớ.

Đối chứng: kịch bản soak 11 phút trên nhóm **read-heavy** (không đụng giỏ hàng) cho RSS **chững hẳn ở 161 MB** từ phút thứ 8 — tức là đường đọc không rò rỉ, chỉ đường ghi giỏ hàng mới rò.

### Kỳ vọng
Đưa giỏ hàng xuống CSDL hoặc cache có TTL; xoá giỏ sau khi checkout.

![PERF-01](${RAW}/PERF-01.png)
`),

  B("PERF-02", "POST /api/login sập độ trễ khi vượt khoảng 1 626 người dùng đồng thời", "Hiệu năng", ["performance"], `
Kịch bản Stress trên nhóm auth-heavy, tăng tải tuyến tính 1 luồng/giây.

### Đường cong gãy

| Luồng đồng thời | p95 | Tỉ lệ lỗi | Throughput |
|---|---|---|---|
| 250 | 3 ms | 0% | 622 req/s |
| 800 | 10 ms | 0% | 1 990 req/s |
| 1 426 | — | 0% | 2 568 req/s |
| **1 626** | — | **0,03%** ← lỗi đầu tiên | 2 627 req/s |
| 1 826 | — | 0,68% | **2 681 req/s** ← đỉnh |
| 2 000 | 1 671 ms | 3,85% | 2 443 req/s ← *giảm* dù tải tăng |

Dấu hiệu quá tải kinh điển: throughput đạt đỉnh rồi **đi xuống** trong khi độ trễ và tỉ lệ lỗi tăng vọt. Độ trễ tối đa chạm **34,2 giây**.

Phân rã 9 971 lỗi của lượt 2 000 luồng:
- **8 758** — vượt ngưỡng SLA 2 000 ms (assertion độ trễ), bản thân HTTP vẫn 200
- **1 210** — \`ConnectTimeoutException\`, hàng đợi accept của server đầy
- **3** — \`SocketTimeoutException\`

### Nguồn số liệu
\`results/raw/stress-20260813T003655Z.jtl\` — 770 065 mẫu, giữ nguyên vẹn.

![PERF-02](${RAW}/PERF-02.png)
`),

  B("PERF-03", "Toàn hệ thống nghẽn ở một nhân CPU vì Node đơn luồng", "Hiệu năng", ["performance"], `
Tại điểm gãy của kịch bản Stress, nút thắt **không** phải phần cứng và **không** phải công cụ đo:

| Chỉ số | Giá trị | Ý nghĩa |
|---|---|---|
| CPU tiến trình \`node\` | **102% trung bình, đỉnh 132%** | Vòng lặp sự kiện đơn luồng đã bão hoà |
| \`loadavg\` 1 phút toàn máy | **1,53 – 1,93** trên **16 nhân** | Máy mới dùng khoảng 12%, còn thừa rất nhiều |
| RSS đỉnh | 153 MB | Bộ nhớ không phải giới hạn |

Nghĩa là 15 trong 16 nhân nằm không trong khi dịch vụ đã gãy.

### Xác nhận bằng soak 11 phút

| Chỉ số | Giá trị |
|---|---|
| Max stable RPS | **997 req/s** giữ đều 10 phút (dao động dưới 0,2%) |
| Trần bộ nhớ | **161 MB RSS**, chững hẳn từ phút thứ 8 |
| Trần CPU | 100–109% của **một** nhân |

### Kỳ vọng
Chạy nhiều tiến trình qua \`cluster\` hoặc PM2 để dùng hết số nhân; đặt SQLite ở chế độ WAL để giảm chặn ghi.

![PERF-03](${RAW}/PERF-03.png)
`),
];

const tmp = os.tmpdir();
let created = 0;

for (const it of ISSUES) {
  const body = `> **Mức độ:** ${it.sev} · Phát hiện trong HW05 Performance Testing (MSSV 23127262)
> **SUT:** [ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut) · backend \`http://localhost:3000\`
${it.body}
---
*Ghi chú: ảnh transcript là bản render của lệnh chạy thật trên máy \`qt-ThinkBook-14-G5-IRH\`, có in kèm lệnh gốc để chạy lại kiểm chứng. Ảnh dashboard là ảnh chụp trang HTML do JMeter sinh ra.*`;

  const f = path.join(tmp, `issue-${it.id}.md`);
  fs.writeFileSync(f, body);

  const title = `[${it.id}] ${it.title}`;
  if (DRY) {
    console.log(`DRY  ${title}  (${body.length} ký tự)`);
    continue;
  }

  const labelArgs = it.labels.map((l) => `--label "${l}"`).join(" ");
  try {
    const url = execSync(
      `gh issue create --repo ${REPO} --title ${JSON.stringify(title)} --body-file ${JSON.stringify(f)} ${labelArgs}`,
      { encoding: "utf8" },
    ).trim();
    console.log(`✓ ${it.id}  ${url}`);
    created++;
  } catch (e) {
    console.error(`✗ ${it.id}: ${(e.stderr || e.message).toString().trim().split("\n")[0]}`);
  }
}

if (!DRY) console.log(`\nĐã tạo ${created}/${ISSUES.length} issue.`);
