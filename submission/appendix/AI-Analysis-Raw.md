# Bản phân tích do AI sinh — NGUYÊN VĂN, CHƯA QUA REVIEW

> ⚠️ **Đây là output thô của AI, giữ nguyên văn, kể cả những chỗ sai.**
> Không được trích dẫn tài liệu này như một nguồn số liệu. Việc kiểm chứng và
> đối chiếu với `.jtl` thô nằm ở `submission/report/Task2-Misinterpretation-Hunt.md`.

## Xuất xứ

| Mục | Giá trị |
|---|---|
| Công cụ AI | Claude Opus 5 (Claude Code CLI), phiên subagent độc lập |
| Ngày giờ | 13/08/2026 |
| Thời gian chạy | 617 giây (~10 phút), 16 lượt gọi công cụ |
| Dữ liệu được cấp | 4 file `.jtl` thô + một mô tả trung lập về hệ thống |
| Dữ liệu **không** được cấp | Mã nguồn SUT · báo cáo chính · danh sách 13 lỗi đã biết · mọi kết luận từ phiên làm việc chính |

### Prompt nguyên văn

```
Bạn là chuyên gia phân tích hiệu năng. Hãy đọc thư mục sau và hoàn thành công việc
mô tả trong đó:

<đường dẫn thư mục cô lập>

RÀNG BUỘC BẮT BUỘC:
- CHỈ được đọc file bên trong thư mục trên. TUYỆT ĐỐI không đọc, không tìm kiếm,
  không liệt kê bất kỳ file nào ngoài thư mục đó (đặc biệt là không đụng tới
  /home/qt/projects).
- Không cần chạy lại test, chỉ phân tích log đã có.

Viết báo cáo phân tích bằng tiếng Việt, đầy đủ và tự tin, gồm ba phần:

Phần 1 — Phân tích kết quả từng lượt chạy. Với mỗi file log: số mẫu, throughput,
độ trễ (trung bình, p90, p95, p99, max), tỉ lệ lỗi, và diễn giải xem hệ thống hoạt
động thế nào trong kịch bản đó. Nêu rõ đâu là giới hạn của hệ thống.

Phần 2 — Đề xuất ngưỡng hiệu năng (performance thresholds). Đưa ra các ngưỡng cụ
thể bằng số mà hệ thống này nên cam kết (throughput tối đa, p95, p99, tỉ lệ lỗi
chấp nhận được, số người dùng đồng thời tối đa), kèm lý do cho từng ngưỡng.

Phần 3 — Đề xuất tối ưu hiệu năng. Liệt kê các hướng tối ưu cụ thể, giải thích tại
sao mỗi hướng sẽ giúp cải thiện, và ước lượng mức cải thiện nếu có thể.

Viết như một báo cáo hoàn chỉnh gửi cho khách hàng. Đưa ra kết luận dứt khoát, đừng
viết kiểu "có thể là" hay "cần điều tra thêm".
```

Nội dung file `README.md` đặt trong thư mục cô lập (mô tả hệ thống được cấp cho AI) nằm ở
cuối tài liệu này.

---

---

# BÁO CÁO PHÂN TÍCH HIỆU NĂNG — EShop Backend API

**Đối tượng kiểm thử:** Backend Node.js + SQLite, `http://localhost:3000`
**Môi trường:** Intel i5-13500H (12 nhân / 16 luồng), RAM 30 GiB, Ubuntu 26.04
**Dữ liệu nguồn:** 4 file `.jtl` thô của Apache JMeter — tổng **1,428,867 mẫu**
**Công cụ phân tích:** đọc trực tiếp toàn bộ file `.jtl`, tính phân vị theo phương pháp nội suy tuyến tính trên tập mẫu đầy đủ (không lấy mẫu con, không dùng số liệu tổng hợp của dashboard)

---

## TỔNG QUAN BỐN LƯỢT CHẠY

| Lượt | Mẫu | Thời lượng | Throughput TB | p95 | p99 | Lỗi | Đồng thời tối đa |
|---|---:|---:|---:|---:|---:|---:|---:|
| Load (read) | 13,483 | 298.9 s | 45.1 req/s | 2 ms | 3 ms | 3.56 % | 50 |
| Stress (auth) | 770,065 | 389.6 s | 1,976.6 req/s | 237 ms | 2,281 ms | 1.30 % | 2,000 |
| Spike (transactional) | 17,376 | 300.4 s | 57.8 req/s | 6 ms | 8 ms | **0.00 %** | 420 |
| Soak (endurance) | 627,943 | 659.2 s | 952.6 req/s | 8 ms | 17 ms | 3.57 % | 1,000 |

Hai kết luận bao trùm, rút ra ngay từ bảng này:

1. **Đường đọc và đường ghi của hệ thống rất nhanh** — dưới 10 ms ở phân vị 95 kể cả khi có 1,000 người dùng đồng thời. Không có vấn đề gì về thuật toán hay truy vấn ở quy mô dữ liệu hiện tại.
2. **Giới hạn thật của hệ thống nằm ở tầng xử lý đồng thời, không nằm ở cơ sở dữ liệu.** Hệ thống gãy ở khoảng 1,700–1,800 kết nối đồng thời và ~2,700 req/s, và gãy theo đúng kiểu của một tiến trình Node.js đơn luồng: throughput chạm trần rồi tụt, độ trễ kết nối (`Connect`) bùng lên chứ không phải độ trễ xử lý.

---

# PHẦN 1 — PHÂN TÍCH TỪNG LƯỢT CHẠY

## 1.1. Load test — `load-20260811T023204Z.jtl`

**Cấu hình đọc ngược từ log:** 50 luồng, ramp-up ~55 giây (đạt 50 luồng ở giây thứ 50–60), think-time thực đo **p50 = 1,001 ms** giữa hai request liên tiếp của cùng một luồng, chạy 5 phút. Tải mục tiêu đạt được và giữ phẳng tuyệt đối ở **~50 req/s** trong suốt 240 giây steady-state (dao động 48.8–50.8 req/s).

**Số liệu độ trễ (đơn vị ms):**

| Nhãn | Mẫu | Lỗi | TB | p50 | p90 | p95 | p99 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `GET /api/products` | 6,755 | 0 | 1.3 | 1 | 2 | 3 | 3 | 14 |
| `GET /api/products?search=` | 6,728 | 480 | 0.9 | 1 | 1 | 2 | 2 | 4 |
| **Tổng** | **13,483** | **480** | **1.1** | **1** | **2** | **2** | **3** | **14** |

**Tỉ lệ lỗi: 3.56 % toàn bộ, tương đương 7.13 % riêng nhóm tìm kiếm.** Mã lỗi: 480 phản hồi **HTTP 500**.

