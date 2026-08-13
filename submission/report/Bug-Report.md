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

| # | Tiêu đề | Mức | Bằng chứng đo được | Nguồn |
|---|---|---|---|---|
| BUG-01 | `?search=` nối chuỗi thẳng vào SQL — dấu nháy đơn làm vỡ câu lệnh, trả HTTP 500 kèm HTML | Nghiêm trọng | Từ khoá `O'Neill` gây **6 808 lỗi 500** trong lượt ramp và **480 lỗi** trong lượt Load. 100% lỗi của cả hai lượt đều đến từ đúng từ khoá này, không phải do tải | `server.js:144` |
| BUG-02 | Khoá tài khoản sau **2** lần sai chứ không phải 3 | Cao | 10 tài khoản thăm dò, mỗi tài khoản nhận đúng **2 phản hồi 401 rồi chuyển sang 403**. `login_attempts + 2` mỗi lần sai, ngưỡng khoá `>= 3` | `server.js:54,56` |
| BUG-03 | Đang bị khoá thì mật khẩu **đúng** vẫn trả 403 | Trung bình | Kiểm chứng bằng `curl`: sau 2 lần sai, đăng nhập đúng mật khẩu vẫn nhận `403 "Tài khoản đã bị khóa"`. Do kiểm tra khoá đặt **trước** khi so mật khẩu | `server.js:40` |
| BUG-04 | Khởi động lại backend là **xoá sạch toàn bộ CSDL** | Nghiêm trọng | `database.js` gọi `initDatabase()` ngay khi được import, hàm này mở đầu bằng 6 lệnh `DROP TABLE`. Mất 200 tài khoản + 147 sản phẩm mỗi lần restart | `database.js:15-20,117` |
| BUG-05 | `POST /api/checkout` không kiểm giỏ hàng, không kiểm tồn kho | Cao | Lượt Spike tạo **8 559 đơn hàng** trong 5 phút, trong đó có đơn của người dùng chưa từng thêm gì vào giỏ. Insert thẳng vào bảng `orders` | `server.js:301` |
| BUG-06 | `POST/PUT/DELETE /api/products` **không yêu cầu xác thực** | Nghiêm trọng | Tự tạo được 147 sản phẩm bằng `POST /api/products` mà không cần bất kỳ token nào (chính `scripts/seed-data.js` khai thác điều này) | `server.js:167,179,191` |
| BUG-07 | `GET /api/orders/:id` không xác thực — đọc được đơn của người khác (IDOR) | Cao | Route duy nhất trong nhóm orders thiếu `authenticateToken`, trong khi `my-orders` và `cancel` đều có | `server.js:344` |
| BUG-08 | `GET /api/products/:id` trả `price` kiểu **string** khi id chẵn, kiểu number khi id lẻ | Trung bình | `curl` id=1 → `30000000` (number); id=2 → `"28000000"` (string) | `server.js:162` |
| BUG-09 | `GET /api/products/:id` với id không tồn tại trả **200 `{}`** thay vì 404 | Thấp | `curl /api/products/9999` → `HTTP 200`, body `{}` | `server.js:161` |
| BUG-10 | Mật khẩu lưu và so sánh dạng **plaintext**, không băm | Nghiêm trọng | So sánh trực tiếp `user.password === password`; đọc bảng `users` thấy mật khẩu nguyên văn | `server.js:46` |

## B. Vấn đề hiệu năng (PERF)

| # | Tiêu đề | Bằng chứng đo được | Nguồn |
|---|---|---|---|
| PERF-01 | Giỏ hàng nằm trong RAM và **không bao giờ được dọn** | `userCarts = {}` chỉ ghi thêm, không có đường xoá. Lượt Spike thêm 12 767 mục vào giỏ; RSS backend đi từ **75 MB → 103,6 MB** và sau khi tải rút đi chỉ về **92–94 MB**, không trở lại mốc ban đầu | `server.js:14,293` |
| PERF-02 | `/api/login` sập độ trễ khi vượt ~1 626 người dùng đồng thời | p95 nhảy từ **3 ms** (250 luồng) → **10 ms** (800 luồng) → **1 671 ms** (2 000 luồng). Throughput đạt đỉnh **2 681 req/s** rồi *giảm* xuống 2 443 req/s dù tải tiếp tục tăng — dấu hiệu kinh điển của quá tải | `stress-20260813T003655Z.jtl` |
| PERF-03 | Toàn hệ thống nghẽn ở **một nhân CPU** vì Node đơn luồng | Tại điểm gãy: tiến trình `node` chiếm **102% CPU trung bình, đỉnh 132%**, trong khi `loadavg` toàn máy chỉ **1,53–1,93 trên 16 nhân** (≈12%). Máy còn thừa rất nhiều, nút thắt là tiến trình | `evidence/monitor/stress-*-resource.csv` |

---

## Trạng thái đồng bộ với GitHub Issues

*(R6 — số bug trong Markdown phải khớp số issue trên GitHub, mỗi issue kèm screenshot)*

| Việc | Trạng thái |
|---|---|
| Bảng bug trong Markdown | ✅ 10 BUG + 3 PERF |
| Tạo GitHub Issue tương ứng | ⬜ **chưa làm** |
| Đính screenshot vào từng issue | ⬜ **chưa làm** — screenshot thuộc phần sinh viên tự chụp |

Screenshot cần chụp cho từng issue: cửa sổ terminal đang chạy `curl` tái hiện lỗi, hoặc bảng
Statistics trong HTML dashboard tại chỗ có tỉ lệ lỗi.
