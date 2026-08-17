# Bug Report — HW05 Performance Testing

*(HW05 mục 6:96 — "Log any genuine bugs or performance issues... on your GitHub Issues page with screenshots")*

**SUT:** EShop — `https://github.com/ttbhanh/eshop-sut`
**Sinh viên:** Lý Quốc Thạnh — 23127262
**Repo bài làm:** `https://github.com/dinosauce-285/HW05-Software-Testing`

Đề phân biệt hai loại và chỉ bắt buộc loại thứ nhất — *"Logging performance issues such as high
latency or elevated error rate is encouraged but not penalised if absent"*. Bảng dưới tách bạch:

- **BUG** — lỗi chức năng / bảo mật, hệ thống làm sai việc của nó
- **PERF** — vấn đề hiệu năng, hệ thống làm đúng việc nhưng không chịu nổi tải

Mọi con số đều trích được từ `.jtl` thô bằng lệnh (R11), cột cuối ghi rõ file nguồn.

---

## A. Lỗi chức năng & bảo mật (BUG)

| # | Tiêu đề | Mức | Bằng chứng đo được | Nguồn | Issue |
|---|---|---|---|---|---|
| BUG-01 | `?search=` nối chuỗi thẳng vào SQL — dấu nháy đơn làm vỡ câu lệnh, trả HTTP 500 kèm HTML | Nghiêm trọng | Từ khoá `O'Neill` gây **6 808 lỗi 500** trong lượt ramp và **480 lỗi** trong lượt Load. 100% lỗi của cả hai lượt đều đến từ đúng từ khoá này, không phải do tải | `server.js:144` | [#1](https://github.com/dinosauce-285/HW05-Software-Testing/issues/1) |
| BUG-02 | Khoá tài khoản sau **2** lần sai chứ không phải 3 | Cao | 10 tài khoản thăm dò, mỗi tài khoản nhận đúng **2 phản hồi 401 rồi chuyển sang 403**. `login_attempts + 2` mỗi lần sai, ngưỡng khoá `>= 3` | `server.js:54,56` | [#2](https://github.com/dinosauce-285/HW05-Software-Testing/issues/2) |
| BUG-03 | Đang bị khoá thì mật khẩu **đúng** vẫn trả 403 | Trung bình | Kiểm chứng bằng `curl`: sau 2 lần sai, đăng nhập đúng mật khẩu vẫn nhận `403 "Tài khoản đã bị khóa"`. Do kiểm tra khoá đặt **trước** khi so mật khẩu | `server.js:40` | [#3](https://github.com/dinosauce-285/HW05-Software-Testing/issues/3) |
| BUG-04 | Khởi động lại backend là **xoá sạch toàn bộ CSDL** | Nghiêm trọng | `database.js` gọi `initDatabase()` ngay khi được import, hàm này mở đầu bằng 6 lệnh `DROP TABLE`. Mất 200 tài khoản + 147 sản phẩm mỗi lần restart | `database.js:15-20,117` | [#4](https://github.com/dinosauce-285/HW05-Software-Testing/issues/4) |
| BUG-05 | `POST /api/checkout` không kiểm giỏ hàng, không kiểm tồn kho | Cao | Lượt Spike tạo **8 559 đơn hàng** trong 5 phút, trong đó có đơn của người dùng chưa từng thêm gì vào giỏ. Insert thẳng vào bảng `orders` | `server.js:301` | [#5](https://github.com/dinosauce-285/HW05-Software-Testing/issues/5) |
| BUG-06 | `POST/PUT/DELETE /api/products` **không yêu cầu xác thực** | Nghiêm trọng | Tự tạo được 147 sản phẩm bằng `POST /api/products` mà không cần bất kỳ token nào (chính `scripts/seed-data.js` khai thác điều này) | `server.js:167,179,191` | [#6](https://github.com/dinosauce-285/HW05-Software-Testing/issues/6) |
| BUG-07 | `GET /api/orders/:id` không xác thực — đọc được đơn của người khác (IDOR) | Cao | Route duy nhất trong nhóm orders thiếu `authenticateToken`, trong khi `my-orders` và `cancel` đều có | `server.js:344` | [#7](https://github.com/dinosauce-285/HW05-Software-Testing/issues/7) |
| BUG-08 | `GET /api/products/:id` trả `price` kiểu **string** khi id chẵn, kiểu number khi id lẻ | Trung bình | `curl` id=1 → `30000000` (number); id=2 → `"28000000"` (string) | `server.js:162` | [#8](https://github.com/dinosauce-285/HW05-Software-Testing/issues/8) |
| BUG-09 | `GET /api/products/:id` với id không tồn tại trả **200 `{}`** thay vì 404 | Thấp | `curl /api/products/9999` → `HTTP 200`, body `{}` | `server.js:161` | [#9](https://github.com/dinosauce-285/HW05-Software-Testing/issues/9) |
| BUG-10 | Mật khẩu lưu và so sánh dạng **plaintext**, không băm | Nghiêm trọng | So sánh trực tiếp `user.password === password`; đọc bảng `users` thấy mật khẩu nguyên văn | `server.js:46` | [#10](https://github.com/dinosauce-285/HW05-Software-Testing/issues/10) |

## B. Vấn đề hiệu năng (PERF)

| # | Tiêu đề | Bằng chứng đo được | Nguồn | Issue |
|---|---|---|---|---|
| PERF-01 | Giỏ hàng nằm trong RAM và **không bao giờ được dọn** | `userCarts = {}` chỉ ghi thêm, không có đường xoá. Lượt Spike thêm 8 767 mục vào giỏ; RSS backend đi từ **75,0 MB → đỉnh 119,7 MB**, sau khi tải rút chỉ về **94,0 MB** — **19,0 MB không bao giờ nhả lại** | `server.js:14,293` | [#11](https://github.com/dinosauce-285/HW05-Software-Testing/issues/11) |
| PERF-02 | `/api/login` sập độ trễ khi vượt **1 800** người dùng đồng thời | Ba chỉ báo vỡ cùng lúc tại **1 800 luồng**: p95 nhảy 399 → **1 228 ms**, lỗi 0,63% → 1,94%, và `Connect` p95 nhảy **1 ms → 1 020 ms** (hàng đợi accept tràn). Throughput đạt đỉnh **2 681 req/s** rồi *giảm* xuống 2 443 req/s dù tải tiếp tục tăng. Mọi phân vị tính từ `.jtl` thô, không lấy từ dashboard | `stress-20260813T003655Z.jtl` | [#12](https://github.com/dinosauce-285/HW05-Software-Testing/issues/12) |
| PERF-03 | Toàn hệ thống nghẽn ở **một nhân CPU** vì Node đơn luồng | Tại điểm gãy: tiến trình `node` chiếm **102% CPU trung bình, đỉnh 132%**, trong khi `loadavg` toàn máy chỉ **1,53–1,93 trên 16 nhân** (≈12%). Máy còn thừa rất nhiều, nút thắt là tiến trình | `evidence/monitor/stress-*-resource.csv` | [#13](https://github.com/dinosauce-285/HW05-Software-Testing/issues/13) |

---

## Trạng thái đồng bộ với GitHub Issues

*(R6 — số bug trong Markdown phải khớp số issue trên GitHub, mỗi issue kèm screenshot)*

| Việc | Trạng thái |
|---|---|
| Bảng bug trong Markdown | ✅ **10 BUG + 3 PERF = 13** |
| GitHub Issue tương ứng | ✅ **13 issue** — `#1` … `#13` |
| Ảnh bằng chứng đính kèm | ✅ 14 ảnh trong `evidence/bugs/` |

Số bug trong Markdown **khớp đúng** số issue trên GitHub: 13 = 13.

**Hai loại ảnh bằng chứng, ghi rõ trong chân mỗi ảnh để không gây hiểu nhầm:**

| Loại | Cách tạo | Dùng cho |
|---|---|---|
| Transcript render | Chạy lệnh `curl` thật vào backend (`scripts/capture-bug-evidence.js`), lấy nguyên văn output rồi render (`scripts/render-bug-evidence.js`). **Không phải** ảnh chụp cửa sổ terminal — mỗi ảnh in kèm lệnh gốc, hostname và thời điểm chạy để kiểm chứng lại được | 10 lỗi chức năng |
| Ảnh chụp dashboard | Mở trang HTML do JMeter sinh bằng Chromium qua Playwright rồi chụp màn hình | PERF-02, PERF-03, BUG-01 |
| Biểu đồ tài nguyên | Vẽ từ đúng file CSV đo tài nguyên, không làm mượt, không nội suy (`scripts/render-perf-chart.js`) | PERF-01 |