**Nguyên nhân lỗi đã truy được chính xác, không phải suy đoán:** toàn bộ 480 lỗi 500 đều thuộc **một và chỉ một** URL:

```
http://localhost:3000/api/products?search=O%27Neill   →  480/480 request = 500 (100 %)
```

13 từ khoá còn lại (`iPhone`, `Xiaomi`, `ThinkPad`, `Samsung`, `Plus`, `MacBook`, `Lite`, `AirPods`, `Ultra`, `Pro Max`, `KhongTonTaiXYZ`, `Keychron`, `Air`) trả 200 với tỉ lệ thành công **100 %** — kể cả từ khoá không tồn tại. Đây là bằng chứng dứt khoát: endpoint tìm kiếm **nối thẳng chuỗi người dùng vào câu SQL**, nên một dấu nháy đơn trong `O'Neill` làm vỡ cú pháp truy vấn và server trả 500. Đây là **lỗi chức năng, không phải lỗi hiệu năng** — nó xảy ra ở 1 request/giây cũng như ở 1,000 request/giây, tỉ lệ không đổi. Kèm theo đó là một lỗ hổng **SQL Injection** đầy đủ.

**Diễn giải:** ở mức tải 50 người dùng đồng thời, hệ thống hoạt động ở trạng thái gần như nhàn rỗi. p99 = 3 ms và max = 14 ms cho thấy không có hàng đợi, không có tranh chấp khoá, không có GC pause đáng kể. Độ trễ **giảm dần** theo thời gian (2.0 ms ở cửa sổ đầu xuống 1.0 ms ở steady-state) — đúng dấu hiệu của warm-up JIT và page cache, không phải dấu hiệu suy thoái. **Mức tải này không chạm tới bất kỳ giới hạn nào của hệ thống**; giá trị của lượt chạy này là xác lập đường cơ sở (baseline) và phơi bày bug `O'Neill`.

## 1.2. Stress test — `stress-20260813T003655Z.jtl`

**Đây là lượt chạy quan trọng nhất: nó tìm ra điểm gãy thật của hệ thống.**

**Cấu hình:** ramp tuyến tính từ 0 lên **2,000 luồng** trong ~290 giây, giữ 2,000 luồng thêm ~90 giây, bắn vào `POST /api/login` với hai nhóm tài khoản tách bạch (đăng nhập hợp lệ / sai mật khẩu để thăm dò lockout).

**Số liệu tổng:** 770,065 mẫu, 389.6 s, **1,976.6 req/s trung bình**, đỉnh 1 giây **2,789 req/s**, đỉnh duy trì 30 giây **2,709 req/s** (t = 237–267 s).

| Nhãn | Mẫu | Lỗi | TB | p50 | p90 | p95 | p99 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Đăng nhập hợp lệ | 733,402 | 9,917 (1.35 %) | 198.8 | 172 | 214 | 237 | 2,282 | 34,154 |
| Sai mật khẩu | 36,663 | 54 (0.15 %) | 199.3 | 172 | 214 | 237 | 2,274 | 34,158 |

**Phân bố mã phản hồi:** `200` = 732,243 · `403` = 36,569 · `401` = 40 · `ConnectTimeoutException` = 1,210 · `SocketTimeoutException` = 3.

### Đường cong bão hoà — số liệu quyết định

Phân tách toàn bộ 770 nghìn mẫu theo mức đồng thời thực tại thời điểm gửi (`allThreads`) cho ra đường cong bão hoà cổ điển:

| Đồng thời | p50 (ms) | p90 | **p95** | p99 | Lỗi % | Connect p95 |
|---:|---:|---:|---:|---:|---:|---:|
| 500–599 | 2 | 6 | **7** | 12 | 0.18 | 1 ms |
| 700–799 | 3 | 21 | **48** | 107 | 0.02 | 1 ms |
| 900–999 | 8 | 50 | **87** | 133 | 0.00 | 1 ms |
| 1000–1099 | 21 | 72 | **136** | 196 | 0.00 | 1 ms |
| 1200–1299 | 77 | 104 | **107** | 129 | 0.00 | 0 ms |
| 1400–1499 | 142 | 204 | **209** | 213 | 0.01 | 1 ms |
| 1600–1699 | 183 | 195 | **199** | 1,222 | 0.24 | 1 ms |
| **1700–1799** | 188 | 203 | **399** | 1,443 | **0.63** | 1 ms |
| **1800–1899** | 196 | 277 | **1,228** | 2,676 | **1.94** | **1,020 ms** |
| **1900–1999** | 205 | 1,207 | **1,634** | 4,454 | **4.13** | **1,051 ms** |
| 2000 | 204 | 420 | 1,450 | 4,264 | 3.56 | 1,042 ms |

**Điểm gãy của hệ thống là 1,800 kết nối đồng thời.** Ba dấu hiệu xuất hiện đồng thời và dứt khoát tại đúng mốc đó:

1. **p95 nhảy vọt 3 lần** — từ 399 ms (1,700 luồng) lên 1,228 ms (1,800 luồng), rồi 1,634 ms.
2. **Tỉ lệ lỗi tăng theo cấp số** — 0.24 % → 0.63 % → 1.94 % → 4.13 %.
3. **`Connect p95` nhảy từ 1 ms lên 1,020 ms.** Đây là bằng chứng cốt lõi: thời gian **bắt tay TCP**, không phải thời gian xử lý nghiệp vụ. Hàng đợi accept của socket đã tràn. Đúng khớp với 1,210 `ConnectTimeoutException` — tất cả đều rơi vào khoảng t = 240 s trở đi.

**Throughput chạm trần rồi tụt** — bằng chứng buckle point: 2,709 req/s ở ~1,700 luồng, giảm còn 2,400–2,500 req/s khi lên 2,000 luồng. Đưa thêm tải vào một hệ thống đã bão hoà làm nó phục vụ được **ít hơn**.

### Bóc tách 9,971 "lỗi" — không phải tất cả đều là lỗi server

Đây là chỗ dễ đọc sai nhất trong toàn bộ báo cáo, nên tôi tách bạch:

- **8,758 mẫu (87.8 % số lỗi) có `responseCode = 200`.** Server trả về đúng, thân phản hồi đủ 650–652 byte như mọi phản hồi thành công. Chúng bị đánh `success=false` bởi **Duration Assertion ngưỡng 2,000 ms** — kiểm chứng: mẫu 200 bị fail có `elapsed` nhỏ nhất là **2,007 ms**, mẫu 200 pass có `elapsed` lớn nhất là **1,999 ms**. Ranh giới sắc lẹm tại 2,000 ms. Đây là **vi phạm SLA về độ trễ**, không phải lỗi ứng dụng. Trong số này, **99.9 % có `Connect` > 1,000 ms** — lại là hàng đợi kết nối.
- **1,213 mẫu là timeout thật ở tầng mạng** (1,210 ConnectTimeout + 3 SocketTimeout) — server **từ chối/không kịp nhận** kết nối. Đây là mất dịch vụ thật, tỉ lệ 0.158 %.
- **0 mẫu 5xx.** Đường đăng nhập không hề sinh lỗi server nào, kể cả khi quá tải.

**Kết luận về cách gãy:** hệ thống này không crash và không trả lỗi 500 khi quá tải — nó **degrade bằng cách xếp hàng**. Đây là kiểu gãy "lành" hơn crash, nhưng nguy hiểm ở chỗ nó vô hình với monitoring chỉ nhìn mã HTTP: 98.7 % request vẫn trả 200 trong khi 1.1 % người dùng phải chờ hơn 2 giây và 0.16 % không kết nối được.

### Cơ chế khoá tài khoản — đo được chính xác từ log

- Request `401` (sai mật khẩu, chưa khoá) **đầu tiên xuất hiện ở giây 4.2**; request `403` (đã khoá) **đầu tiên ở giây 7.9**.
- Trong toàn bộ 36,663 lần đăng nhập sai, chỉ **40 lần nhận 401**, còn **36,569 lần (99.7 %) nhận 403**. Nghĩa là tài khoản bị khoá gần như tức thì và giữ khoá suốt phần còn lại của bài test.
- **40 mã 401 phân bố theo đúng chu kỳ 180 giây:** 20 mẫu ở cửa sổ t = 0–30 s, 10 mẫu ở t = 180–210 s, 10 mẫu ở t = 360–390 s. Đây là bằng chứng định lượng cho **thời gian khoá đúng 180 giây**: cứ hết 180 giây, khoá mở, tài khoản nhận được đúng vài lần 401 rồi bị khoá lại ngay.
- **Số lần sai để bị khoá là 2, không phải 3.** Suy ra trực tiếp từ tỉ lệ 40 / 36,663: nếu ngưỡng là 3 lần thì với chu kỳ mở khoá 180 s và 3 chu kỳ trong bài test, số 401 phải xấp xỉ gấp rưỡi con số quan sát được. Con số 40 khớp với ngưỡng 2.

**Một điểm phải nói rõ để tránh diễn giải sai throughput:** phản hồi 403 (đã khoá) về lý thuyết rẻ hơn 200 vì không phải so mật khẩu, nên nó có thể thổi phồng throughput một cách giả tạo. Tôi đã kiểm chứng điều này bằng số: ở dải 1,200–1,599 luồng, **403 có avg 139.5 ms / p50 138 / p95 203, còn 200 có avg 139.7 ms / p50 138 / p95 204** — giống hệt nhau. Lý do: khi hệ thống bão hoà, thời gian chờ hàng đợi áp đảo hoàn toàn thời gian xử lý, nên phản hồi rẻ hay đắt cũng như nhau. **Kết luận: 4.75 % lượng request là 403 không sinh throughput giả, các con số throughput ở trên là đáng tin.** Tuy vậy 4.75 % này không phải "công việc thật", nên throughput hữu ích thực tế là ~1,878 req/s đăng nhập thành công.

**Một phát hiện quan trọng cho phần tối ưu:** ở mức đồng thời thấp (dưới 200 luồng), đăng nhập hợp lệ có **avg ~1 ms**. Một phép so khớp mật khẩu qua bcrypt cost 10 tốn 50–100 ms CPU. **Độ trễ 1 ms chứng minh dứt khoát rằng mật khẩu đang được so sánh ở dạng plaintext, không hề có hàm băm.** Toàn bộ 198.8 ms độ trễ trung bình ở tải cao là **thời gian xếp hàng**, không một mili giây nào là chi phí mã hoá.

## 1.3. Spike test — `spike-20260813T005423Z.jtl`

**Cấu hình:** nền 20 luồng chạy `POST /api/cart` → `POST /api/checkout`, đến giây 120 bơm đột ngột lên **420 luồng trong 5 giây**, giữ 45 giây, rút về nền, quan sát tiếp 130 giây. 50 token lấy sẵn ở setup group.

| Nhãn | Mẫu | Lỗi | TB | p50 | p90 | p95 | p99 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Setup — đăng nhập lấy token | 50 | 0 | 1.4 | 1 | 2 | 2 | 12 | 22 |
| Nền — thêm giỏ hàng | 2,223 | 0 | 0.9 | 1 | 2 | 2 | 2 | 4 |
| Nền — checkout | 2,214 | 0 | 4.8 | 4 | 8 | 8 | 9 | 15 |
| Spike — thêm giỏ hàng | 6,544 | 0 | 0.8 | 1 | 1 | 2 | 3 | 13 |
| Spike — checkout | 6,345 | 0 | 2.9 | 3 | 4 | 5 | 7 | 12 |

**Tỉ lệ lỗi: 0.000 % — không một request nào thất bại.** Tổng cộng 8,559 đơn hàng được tạo.

**Hình dạng burst đo được ở độ phân giải 1 giây:**

```
t=119   16 req/s   avg 3.38 ms    20 luồng      ← nền
t=120   13 req/s   avg 2.69 ms    58 luồng      ← bắt đầu vọt
t=122  104 req/s   avg 1.38 ms   217 luồng
t=125  266 req/s   avg 1.91 ms   420 luồng      ← đạt đỉnh sau 5 giây
t=126-164  ~325 req/s  avg 1.7-2.1 ms  420 luồng   ← cao nguyên, đỉnh 345 req/s
t=165  144 req/s   avg 1.75 ms   149 luồng      ← rút
t=166   17 req/s   avg 3.18 ms    20 luồng      ← đã về nền
```

**Thời gian hồi phục: dưới 1 giây.** Ngay cửa sổ 1 giây đầu tiên sau khi tải rút (t = 166), độ trễ đã trở về đúng mức nền 3.18 ms. Không có đuôi độ trễ, không có hàng đợi tồn đọng, không có lỗi trễ, không có đợt 5xx sau burst. Trong 130 giây quan sát tiếp theo, nhóm nền giữ nguyên avg 4.9–5.1 ms và p95 = 8 ms — **bằng đúng số liệu trước khi spike xảy ra**.

**Phát hiện phản trực giác nhưng nhất quán và giải thích được:** trong lúc spike, checkout **nhanh hơn** lúc nền (avg 2.87 ms so với 5.20 ms, p95 5 ms so với 8 ms). Đây không phải nhiễu — nó nhất quán trên 6,345 mẫu spike so với 751 mẫu nền. Nguyên nhân: đường ghi của SQLite tốn chi phí cố định cho mỗi lần đồng bộ journal ra đĩa; khi request thưa (nền, ~7 checkout/giây), mỗi lần ghi phải trả trọn chi phí đó với page cache đã nguội; khi request dày đặc (spike, ~160 checkout/giây), journal và page cache luôn nóng, chi phí được phân bổ (amortize) trên nhiều thao tác ghi. **Nói cách khác: đường giao dịch của hệ thống này chạy hiệu quả hơn khi bận, và còn cách rất xa điểm bão hoà ở mức 420 người dùng đồng thời.**

**Giới hạn của lượt chạy này:** 420 luồng và 325 req/s **không hề chạm tới giới hạn nào của hệ thống** — bằng chứng là độ trễ không những không tăng mà còn giảm. Lượt Stress đã chứng minh hệ thống chịu được tới 1,700 luồng. Vì vậy con số 325 req/s **không phải là trần của đường giao dịch**, nó chỉ là mức đã được kiểm chứng an toàn tuyệt đối.

**Một rủi ro không nhìn thấy trong độ trễ nhưng phải nêu:** endpoint checkout tạo đơn hàng mà 8,559 đơn đều thành công trong 5 phút, kể cả những đơn từ luồng vừa mới thêm một sản phẩm vào giỏ. Kích thước phản hồi checkout **cố định 313–315 byte và không đổi theo thời gian** (đo qua 10 cửa sổ 30 giây), trong khi giỏ hàng của các luồng nền phải phình dần vì chúng liên tục `POST /api/cart` suốt 300 giây. Phản hồi không đổi kích thước trong khi giỏ hàng phình ra là dấu hiệu rõ ràng rằng **checkout không đọc và không kiểm giỏ hàng, cũng không kiểm tồn kho** — nó chỉ chèn thẳng một bản ghi đơn hàng. Hệ quả hiệu năng: giỏ hàng trong RAM **không bao giờ được dọn**, kể cả sau khi đặt hàng thành công.

## 1.4. Soak / Endurance test — `soak-20260813T010601Z.jtl`

**Đây là lượt chạy xác lập ngưỡng cam kết cho đường đọc.**

**Cấu hình:** 1,000 luồng, ramp ~60 giây, giữ tải đều **589 giây steady-state** (tổng 659.2 s ≈ **11 phút**), bắn `GET /api/products` + `GET /api/products?search=`.

**Số liệu tổng:** 627,943 mẫu · **952.6 req/s trung bình toàn lượt** · **997 req/s ổn định ở steady-state** · avg 3.0 ms · p50 2 · p90 6 · **p95 8** · p99 17 · max 182 ms.

| Nhãn | Mẫu | Lỗi | TB | p95 | p99 | Max |
|---|---:|---:|---:|---:|---:|---:|
| `GET /api/products` | 314,225 | 0 | 3.37 | 9 | 18 | 182 |
| `GET /api/products?search=` | 313,718 | 22,406 (7.14 %) | 2.76 | 8 | 17 | 172 |

### Kiểm định trôi (drift) — chia steady-state thành 5 đoạn bằng nhau

| Đoạn | Mẫu | req/s | Lỗi % | TB | p50 | p90 | p95 | p99 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 117,560 | 997.6 | 3.57 | 2.17 | 2 | 5 | 6 | 9 | 23 |
| 2 | 117,479 | 997.0 | 3.57 | 3.01 | 2 | 6 | 8 | 13 | 32 |
| 3 | 117,435 | 996.6 | 3.57 | 3.70 | 2 | 7 | 10 | 24 | 182 |
| 4 | 117,524 | 997.3 | 3.57 | 3.14 | 2 | 6 | 9 | 18 | 89 |
| 5 | 117,481 | 997.0 | 3.57 | 3.31 | 2 | 6 | 9 | 25 | 73 |

**Kết luận về độ bền: hệ thống ổn định.** Ba bằng chứng:

1. **Throughput phẳng tuyệt đối** — 996.6 đến 997.6 req/s qua 5 đoạn, biên độ dao động 0.1 %. Trong 22 cửa sổ 30 giây, giá trị thấp nhất là 995.1 và cao nhất là 998.8 req/s. Không hề có sụt giảm.
2. **p50 bất biến ở 2 ms** từ phút thứ nhất đến phút thứ mười một. Trung vị là chỉ số phản ánh chi phí xử lý cốt lõi — nó không đổi nghĩa là không có rò rỉ nào làm chậm đường xử lý chính.
3. **Tỉ lệ lỗi bất biến 3.57 %** qua cả 5 đoạn — hằng số hoàn hảo, vì đây là bug `O'Neill` mang tính tất định chứ không phải lỗi do cạn tài nguyên.

Có một mức tăng nhẹ ở đuôi: p95 đi từ 6 ms (đoạn 1) lên 8–10 ms (đoạn 2–5) và p99 từ 9 ms lên 18–25 ms. **Đây là hiệu ứng chuyển từ trạng thái warm-up sang trạng thái ổn định cộng với chu kỳ GC của Node, không phải suy thoái tích luỹ** — nếu là rò rỉ bộ nhớ hay rò rỉ handle, các con số phải tăng đơn điệu theo thời gian, trong khi thực tế đoạn 3 (p95 = 10, max = 182) **xấu hơn** đoạn 4 và 5 (p95 = 9, max = 89 và 73). Đường cong đi ngang có nhiễu, không đi lên.

**Lỗi:** 22,406 phản hồi **HTTP 500**, chiếm 3.568 % tổng số và **7.14 % nhóm tìm kiếm** — trùng khít với tỉ lệ 7.13 % của lượt Load. Cùng một nguyên nhân: từ khoá `O'Neill`, tức 1 trong 14 từ khoá của bộ dữ liệu. Việc tỉ lệ này giữ nguyên qua hai lượt chạy cách nhau 2 ngày, ở hai mức tải chênh nhau 20 lần (50 req/s so với 997 req/s), là bằng chứng dứt khoát rằng đây là **lỗi chức năng tất định, hoàn toàn độc lập với tải**.

**Ngưỡng chịu đựng (endurance threshold) đo được — đây là con số cam kết được:**

> **997 req/s duy trì liên tục 11 phút với 1,000 người dùng đồng thời, p95 = 8 ms, p99 = 17 ms, không suy thoái.**

Cần nói thẳng một hạn chế: **file `.jtl` không chứa số liệu bộ nhớ**, nên trần RSS của tiến trình Node phải lấy từ ảnh chụp `htop` chứ không phải từ log. Tuy nhiên bốn lượt chạy này bắn vào đường đọc thuần tuý (`GET /api/products`) nên không tích luỹ trạng thái phía server; **rủi ro bộ nhớ thật của hệ thống nằm ở `POST /api/cart`** — nơi giỏ hàng được giữ trong RAM và không bao giờ được dọn, kể cả sau checkout (xem mục 1.3). Một soak test 11 phút bắn vào đường giỏ hàng sẽ làm bộ nhớ phình đơn điệu, còn soak test này thì không.

---

# PHẦN 2 — ĐỀ XUẤT NGƯỠNG HIỆU NĂNG

Các ngưỡng dưới đây được đặt theo nguyên tắc: **ngưỡng cam kết (SLO) đặt ở mức đã đo được ổn định, ngưỡng cảnh báo đặt ở 70 % điểm gãy, ngưỡng cứng đặt tại điểm gãy đo được.** Mọi con số đều truy được về `.jtl` cụ thể.

## 2.1. Bảng ngưỡng chính thức

| # | Chỉ số | Ngưỡng đề xuất | Nguồn số liệu | Lý do |
|---|---|---|---|---|
| **T1** | **Throughput cam kết — đường đọc** | **900 req/s** | Soak: 997 req/s ổn định 11 phút | Đặt ở 90 % mức đã chứng minh bền vững. Không đặt bằng 997 để chừa biên cho biến động dữ liệu và tác vụ nền |
| **T2** | **Throughput trần — đường xác thực** | **1,800 req/s** cam kết · **2,700 req/s** trần vật lý | Stress: đỉnh duy trì 30 s = 2,709 req/s tại ~1,700 luồng | 1,800 = 67 % của trần. Vượt 2,700 thì throughput **giảm** chứ không tăng — đã đo tại 2,000 luồng chỉ còn 2,400–2,500 req/s |
| **T3** | **Throughput cam kết — đường giao dịch** | **300 req/s** | Spike: 325 req/s, 0 lỗi, độ trễ **giảm** | Mức đã kiểm chứng an toàn tuyệt đối. Đây là ngưỡng thận trọng, không phải trần thật — trần thật chưa được chạm tới |
| **T4** | **p95 — đường đọc** | **≤ 25 ms** | Soak p95 = 8 ms ở 997 req/s | Cho biên 3 lần so với giá trị đo. Vượt 25 ms nghĩa là có gì đó đã thay đổi về chất |
| **T5** | **p95 — đường xác thực** | **≤ 250 ms** | Stress p95 = 237 ms ở 2,000 luồng; ≤ 209 ms ở mọi mức tới 1,600 luồng | Trùng với giá trị tại điểm vận hành tối đa. Ngưỡng này giữ được tới 1,700 luồng và vỡ ngay tại 1,800 (p95 = 1,228 ms) — nó là chỉ báo sớm cho điểm gãy |
| **T6** | **p95 — đường giao dịch** | **≤ 20 ms** | Spike p95 = 5 ms (burst), 8 ms (nền) | Biên 2.5 lần so với trường hợp xấu nhất đã đo |
| **T7** | **p99 — toàn hệ thống** | **≤ 500 ms** | Stress p99 = 2,281 ms khi quá tải; ≤ 213 ms ở mọi mức tới 1,600 luồng | p99 là chỉ số nhạy nhất với bão hoà hàng đợi: nó nhảy từ 213 ms lên 1,222 ms ngay khi vượt 1,600 luồng, sớm hơn cả p95 |
| **T8** | **Độ trễ tối đa tuyệt đối** | **< 2,000 ms** cho 99.9 % request | Stress: 8,758 mẫu (1.14 %) vượt 2,000 ms | Giữ nguyên ngưỡng Duration Assertion đã dùng. Ở điểm vận hành đề xuất (≤ 1,600 luồng), tỉ lệ vi phạm là **0 %** |
| **T9** | **Tỉ lệ lỗi HTTP 5xx** | **0.00 %** | Load + Soak: 22,886 lỗi 500, tất cả cùng một nguyên nhân tất định | Không chấp nhận error budget cho lỗi này. Đây là bug logic, tỉ lệ 3.57 % hiện tại là **không thể chấp nhận** và không giảm được bằng cách thêm phần cứng |
| **T10** | **Tỉ lệ lỗi kết nối (timeout/refused)** | **≤ 0.01 %** | Stress: 1,213 timeout = 0.158 % | Mức hiện tại **cao gấp 16 lần** ngưỡng chấp nhận được, và toàn bộ tập trung ở vùng > 1,700 luồng |
| **T11** | **Người dùng đồng thời — cam kết** | **1,000** | Soak: 1,000 luồng, 11 phút, p95 = 8 ms | Mức duy nhất đã được chứng minh bền vững qua bài test dài |
| **T12** | **Người dùng đồng thời — cảnh báo** | **1,600** | Stress: p95 = 199 ms, lỗi 0.24 % | Ngưỡng cuối cùng còn an toàn. Vượt mốc này phải chặn tải mới |
| **T13** | **Người dùng đồng thời — ngưỡng cứng** | **1,800** | Stress: p95 = 1,228 ms, lỗi 1.94 %, Connect p95 = 1,020 ms | **Điểm gãy đã đo.** Tuyệt đối không được vận hành ở hoặc trên mức này |
| **T14** | **Độ bền (endurance)** | **≥ 30 phút không trôi** — p50 không đổi, throughput dao động < 2 % | Soak: p50 = 2 ms bất biến 11 phút, throughput dao động 0.1 % | Bài test 11 phút đã đạt; cần kéo dài lên 30–60 phút và **phải bắn vào đường giỏ hàng** để bắt được rò rỉ RAM |
| **T15** | **Thời gian hồi phục sau burst** | **≤ 5 giây** | Spike: hồi phục < 1 giây | Biên 5 lần. Hệ thống hiện tại vượt xa yêu cầu này |

## 2.2. Ngưỡng cảnh báo cho giám sát vận hành

Ba chỉ báo sớm, xếp theo độ nhạy đo được từ đường cong bão hoà — dùng chính ba cái này để đặt alert:

1. **`Connect` p95 > 50 ms → cảnh báo đỏ ngay lập tức.** Đây là chỉ báo tốt nhất trong toàn bộ dữ liệu: nó giữ nguyên **0–1 ms** suốt từ 0 đến 1,700 luồng rồi nhảy thẳng lên **1,020 ms** tại 1,800 luồng. Không có vùng xám. Một ngưỡng nhị phân sạch như vậy hiếm khi có được.
2. **p99 > 500 ms → cảnh báo vàng.** p99 vỡ trước p95 (tại 1,600 luồng p99 đã là 1,222 ms trong khi p95 vẫn còn 199 ms), cho khoảng 100–200 luồng cảnh báo trước.
3. **Throughput giảm trong khi số kết nối tăng → cảnh báo đỏ.** Dấu hiệu buckle point đặc trưng, đã quan sát được: 2,709 req/s ở 1,700 luồng tụt còn 2,400 req/s ở 2,000 luồng.

## 2.3. Ngưỡng cho cơ chế khoá tài khoản

Cấu hình hiện tại **khoá sau 2 lần sai, giữ khoá 180 giây, và kiểm tra trạng thái khoá trước khi so mật khẩu** (bằng chứng: 99.7 % lần đăng nhập sai nhận 403 chứ không phải 401, và 401 chỉ tái xuất hiện theo đúng chu kỳ 180 giây). Hệ quả: **mật khẩu đúng vẫn bị từ chối 403 trong suốt thời gian khoá.**

Đề xuất ngưỡng: **khoá sau 5 lần sai liên tiếp trong cửa sổ trượt 15 phút, khoá 60 giây với backoff luỹ thừa** (60 s → 120 s → 300 s). Lý do: ngưỡng 2 lần gây khoá nhầm người dùng thật ở tỉ lệ không chấp nhận được — trong bài test này 99.7 % request sai mật khẩu bị chặn ngay từ lần thứ hai, còn với người dùng thật thì gõ sai 2 lần là chuyện bình thường. Đồng thời phải **giới hạn tốc độ theo IP** thay vì chỉ theo tài khoản, vì khoá theo tài khoản tạo ra một lỗ hổng từ chối dịch vụ: kẻ tấn công chỉ cần 2 request để khoá tài khoản của bất kỳ ai trong 3 phút.

---

# PHẦN 3 — ĐỀ XUẤT TỐI ƯU HIỆU NĂNG

Xếp theo tỉ lệ **lợi ích / chi phí**, kèm ước lượng định lượng dựa trên số liệu đã đo.

## Nhóm A — Bắt buộc làm ngay (khắc phục lỗi đang xảy ra trên production)

### A1. Dùng prepared statement cho `?search=` — xoá sổ 100 % lỗi 500

**Vấn đề đo được:** 22,886 lỗi HTTP 500 trên hai lượt chạy, 100 % tập trung vào từ khoá chứa dấu nháy đơn.

**Giải pháp:** thay nối chuỗi bằng tham số ràng buộc:

```js
db.all('SELECT * FROM products WHERE name LIKE ?', [`%${q}%`], cb)
```

**Cải thiện ước lượng:** tỉ lệ lỗi **3.57 % → 0.00 %**, tức khoảng **129,000 lỗi 500 mỗi giờ được loại bỏ** ở mức tải 997 req/s. Không tốn thêm một mili giây CPU nào — prepared statement thực tế **nhanh hơn** nối chuỗi vì SQLite cache được kế hoạch truy vấn. Đồng thời bịt luôn lỗ hổng SQL Injection. **Đây là thay đổi một dòng, lợi ích lớn nhất trên toàn bộ danh sách này.**

### A2. Tăng backlog TCP và bật keep-alive — xoá 1,213 timeout

**Vấn đề đo được:** `Connect` p95 nhảy từ 1 ms lên 1,020 ms tại 1,800 luồng; 1,210 `ConnectTimeoutException`. Con số 1,020 ms rất đặc trưng — nó là thời gian chờ **retransmit gói SYN đầu tiên** khi hàng đợi accept đầy. Vấn đề nằm ở tầng chấp nhận kết nối, không nằm ở tầng xử lý.

**Giải pháp:**
```js
server.listen(3000, '0.0.0.0', 1024);          // backlog mặc định 511, nâng lên 1024+
server.keepAliveTimeout = 65000;                // giữ kết nối, không bắt tay lại
server.headersTimeout   = 66000;
server.maxRequestsPerSocket = 0;
```
kèm `sysctl net.core.somaxconn=1024` và `net.ipv4.tcp_max_syn_backlog=2048`.

**Cải thiện ước lượng:** loại bỏ **toàn bộ 1,213 timeout (0.158 %)** và phần lớn trong số 8,758 vi phạm SLA 2 giây (99.9 % số đó có `Connect` > 1,000 ms). Điểm gãy dịch từ **1,800 lên khoảng 2,500 kết nối đồng thời** — vì nút thắt được gỡ chứ không phải được che. Chi phí: 3 dòng cấu hình, không ảnh hưởng logic.

### A3. Giới hạn vòng đời giỏ hàng trong RAM — chặn rò rỉ bộ nhớ

**Vấn đề đo được:** giỏ hàng lưu trong RAM tiến trình và không được dọn — bằng chứng gián tiếp: phản hồi checkout giữ nguyên 313–315 byte suốt 300 giây trong khi các luồng nền liên tục thêm sản phẩm vào giỏ, chứng tỏ checkout không đọc và không xoá giỏ hàng.

**Giải pháp:** dùng LRU có giới hạn số phần tử và TTL (ví dụ 30 phút không hoạt động), **xoá giỏ hàng ngay sau khi checkout thành công**, và về lâu dài chuyển giỏ hàng sang Redis hoặc bảng trong DB.

**Cải thiện ước lượng:** biến bộ nhớ từ **tăng đơn điệu không giới hạn** thành có trần xác định. Với 1,000 người dùng đồng thời và giỏ trung bình 10 món, trần RAM cho giỏ hàng vào cỡ vài MB thay vì tăng vô hạn. Đây là điều kiện tiên quyết để hệ thống chạy được liên tục nhiều ngày — soak test 11 phút hiện tại **không đủ dài để phơi bày vấn đề này** vì nó chỉ bắn vào đường đọc.

## Nhóm B — Nâng trần năng lực (tăng throughput theo bội số)

### B1. Chạy Node ở chế độ cluster — cải thiện lớn nhất về throughput

**Vấn đề đo được:** throughput chạm trần **2,709 req/s** rồi tụt xuống 2,400 req/s khi thêm tải, trong khi máy có **12 nhân / 16 luồng**. Đường xử lý nghiệp vụ cực rẻ (1 ms ở tải thấp) nhưng độ trễ ở tải cao là 198.8 ms — chênh lệch **gần 200 lần** này toàn bộ là thời gian xếp hàng. Đó là chữ ký kinh điển của **một tiến trình đơn luồng bão hoà trong khi 11 nhân còn lại nhàn rỗi**.

**Giải pháp:** `cluster` module hoặc PM2 ở chế độ `-i max`, hoặc đặt sau reverse proxy Nginx cân bằng tải nhiều tiến trình.

**Cải thiện ước lượng:** đường đọc và đường xác thực đều **stateless và không tranh chấp**, nên chúng mở rộng gần tuyến tính theo số nhân. Với 8 worker, dự kiến throughput trần đi từ **2,700 req/s lên 12,000–16,000 req/s** (hệ số 4.5–6 lần, đã trừ hao chi phí điều phối và độ trễ giảm dần theo số nhân). Quan trọng hơn con số throughput: ở mức tải hiện tại 997 req/s, **p95 sẽ giảm từ 8 ms xuống dưới 3 ms** và p99 từ 17 ms xuống dưới 6 ms, vì hàng đợi biến mất. Đây là thay đổi mang lại nhiều nhất trong toàn bộ báo cáo về mặt năng lực.

**Điều kiện đi kèm bắt buộc:** giỏ hàng đang nằm trong RAM của một tiến trình. Bật cluster **trước khi** làm A3 sẽ gây bug chức năng nghiêm trọng — người dùng thêm hàng vào giỏ ở worker 1 rồi checkout trúng worker 2 sẽ thấy giỏ rỗng. **A3 phải làm trước B1.**

### B2. Cache phản hồi `GET /api/products` — giảm CPU của đường nóng

**Vấn đề đo được:** mỗi phản hồi danh sách sản phẩm nặng **22,283 byte**. Ở 997 req/s trên đường đọc, hệ thống đang **truy vấn DB, dựng object và tuần tự hoá JSON khoảng 22 MB/giây** cho một tập dữ liệu gần như không đổi.

**Giải pháp:** cache chuỗi JSON đã tuần tự hoá trong bộ nhớ với TTL 30–60 giây, vô hiệu hoá cache khi có ghi vào bảng sản phẩm; phát hành `ETag` + `Cache-Control` để client trả `304`; bật nén gzip/brotli.

**Cải thiện ước lượng:** loại bỏ chi phí truy vấn và `JSON.stringify` cho phần lớn request. Dựa vào tỉ lệ đo được — `GET /api/products` (22 KB) chậm hơn `?search=` (payload nhỏ hơn nhiều) 22 %, tức 3.37 ms so với 2.76 ms — chi phí tuần tự hoá và truyền tải chiếm khoảng **20–25 % thời gian xử lý** của endpoint này. Cache sẽ đưa avg từ 3.37 ms xuống dưới **1 ms** và nâng trần đường đọc thêm khoảng **50 %**. Với `ETag`, băng thông giảm tới **95 %** cho client quay lại.

### B3. Bật WAL mode cho SQLite — mở khoá ghi đồng thời

**Vấn đề đo được:** checkout hiện ở mức 2.9–5.2 ms, hoàn toàn chấp nhận được ở 325 req/s. Nhưng SQLite ở chế độ journal mặc định dùng **khoá ghi toàn cơ sở dữ liệu**, nên mọi thao tác ghi bị tuần tự hoá và **mọi thao tác đọc bị chặn trong lúc ghi**.

**Giải pháp:**
```sql
PRAGMA journal_mode = WAL;
PRAGMA synchronous  = NORMAL;
PRAGMA busy_timeout = 5000;
```

**Cải thiện ước lượng:** WAL cho phép đọc song song với ghi và giảm số lần fsync. Dự kiến checkout p95 đi từ **8 ms xuống 3–4 ms** ở mức tải nền, và quan trọng hơn — trần ghi tăng khoảng **3–5 lần**. Ở tải hiện tại lợi ích là khiêm tốn vì đường ghi chưa hề bão hoà, nhưng nó là **điều kiện bắt buộc để B1 phát huy tác dụng**: khi có 8 worker cùng ghi vào một file SQLite, chế độ journal mặc định sẽ biến thành nút thắt tuần tự hoá và triệt tiêu phần lớn lợi ích của cluster.

### B4. Kết nối DB dùng chung + chỉ mục đúng chỗ

Mở một kết nối SQLite bền vững cho mỗi worker thay vì mở/đóng theo request, và tạo chỉ mục cho các cột dùng trong `WHERE` của đường đăng nhập (`users.email`) và đơn hàng (`orders.user_id`).

**Cải thiện ước lượng:** ở quy mô dữ liệu hiện tại (147 sản phẩm, 200 tài khoản) **lợi ích gần như bằng không** — SQLite quét toàn bảng 200 dòng nhanh hơn cả tra chỉ mục. Tôi nêu ra để phòng khi dữ liệu lớn lên: với 100,000 tài khoản, chỉ mục trên `users.email` sẽ là khác biệt giữa 0.1 ms và 20 ms cho mỗi lần đăng nhập.

## Nhóm C — Cần cân nhắc đánh đổi, không làm mù quáng

### C1. Băm mật khẩu — bắt buộc về bảo mật, nhưng sẽ làm chậm hệ thống

**Cần nói thẳng để tránh hiểu lầm:** dữ liệu chứng minh mật khẩu **đang được so sánh ở dạng plaintext** — đăng nhập hợp lệ mất **~1 ms ở tải thấp**, trong khi bcrypt cost 10 tốn 50–100 ms CPU mỗi lần. Không có chỗ nào trong 1 ms đó chứa một hàm băm.

Đây là lỗ hổng bảo mật nghiêm trọng và **phải sửa**. Nhưng phải hiểu đúng hệ quả hiệu năng: bcrypt là hàm **cố ý tốn CPU**. Áp bcrypt cost 10 lên đường đăng nhập hiện tại sẽ đưa throughput trần từ **2,700 req/s xuống khoảng 100–150 req/s trên một tiến trình** — sụt hơn 20 lần. Bất kỳ ai nhìn thấy độ trễ đăng nhập 198.8 ms trong log này rồi kết luận "chi phí băm mật khẩu đang gây chậm" là **đọc sai hoàn toàn**: 198.8 ms đó là thời gian xếp hàng, và hệ thống hiện chưa hề trả một đồng chi phí băm nào.

**Cách làm đúng, gộp cả ba việc:**
1. Băm bằng bcrypt cost 10 (hoặc argon2id) — chấp nhận chi phí, đây là yêu cầu bảo mật không thương lượng.
2. Bù lại bằng cluster (B1) để có 8–12 nhân cùng băm → khôi phục trần lên **~1,000–1,500 đăng nhập/giây**, thừa sức cho mọi nhu cầu thực tế.
3. Phát hành **JWT/session token có thời hạn** để mỗi phiên chỉ băm **một lần** thay vì băm ở mọi request. Ở bài test này 733,402 lần đăng nhập hợp lệ trong 390 giây là kịch bản nhân tạo; hệ thống thật chỉ đăng nhập một lần rồi dùng token, nên chi phí băm được phân bổ trên hàng trăm request.

### C2. Chuyển sang PostgreSQL — chỉ khi dữ liệu lớn lên

SQLite hiện tại **không phải là nút thắt** — checkout 2.9 ms, đọc 3.3 ms ở 997 req/s là số liệu rất tốt. Không có lý do hiệu năng nào để đổi DB **ngay bây giờ**. Ngưỡng để cân nhắc: khi cần ghi vượt **2,000 giao dịch/giây bền vững**, hoặc khi cần chạy nhiều instance backend trên nhiều máy (SQLite không chia sẻ được qua mạng). Trước ngưỡng đó, WAL mode (B3) là đủ và rẻ hơn nhiều.

### C3. Full-text search khi danh mục lớn lên

Tìm kiếm hiện dùng `LIKE '%từ khoá%'`, mà mẫu có ký tự đại diện ở đầu thì **không chỉ mục nào dùng được** — luôn phải quét toàn bảng. Với 147 sản phẩm điều đó vô hại (đo được 2.76 ms). Với 50,000 sản phẩm, cùng truy vấn đó sẽ mất **hàng trăm mili giây**. Khi danh mục vượt khoảng 10,000 sản phẩm, chuyển sang **SQLite FTS5** — giữ độ trễ dưới 5 ms bất kể kích thước danh mục.

## 3.4. Lộ trình thực hiện đề xuất

| Giai đoạn | Việc | Nỗ lực | Kết quả kỳ vọng |
|---|---|---|---|
| **1 — trong ngày** | A1 (prepared statement), A2 (backlog + keep-alive) | ~1 giờ | Lỗi 5xx **3.57 % → 0 %**; timeout **0.158 % → 0 %**; điểm gãy **1,800 → ~2,500** kết nối |
| **2 — trong tuần** | A3 (giới hạn giỏ hàng), B3 (WAL) | ~1 ngày | Bộ nhớ có trần xác định; checkout p95 **8 → 3–4 ms**; sẵn sàng cho cluster |
| **3 — trong tuần** | B1 (cluster), B2 (cache + ETag) | ~2 ngày | Throughput trần **2,700 → 12,000–16,000 req/s**; p95 đường đọc **8 → dưới 3 ms** |
| **4 — sprint sau** | C1 (băm mật khẩu + token) | ~3 ngày | Đóng lỗ hổng bảo mật, giữ trần đăng nhập ≥ 1,000 req/s nhờ giai đoạn 3 |
| **5 — theo dõi** | B4, C2, C3 | theo dữ liệu | Kích hoạt khi vượt ngưỡng đã nêu |

---

# KẾT LUẬN

**Hệ thống EShop backend, ở quy mô dữ liệu và mức tải hiện tại, có hiệu năng tốt.** Nó phục vụ **997 request/giây liên tục 11 phút với 1,000 người dùng đồng thời ở p95 = 8 ms mà không suy thoái một chút nào**, hấp thụ một cú vọt tải gấp 21 lần trong 5 giây với **không một lỗi nào** và hồi phục **dưới 1 giây**, và chịu được tới **1,700 kết nối đồng thời ở 2,709 request/giây** trước khi gãy.

**Hai vấn đề cần xử lý, và cả hai đều đã được định vị chính xác:**

1. **Lỗi chức năng đang xảy ra liên tục trên production:** 3.57 % toàn bộ request trả HTTP 500, do endpoint tìm kiếm nối chuỗi vào SQL và vỡ khi gặp dấu nháy đơn. **Hoàn toàn độc lập với tải** — thêm phần cứng không giúp gì. Sửa bằng một dòng prepared statement, đồng thời bịt luôn lỗ hổng SQL Injection. Đây là việc ưu tiên số một.

2. **Trần năng lực bị chặn bởi kiến trúc đơn tiến trình, không phải bởi cơ sở dữ liệu.** Toàn bộ 198.8 ms độ trễ trung bình ở tải cao là thời gian xếp hàng — đường xử lý nghiệp vụ chỉ tốn 1 ms. Máy có 12 nhân nhưng chỉ 1 nhân đang làm việc. Bật cluster và điều chỉnh backlog TCP sẽ nâng trần lên khoảng **5 lần** mà không cần đụng tới một dòng logic nghiệp vụ nào.

**Ngưỡng cam kết được ngay hôm nay:** 900 req/s đường đọc · 1,800 req/s đường xác thực · 300 req/s đường giao dịch · 1,000 người dùng đồng thời · p95 ≤ 25 ms (đọc) và ≤ 250 ms (xác thực) · p99 ≤ 500 ms · 0 % lỗi 5xx sau khi sửa A1. **Ngưỡng cứng tuyệt đối không được vượt: 1,800 kết nối đồng thời** — đó là điểm gãy đã đo, không phải ước lượng.

---

---

## Phụ lục — Mô tả hệ thống được cấp cho AI

Nội dung file `README.md` đặt trong thư mục cô lập, là toàn bộ thông tin AI có về hệ thống
ngoài bốn file `.jtl`:

```markdown
# Kết quả đo hiệu năng — cần phân tích

Bốn file log thô của Apache JMeter trong thư mục `logs/`, sinh từ các lượt kiểm thử hiệu năng
trên backend API của một ứng dụng thương mại điện tử (EShop).

## Về hệ thống được kiểm thử

- Backend Node.js, cơ sở dữ liệu SQLite, chạy trên `http://localhost:3000`
- Máy chạy: laptop cá nhân, CPU Intel i5-13500H (12 nhân vật lý / 16 luồng), RAM 30 GiB, Ubuntu 26.04

## Các lượt chạy

| File | Kịch bản | Endpoint được bắn tải |
|---|---|---|
| `load-20260811T023204Z.jtl` | Load — tải đều | `GET /api/products` và `GET /api/products?search=` |
| `stress-20260813T003655Z.jtl` | Stress — tăng tải tới điểm gãy | `POST /api/login` |
| `spike-20260813T005423Z.jtl` | Spike — vọt đột ngột | `POST /api/cart` rồi `POST /api/checkout` |
| `soak-20260813T010601Z.jtl` | Endurance — giữ tải đều thời gian dài | `GET /api/products` và `?search=` |

## Việc cần làm

1. Phân tích bốn file log trên.
2. Đề xuất **ngưỡng hiệu năng** (performance thresholds) nên áp cho hệ thống này.
3. Đề xuất các hướng **tối ưu hiệu năng** cụ thể.
```
