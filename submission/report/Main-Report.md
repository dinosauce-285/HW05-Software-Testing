# Báo cáo Kiểm thử Hiệu năng — EShop Backend API

**Môn:** CS423 / CSC13003 — Kiểm chứng Phần mềm (AI-augmented · 2026)
**Bài tập:** HW05 — Performance Testing
**Sinh viên:** Lý Quốc Thạnh — **23127262** — 23127262@student.hcmus.edu.vn
**Repo:** https://github.com/dinosauce-285/HW05-Software-Testing
**SUT:** EShop backend API — https://github.com/ttbhanh/eshop-sut
**Ngày thực hiện:** 11/08/2026 – 13/08/2026

---

## Mục lục

1. [Phạm vi và lý do ghép kịch bản với nhóm endpoint](#1-phạm-vi-và-lý-do-ghép-kịch-bản-với-nhóm-endpoint)
2. [Môi trường và phương pháp đo](#2-môi-trường-và-phương-pháp-đo)
3. [Dữ liệu kiểm thử](#3-dữ-liệu-kiểm-thử)
4. [Quy trình làm việc với AI theo từng bước](#4-quy-trình-làm-việc-với-ai-theo-từng-bước)
5. [Kịch bản Load — read-heavy](#5-kịch-bản-load--read-heavy)
6. [Kịch bản Stress — auth-heavy](#6-kịch-bản-stress--auth-heavy)
7. [Kịch bản Spike — transactional](#7-kịch-bản-spike--transactional)
8. [Endurance / soak — ngưỡng chịu đựng của phần cứng](#8-endurance--soak--ngưỡng-chịu-đựng-của-phần-cứng)
9. [Review và sửa những gì AI làm sai](#9-review-và-sửa-những-gì-ai-làm-sai)
10. [Lỗi phát hiện được](#10-lỗi-phát-hiện-được)
11. [Tổng hợp bằng chứng](#11-tổng-hợp-bằng-chứng)
12. [Kết luận](#12-kết-luận)

---

## 1. Phạm vi và lý do ghép kịch bản với nhóm endpoint

*(đề mục 5:72-78 và mục 6:88 — "briefly justify which group you paired with each scenario")*

Đề yêu cầu ba nhóm endpoint, mỗi nhóm được phủ bởi **đúng một** kịch bản. Sau khi đọc mã nguồn
`sut/backend/server.js` (572 dòng, toàn bộ route nằm trong một file) và gọi thử bằng `curl` trên
backend đang chạy, tôi chốt cách ghép sau:

| Kịch bản | Nhóm endpoint | Endpoint cụ thể | Lý do ghép |
|---|---|---|---|
| **Load** | Read-heavy | `GET /api/products` và `GET /api/products?search=` | Endpoint chỉ đọc, chi phí mỗi request thấp và ổn định, nên giữ được tải đều trong thời gian dài mà không phá hỏng dữ liệu. Đây là điều kiện cần để đo **ngưỡng chịu đựng bằng số cụ thể** mà mục 6:94 đòi hỏi — một endpoint ghi dữ liệu sẽ làm CSDL phình lên và biến số đo thành hàm của thời gian chứ không phải của tải |
| **Stress** | Auth-heavy | `POST /api/login` | Ép tới điểm gãy sẽ kích hoạt cơ chế **khoá tài khoản**, đúng thứ mục 6:93 yêu cầu mô tả quy trình reset. Ngoài ra đây là endpoint duy nhất có logic trạng thái (đếm số lần sai, thời hạn khoá), nên hành vi dưới tải cao lộ ra nhiều thứ hơn một endpoint không trạng thái |
| **Spike** | Transactional | `POST /api/cart` → `POST /api/checkout` | Cú vọt đột ngột mô phỏng đúng tình huống flash-sale trong thương mại điện tử. Nhánh ghi CSDL cũng là nơi dễ lộ lỗi thật nhất khi nhiều luồng cùng ghi — phù hợp với yêu cầu log bug ở mục 6:96 |

**Không trùng lặp trong nhóm** (đề mục 5:78): ba endpoint trên đã được thông báo và chốt với nhóm
trước khi bắt đầu thực hiện.

### Vì sao không chọn phương án dễ hơn

Ba endpoint `POST /api/apply-coupon`, `POST /api/register`, `POST /api/products` đều **không yêu
cầu token** nên dựng test plan sẽ nhanh hơn (không cần bước lấy token). Tôi vẫn chọn bộ trên vì nó
bám sát ví dụ đề nêu ở mục 5:74-77, mà ba nhóm này chiếm 60/100 điểm. Chi phí phải trả chỉ là một
setUp Thread Group lấy token cho kịch bản Spike — làm một lần, dùng cho cả plan.

---

## 2. Môi trường và phương pháp đo

### 2.1 Phần cứng và phần mềm

| Thành phần | Giá trị |
|---|---|
| Máy | `qt-ThinkBook-14-G5-IRH` (hostname khớp các bài tập trước — đề mục 11:151) |
| CPU | 13th Gen Intel Core i5-13500H — 12 nhân vật lý, **16 luồng** |
| RAM | 30 GiB |
| Hệ điều hành | Ubuntu 26.04 LTS, kernel 7.0.0-29-generic |
| Công cụ đo tải | **Apache JMeter 5.6.3**, chế độ non-GUI |
| JVM | OpenJDK 21.0.12 LTS |
| Runtime SUT | Node.js v22.22.1, CSDL SQLite |
| Theo dõi tài nguyên | `htop` (quan sát trực tiếp) + lấy mẫu từ `/proc/<pid>/stat` (số liệu định lượng) |

JMeter và JDK được cài dưới dạng **portable** trong `tools/` và nạp qua `env.sh`, vì tài khoản trên
máy không có quyền `sudo` không mật khẩu. Chi tiết ở `Not-Run.md` mục 1. Điều này không ảnh hưởng
tới kết quả đo: JMeter non-GUI chạy đầy đủ chức năng, sinh `.jtl` và HTML dashboard bình thường.

### 2.2 Lệnh chuẩn cho mỗi lượt chạy

```bash
source env.sh
cd plans && jmeter -n -t <ten-plan>.jmx \
       -l ../results/raw/<scenario>-<ISO>.jtl \
       -e -o ../results/html/<scenario>-<ISO>/
```

Thư mục `-o` bắt buộc phải chưa tồn tại, nên mỗi lượt chạy tự nhiên có thư mục riêng và **không
lượt nào ghi đè lượt nào**.

### 2.3 Cách đo tài nguyên — và vì sao không dùng `ps %cpu`

`scripts/monitor.sh` lấy mẫu tiến trình backend mỗi giây. Hai quyết định kỹ thuật ở đây đều xuất
phát từ lỗi thật đã mắc phải và đã sửa (chi tiết ở mục 9):

1. **Neo biểu thức tìm tiến trình** — `pgrep -f '^node server\.js$'` thay vì `pgrep -f "node server.js"`.
   Mẫu không neo sẽ khớp trúng tiến trình `bash` bao ngoài, cho ra RSS 2,1 MB và CPU 0,0%.
   Script còn có chốt chặn: từ chối bất kỳ PID nào chiếm dưới 30 MB RSS.

2. **CPU tức thời, không phải trung bình đời sống tiến trình** — đọc `utime + stime` từ
   `/proc/<pid>/stat`, lấy hiệu giữa hai lần lấy mẫu rồi chia cho `CLK_TCK`. `ps -o %cpu` là
   **trung bình cộng dồn từ lúc tiến trình khởi động**, nên một đợt bắn tải 5 phút bị pha loãng bởi
   khoảng thời gian rảnh trước đó. Kiểm chứng: khi bắn 300 request liên tiếp, cột CPU đo bằng
   `/proc` nhảy `0% → 29% → 17% → 0%` trong khi `ps %cpu` đứng yên ở `2,1%` suốt cả lượt.

### 2.4 Cảnh báo: phân vị trên dashboard HTML **không phải** phân vị toàn lượt

JMeter đặt `jmeter.reportgenerator.statistic_window = 20000` làm mặc định. Dashboard HTML vì thế
**chỉ tính phân vị trên 20 000 mẫu cuối cùng** — với một lượt stress thì đó đúng là phần đuôi quá
tải nhất, nên con số bị thổi lên rất nhiều.

| Lượt | Mẫu | Vượt 20 000? | p95 tính từ `.jtl` thô | p95 trên dashboard |
|---|---|---|---|---|
| Load | 13 483 | không | 2 ms | 2 ms |
| Spike | 17 376 | không | 6 ms | 6 ms |
| Soak | 627 943 | **có** | **8 ms** | 12 ms |
| Stress | 770 065 | **có** | **237 ms** | 1 671 ms — **sai 7,1 lần** |

Mọi phân vị trong báo cáo này đều tính từ `.jtl` thô bằng `scripts/jtl-stats.py`. Cách phát hiện và
kiểm chứng nằm ở `Task2-Misinterpretation-Hunt.md` mục B1.

### 2.5 Nguyên tắc về số liệu

Mọi con số trong báo cáo này đều **trích được từ `.jtl` thô hoặc file CSV tài nguyên bằng lệnh**.
Không có con số nào lấy từ trí nhớ hay từ tóm tắt trung gian. Danh mục `.jtl` kèm checksum SHA-256
nằm ở `results/raw/MANIFEST.md` để đối chiếu chống sửa tay.

---

## 3. Dữ liệu kiểm thử

*(đề mục 6:89 — "Each endpoint group must have its own CSV input file... A single shared CSV is not sufficient")*

### 3.1 Vì sao phải tự sinh dữ liệu

CSDL seed sẵn của EShop chỉ có **5 sản phẩm và 2 tài khoản** (`database.js:91-102`). Con số này
không đủ cho kiểm thử data-driven, và riêng với kịch bản Stress thì 2 tài khoản chạy được vài giây
là hết — vì SUT khoá tài khoản sau 2 lần đăng nhập sai.

`scripts/seed-data.js` tạo thêm dữ liệu **qua chính API của SUT**:

| Loại | Số lượng | Cách tạo |
|---|---|---|
| Sản phẩm | 147 (tổng thành 152) | `POST /api/products` — endpoint này không yêu cầu token, xem BUG-06 |
| Tài khoản hợp lệ | 200 (`perfuser001..200@eshop.test`) | `POST /api/register` |
| Tài khoản thăm dò lockout | 10 (`lockprobe001..010@eshop.test`) | `POST /api/register` |

Danh mục sản phẩm được sinh theo tổ hợp **7 thương hiệu × 3 thế hệ × 7 biến thể**, nhờ vậy biết
**trước** mỗi từ khoá tìm kiếm phải trả về bao nhiêu kết quả. Kỳ vọng của assertion suy ra từ cấu
trúc dữ liệu chứ không suy ngược từ phản hồi của SUT — nếu suy ngược thì assertion sẽ luôn đúng và
mất hoàn toàn tác dụng.

### 3.2 Ba file CSV riêng biệt

| Nhóm | File | Số dòng | Cột |
|---|---|---|---|
| Read-heavy | `data/products.csv` | 14 | `search_term, expect_min_count, expect_code, note` |
| Auth-heavy | `data/credentials.csv` | 210 | `email, password, expect_code, label` |
| Transactional | `data/orders.csv` | 200 | `email, password, product_id, quantity, price, total_amount, shipping_address` |

Cột `expect_*` cho phép assertion đọc kỳ vọng **từ dữ liệu** thay vì hard-code trong plan — mỗi
dòng CSV mang theo kết quả đúng của chính nó. `data/products.csv` có một dòng đặc biệt là từ khoá
`O'Neill` với ghi chú *"dấu nháy đơn — dự kiến lộ lỗi SQL injection"*; dòng này chính là thứ phát
hiện BUG-01.

---

## 4. Quy trình làm việc với AI theo từng bước

*(đề mục 2:20 — cấm prompt kiểu "chạy load test rồi bảo tôi hiệu năng có tốt không")*

Công cụ AI: **Claude Opus 5** qua Claude Code CLI. Toàn bộ prompt nguyên văn nằm ở
`submission/appendix/AI-Prompt-Log.md`; bảng audit theo mẫu 5 mục của Khoa ở
`submission/appendix/AI-Audit-Report.md`.

Quy trình được chia thành các bước tách biệt, mỗi bước có kiểm chứng riêng trước khi sang bước sau:

| Bước | Việc | Cách kiểm chứng |
|---|---|---|
| 1 | Khảo sát hành vi thật của SUT | Gọi `curl` thật từng endpoint, đối chiếu với `server.js` |
| 2 | Chọn endpoint và ghép với kịch bản | Đối chiếu với mục 5 của đề, chốt với nhóm |
| 3 | Chọn tham số tải (thread / ramp-up / think-time) | Mỗi con số phải giải thích được bằng lời — xem mục 5.1, 6.1, 7.1 |
| 4 | Sinh dữ liệu và file CSV | Chạy `seed-data.js`, đếm lại bằng API |
| 5 | Sinh test plan `.jmx` | Chạy thử ở quy mô nhỏ (smoke) trước khi chạy thật |
| 6 | Review và sửa plan | Ghi ngay vào `AI-Review-Fix-Log.md` — xem mục 9 |
| 7 | Chạy thật, thu bằng chứng | `.jtl` + HTML + CSV tài nguyên |
| 8 | Phân tích kết quả | Trích số bằng lệnh từ `.jtl` thô, không tin bản tóm tắt |

Bước 5 và 6 lặp lại nhiều vòng. Ví dụ với kịch bản Stress, bản plan đầu tiên phải qua **hai** vòng
sửa mới chạy đúng, và kịch bản phải chạy **bốn** lượt mới tìm được điểm gãy.

---

## 5. Kịch bản Load — read-heavy

**Test plan:** `plans/23127262_Load_20260811.jmx`
**Listener:** Summary Report
**Dữ liệu:** `data/products.csv`

### 5.1 Tham số và lý do

| Tham số | Giá trị | Lý do chọn |
|---|---|---|
| Số luồng | **50** | Backend là Node đơn luồng ghép với SQLite ghi file. 50 người dùng đồng thời là mức "ngày thường" hợp lý trên một máy cá nhân; cao hơn nữa thì kịch bản biến thành stress chứ không còn là load |
| Ramp-up | **60 giây** | Khoảng 1 luồng mỗi 1,2 giây. Tránh cú sốc lúc khởi động — cú sốc là việc của kịch bản Spike, không phải của Load |
| Thời lượng | **300 giây** | Đủ dài để qua giai đoạn khởi động JIT và cache, lấy được số liệu ở trạng thái ổn định |
| Think-time | **800 ms ± 200 ms** | Người dùng thật đọc trang rồi mới bấm tiếp. Không có think-time thì con số RPS chỉ phản ánh tốc độ sinh request của công cụ, không phản ánh hành vi người dùng |

### 5.2 Assertion

Plan có **5 assertion thuộc 4 loại khác nhau**, không chỉ kiểm mã 200:

| Assertion | Loại | Kiểm gì | Vì sao cần |
|---|---|---|---|
| 1 | Response Assertion | Mã phản hồi bằng `${expect_code}` từ CSV | Kỳ vọng đi theo từng dòng dữ liệu |
| 2 | Response Assertion | Header `Content-Type` chứa `application/json` | SUT trả **HTML** khi lỗi (`server.js:149`) — chỉ kiểm mã 200 sẽ bỏ sót |
| 3 | JSONPath Assertion | Phần tử đầu có trường `id` | Xác nhận cấu trúc phản hồi, không chỉ xác nhận có phản hồi |
| 4 | Duration Assertion | Độ trễ dưới 2000 ms | Biến ngưỡng SLA thành điều kiện pass/fail thay vì chỉ ghi nhận |
| 5 | JSR223 (Groovy) | Số kết quả trả về ≥ `${expect_min_count}` | Tìm kiếm trả 200 với mảng rỗng vẫn là sai — assertion này bắt được |

### 5.3 Kết quả

`results/raw/load-20260811T023204Z.jtl` — 13 483 mẫu trong 299 giây.

| Sampler | Mẫu | p90 | p95 | p99 | Max | Lỗi | Throughput |
|---|---|---|---|---|---|---|---|
| `GET /api/products` | 6 755 | 2 ms | 3 ms | 3 ms | 14 ms | 0 (0,00%) | 22,6 req/s |
| `GET /api/products?search=` | 6 728 | 1 ms | 2 ms | 2 ms | 4 ms | 480 (7,13%) | 22,6 req/s |
| **Tổng** | **13 483** | 2 ms | **2 ms** | 3 ms | 14 ms | **480 (3,56%)** | **45,1 req/s** |

**Tài nguyên backend:** CPU trung bình 2,2% · RSS 117 MB.

### 5.4 Diễn giải

- **Tải ngày thường không gây áp lực gì.** p95 = 2 ms và CPU dưới 3% cho thấy 50 người dùng đồng
  thời còn xa mới chạm giới hạn. Muốn biết giới hạn thật ở đâu thì phải chạy soak — xem mục 8.
- **Throughput 45,1 req/s không phải trần của server.** Nó bị quyết định bởi think-time: mỗi luồng
  thực hiện 2 request, mỗi request cách nhau ~0,8 giây, nên 50 luồng chỉ sinh được chừng đó tải.
  Đây là chỗ rất dễ đọc sai thành "hệ thống chỉ chịu được 45 req/s".
- **Toàn bộ 480 lỗi đến từ đúng một từ khoá.** Lọc cột URL trong `.jtl` cho thấy 100% lỗi có URL là
  `?search=O%27Neill`. Đây là lỗi chức năng (BUG-01), **không phải** lỗi do tải — một phân biệt
  quan trọng, vì error rate 3,56% mà quy cho quá tải là kết luận sai.

---

## 6. Kịch bản Stress — auth-heavy

**Test plan:** `plans/23127262_Stress_20260813.jmx`
**Listener:** Aggregate Report
**Dữ liệu:** `data/credentials.csv`

### 6.1 Tham số và lý do

| Tham số | Giá trị | Lý do chọn |
|---|---|---|
| Số luồng | **2 000** (lượt chính thức) | Xem mục 6.3 — ba mức thấp hơn đã thử và không làm gãy được SUT |
| Ramp-up | **250 giây** ở lượt đầu, giữ tỉ lệ tuyến tính ở các lượt sau | Tăng đều 1 luồng/giây biến **trục thời gian thành trục tải**: tại giây thứ N có đúng N người dùng đồng thời. Nhờ vậy đọc đồ thị Response Time Over Time là suy ra được ngưỡng gãy bằng số, không phải phỏng đoán |
| Think-time | **300 ms ± 100 ms** | Ngắn hơn Load (800 ms) vì stress mô phỏng giờ cao điểm, thao tác dồn dập. Vẫn giữ lớn hơn 0 để con số RPS còn ý nghĩa thực tế |

### 6.2 Xử lý khoá tài khoản — điểm mấu chốt của kịch bản này

*(đề mục 6:93 — "When Stress/Spike runs trigger the 3-fail login lockout, reset it between runs and document the steps")*

**Đề bài ghi "3-fail" nhưng SUT khoá sau 2 lần sai.** `server.js:54` cộng `login_attempts + 2` mỗi
lần sai trong khi ngưỡng khoá là `>= 3`, nên lần sai thứ hai đã đạt 4. Đây là BUG-02, đã log thành
GitHub Issue #2. Kịch bản được thiết kế theo hành vi **thật** của SUT chứ không theo con số của đề.

CSV tách hai loại bằng cột `label`, và plan dùng **If Controller** để định tuyến sang hai sampler
riêng biệt:

| Nhánh | Số dòng CSV | Vai trò |
|---|---|---|
| `label = valid` | 200 | Luồng chính — đo độ trễ đăng nhập thật |
| `label = lockout-probe` | 10 | Kích hoạt và quan sát cơ chế khoá |

**Vì sao phải tách:** phản hồi 403 "đã khoá" trả về rất nhanh vì `server.js:40` kiểm tra trạng thái
khoá **trước** khi so mật khẩu. Nếu trộn chung, các phản hồi 403 siêu nhanh sẽ kéo throughput trung
bình đẹp lên một cách giả tạo, và số đo mất ý nghĩa.

**Kết quả quan sát được xác nhận đúng bug:** 10 tài khoản thăm dò, mỗi tài khoản nhận **đúng 2 phản
hồi 401 rồi chuyển sang 403** — 20 lần 401 và 10 lần 403, không có ngoại lệ.

#### Quy trình reset giữa các lượt chạy — lệnh chính xác

```bash
node scripts/reset-lockout.js
```

Kết quả in ra sau lượt chạy chính thức:

```
Đã mở khoá: 10 tài khoản có trạng thái khoá/đếm sai -> 0
Tổng tài khoản còn nguyên: 212
```

⚠️ **Không được dùng `node sut/backend/database.js` để reset.** File đó gọi `initDatabase()` ngay
khi được import (`database.js:117`), mà hàm này mở đầu bằng **6 lệnh `DROP TABLE`**
(`database.js:15-20`) — reset lockout xong thì mất luôn 200 tài khoản và 147 sản phẩm. Trong quá
trình làm bài tôi đã dính bẫy này **hai lần** (xem mục 9, dòng 4). `scripts/reset-lockout.js` mở
thẳng file `database.sqlite` bằng driver `sqlite3`, không đụng tới `database.js`, nên chỉ xoá
trạng thái khoá và giữ nguyên mọi dữ liệu khác.

Công cụ `sqlite3` CLI không có sẵn trên máy này nên không dùng được cách đó.

### 6.3 Bốn lượt chạy — quá trình tìm điểm gãy

Mức tải thiết kế ban đầu **không làm gãy được SUT**, nên phải leo thang có chủ đích. Giữ lại đủ cả
bốn `.jtl` để chứng minh quá trình tìm ngưỡng chứ không phải chọn sẵn con số đẹp:

| Lượt | Luồng | Mẫu | p95 | Lỗi | Throughput | CPU đỉnh của `node` |
|---|---|---|---|---|---|---|
| 1 | 250 | 127 938 | 3 ms | 0 (0,00%) | 388,5 req/s | 72% |
| 2 | 800 | 537 511 | 10 ms | 0 (0,00%) | 1 145,3 req/s | 115% |
| **3 (chính thức)** | **2 000** | **770 065** | **237 ms** | **9 971 (1,29%)** | **1 976,6 req/s** | **132%** |
| 4 | 1 800 | — | — | — | — | đo song song CPU của JMeter |

Lượt 1 và 2 **không phải thất bại cần giấu** — chúng là bằng chứng cho kết luận quan trọng nhất của
kịch bản này: với một endpoint rẻ như `/api/login` (mật khẩu so sánh dạng plaintext, không có
bcrypt), throughput bị quyết định bởi **think-time của công cụ đo** cho tới tận mốc khoảng 1 000
luồng. Ở lượt 1, throughput 622 req/s ≈ 250 luồng ÷ 0,4 giây mỗi vòng — con số của kịch bản, không
phải của server.

### 6.4 Đường cong gãy

Phân tách toàn bộ 770 065 mẫu theo **mức đồng thời thực tại thời điểm gửi** (cột `allThreads` trong
`.jtl`), không dùng dòng summary 30 giây — cách này cho ánh xạ tải ↔ độ trễ chính xác hơn:

| Luồng đồng thời | p50 | p95 | p99 | Tỉ lệ lỗi | `Connect` p95 |
|---|---|---|---|---|---|
| 1 000–1 099 | 21 ms | 136 ms | 196 ms | 0,00% | 1 ms |
| 1 200–1 299 | 77 ms | 107 ms | 129 ms | 0,00% | 0 ms |
| 1 400–1 499 | 142 ms | 209 ms | 213 ms | 0,01% | 1 ms |
| 1 600–1 699 | 183 ms | 199 ms | 1 222 ms | 0,24% | 1 ms |
| 1 700–1 799 | 188 ms | 399 ms | 1 443 ms | 0,63% | 1 ms |
| **1 800–1 899** | 196 ms | **1 228 ms** | 2 677 ms | **1,94%** | **1 020 ms** ← gãy |
| 1 900–1 999 | 205 ms | 1 634 ms | 4 461 ms | 4,13% | 1 051 ms |

Throughput theo mốc 30 giây: 2 627 req/s tại ~1 626 luồng → đỉnh **2 682 req/s** tại ~1 826 luồng →
tụt còn **2 444–2 555 req/s** ở 2 000 luồng.

Đây là dấu hiệu quá tải kinh điển: **throughput đạt đỉnh rồi đi xuống** trong khi độ trễ và tỉ lệ
lỗi tăng vọt. Độ trễ tối đa chạm **34 158 ms**.

**Ngưỡng gãy: 1 800 người dùng đồng thời.** Tại đúng mốc này **ba** chỉ báo vỡ cùng lúc — p95 nhảy
từ 399 ms lên 1 228 ms, tỉ lệ lỗi từ 0,63% lên 1,94%, và `Connect` p95 nhảy từ **1 ms lên 1 020 ms**.
Chỉ báo thứ ba là sạch nhất: nó giữ nguyên 0–1 ms suốt từ 0 đến 1 799 luồng rồi nhảy bậc, cho thấy
hàng đợi accept của socket đã tràn chứ không phải xử lý chậm đi.
**Throughput đỉnh: 2 682 req/s** tại khoảng 1 826 luồng.

> **Đính chính.** Bản đầu của báo cáo này ghi ngưỡng gãy là "~1 626 luồng", lấy từ mốc xuất hiện lỗi
> đầu tiên trên dòng summary 30 giây. Con số đó không đứng vững: tỉ lệ lỗi đã dao động 0,01–0,24%
> ngay từ mức 400 luồng, nên "lỗi đầu tiên" không phải tín hiệu sạch. Chi tiết ở
> `Task2-Misinterpretation-Hunt.md` mục B2.

### 6.5 Phân rã 9 971 lỗi

| Nguyên nhân | Số lượng | Ý nghĩa |
|---|---|---|
| Vượt ngưỡng SLA 2 000 ms (Duration Assertion) | 8 758 | HTTP vẫn 200, nhưng chậm quá ngưỡng — đây là "gãy" theo nghĩa trải nghiệm người dùng |
| `ConnectTimeoutException` | 1 210 | Hàng đợi accept của server đã đầy, không nhận thêm kết nối |
| `SocketTimeoutException` | 3 | Đã kết nối được nhưng không đọc được phản hồi |

Phân rã này quan trọng: **88% "lỗi" thực chất là request thành công nhưng quá chậm**. Nếu chỉ nhìn
con số 1,29% error rate mà kết luận "server trả lỗi" thì đã đọc sai bản chất.

### 6.6 Nút thắt nằm ở đâu

| Chỉ số | Giá trị | Kết luận |
|---|---|---|
| CPU tiến trình `node` | **102% trung bình, đỉnh 132%** | Vòng lặp sự kiện đơn luồng đã bão hoà |
| `loadavg` 1 phút toàn máy | **1,53 – 1,93** trên **16 luồng** | Máy mới dùng khoảng 12% |
| RSS đỉnh | 153 MB | Bộ nhớ hoàn toàn không phải giới hạn |

**15 trong 16 luồng CPU nằm không trong khi dịch vụ đã gãy.** Nút thắt là bản chất đơn luồng của
Node, không phải phần cứng và cũng không phải công cụ đo. Đây là căn cứ cho đề xuất tối ưu ở
PERF-03: chạy nhiều tiến trình qua `cluster` hoặc PM2.

---

## 7. Kịch bản Spike — transactional

**Test plan:** `plans/23127262_Spike_20260813.jmx`
**Listener:** View Results Tree
**Dữ liệu:** `data/orders.csv`

### 7.1 Hình dạng spike và lý do

Dùng **hai Thread Group chạy chồng lên nhau** thay vì một:

| Thành phần | Cấu hình | Vai trò |
|---|---|---|
| Nền thấp | 20 luồng, ramp 20 s, chạy suốt 300 s | Đường cơ sở — giữ nguyên trong toàn bộ lộ trình |
| Cú vọt | 400 luồng, ramp **5 s**, kéo dài 45 s, delay 120 s | Bung từ giây 120 đến giây 165 |

**Vì sao tách hai group:** nếu gộp chung thì sau khi cú vọt rút đi sẽ không còn đường cơ sở nào để
so sánh, và **không đo được thời gian hồi phục** — vốn là mục đích chính của kịch bản Spike.

| Tham số | Giá trị | Lý do |
|---|---|---|
| 20 luồng nền | thấp hơn Load (50) | Đây là luồng **ghi** CSDL, không phải luồng đọc |
| 400 luồng vọt = **gấp 20 lần** nền | flash-sale thật có tỉ lệ vọt 10–30 lần | Đủ mạnh để gây sốc mà vẫn trong khả năng sinh tải của máy |
| Ramp cú vọt **5 giây** | rất ngắn | Spike phải **đột ngột**. Ramp dài sẽ biến spike thành load, sai bản chất kịch bản |
| Think-time 1000 ms ± 300 ms | dài hơn Load | Người mua cân nhắc trước khi bấm đặt hàng, lâu hơn người duyệt sản phẩm |

### 7.2 Xử lý token

Cả `/api/cart` và `/api/checkout` đều đòi header `Authorization: Bearer`. Giải pháp: một **setUp
Thread Group** đăng nhập trước 50 tài khoản, dùng **JSON Extractor** trích `$.token`, lưu vào
properties `token_1..token_50`. Các luồng chính lấy token theo chỉ số luồng
(`ctx.getThreadNum() % 50`).

**Vì sao không đăng nhập trong mỗi vòng lặp:** làm vậy thì mỗi giao dịch phải gánh thêm một request
đăng nhập, và số liệu của nhóm transactional sẽ bị trộn với nhóm auth — hai nhóm mà đề yêu cầu tách
bạch.

### 7.3 Kết quả

`results/raw/spike-20260813T005423Z.jtl` — 17 376 mẫu, **0 lỗi**.

| Sampler | Mẫu | p90 | p95 | p99 | Max | Lỗi |
|---|---|---|---|---|---|---|
| `POST /api/cart` (nền) | 2 223 | 2 ms | 2 ms | 2 ms | 4 ms | 0 |
| `POST /api/checkout` (nền) | 2 214 | 8 ms | 8 ms | 9 ms | 15 ms | 0 |
| `POST /api/cart` (vọt) | 6 544 | 1 ms | 2 ms | 3 ms | 13 ms | 0 |
| `POST /api/checkout` (vọt) | 6 345 | 4 ms | 5 ms | 7 ms | 12 ms | 0 |
| setUp đăng nhập | 50 | 2 ms | 2 ms | 22 ms | 22 ms | 0 |
| **Tổng** | **17 376** | 4 ms | **6 ms** | 8 ms | 22 ms | **0 (0,00%)** |

### 7.4 Thời gian hồi phục

Đo trên **nhánh nền**, cắt theo từng 15 giây:

| Giai đoạn | Khoảng thời gian | Độ trễ trung bình | p95 |
|---|---|---|---|
| Trước cú vọt | giây 0–120 | 2,90 – 4,09 ms | 8–9 ms |
| Trong cú vọt | giây 120–165 | **1,84 – 2,06 ms** | 4–6 ms |
| Ngay sau cú vọt | giây 165–180 | 3,32 ms | 10 ms |
| Đã ổn định lại | giây 180–300 | 2,76 – 3,10 ms | 8 ms |

**Thời gian hồi phục dưới 1 giây.** Cắt lại dữ liệu ở độ phân giải 1 giây: cú vọt kết thúc ở giây
165, và ngay giây 166 độ trễ nhánh nền đã là 3,18 ms — bằng đúng mức trước khi bị vọt (3,38 ms).

> **Đính chính.** Bản đầu ghi "dưới 15 giây" vì tôi cắt dữ liệu theo cửa sổ 15 giây, nên độ phân giải
> chỉ tới đó. Con số cũ không sai nhưng kém chính xác 15 lần so với mức dữ liệu cho phép.

### 7.5 Một kết quả trái trực giác

Trong lúc bị vọt gấp 20 lần, độ trễ của nhánh nền **giảm** từ ~3,0 ms xuống 1,84 ms thay vì tăng.
**Nguyên nhân thì chưa xác định được.** Một giả thuyết là tải cao giữ cho vòng lặp sự kiện của Node
luôn bận nên không phải "đánh thức" lại giữa các request, đồng thời CPU chuyển sang tần số cao —
nhưng `.jtl` **không chứa dữ liệu nào kiểm chứng được điều đó**, nên đây vẫn chỉ là suy đoán và
được ghi rõ là suy đoán. Điều duy nhất khẳng định được từ số liệu: ở mức tải này SUT còn rất xa
điểm bão hoà (2 682 req/s ở kịch bản Stress), và **cả hai nhánh đều nhanh lên** trong cửa sổ vọt —
nhánh nền cũng đi từ 4,84 ms xuống 3,03 ms, chứ không riêng nhánh spike.

**Kết luận:** SUT hấp thụ trọn cú vọt gấp 20 lần mà không mất một request nào. Nhánh transactional
khoẻ hơn nhiều so với dự đoán ban đầu — nhưng lý do một phần là vì `POST /api/checkout` **không
kiểm tra gì cả** (BUG-05), nên nó rẻ một cách bất thường.

### 7.6 Reset dữ liệu giữa các lượt

`POST /api/checkout` insert thẳng vào bảng `orders` mà không kiểm giỏ hàng, không kiểm tồn kho
(`server.js:301`). Lượt chạy này tạo ra **8 559 đơn hàng** trong 5 phút. Quy trình reset:

```bash
./scripts/reset-db.sh
```

Kết quả kiểm chứng trước và sau:

```
đơn rác trước khi reset: 132
[1/4] Dung backend dang chay...
[2/4] Khoi dong lai backend (thao tac nay tu xoa va seed lai DB)...
[3/4] Nap lai du lieu nen (147 san pham + 210 tai khoan)...
[4/4] Kiem chung trang thai sach:
  - San pham: 152
  - Don hang: 0
```

Script lợi dụng chính BUG-04 làm cơ chế reset: khởi động lại backend là CSDL bị xoá sạch. Vì vậy
**sau mỗi lần restart bắt buộc phải chạy lại `seed-data.js`**, nếu không thì lượt sau bắn vào một
CSDL chỉ có 5 sản phẩm và 2 tài khoản.

---

## 8. Endurance / soak — ngưỡng chịu đựng của phần cứng

*(đề mục 6:94 — "reported with concrete numbers, e.g. maximum stable RPS, memory ceiling")*

### 8.1 Vì sao phải chạy thêm một lượt dò trần

Số liệu của kịch bản Load (45,1 req/s) **không dùng được** làm ngưỡng chịu đựng, vì nó bị chặn bởi
think-time chứ không phải bởi server. Phải chạy một lượt ramp riêng để tìm trần thật:

| Luồng | Throughput | Độ trễ trung bình | CPU của `node` |
|---|---|---|---|
| 128 | 64,6 req/s | 1 ms | thấp |
| 578 | 499,8 req/s | 1 ms | — |
| 1 028 | 949,0 req/s | 2 ms | — |
| **1 200** | **1 194,6 req/s** | 2 ms | **92 – 102%** |

CPU chạm ~100% của một nhân tại 1 200 luồng — đó là trần. Chọn **1 000 luồng** cho lượt soak để
chạy ở khoảng 85% trần, đúng nghĩa "tải giữ đều ổn định".

### 8.2 Kết quả soak 11 phút

`results/raw/soak-20260813T010601Z.jtl` — **627 943 mẫu**, 1 000 luồng, ramp 60 giây, chạy 660 giây.

| Phút | Mẫu | RPS | p95 | p99 | Lỗi |
|---|---|---|---|---|---|
| 0 (đang ramp) | 30 517 | 508,6 | 5 ms | 7 ms | 3,51% |
| 1 | 59 851 | **997,5** | 6 ms | 9 ms | 3,57% |
| 2 | 59 866 | **997,8** | 6 ms | 9 ms | 3,58% |
| 3 | 59 805 | **996,8** | 8 ms | 12 ms | 3,56% |
| 4 | 59 854 | **997,6** | 9 ms | 13 ms | 3,58% |
| 5 | 59 780 | **996,3** | 10 ms | 31 ms | 3,57% |
| 6 | 59 769 | **996,1** | 11 ms | 24 ms | 3,57% |
| 7 | 59 843 | **997,4** | 9 ms | 22 ms | 3,57% |
| 8 | 59 824 | **997,1** | 8 ms | 20 ms | 3,58% |
| 9 | 59 855 | **997,6** | 8 ms | 17 ms | 3,57% |
| 10 | 58 979 | 983,0 | 9 ms | 22 ms | 3,57% |

### 8.3 Kết luận bằng số

| Chỉ số | Giá trị đo được |
|---|---|
| **Max stable RPS** | **997 req/s** ở trạng thái ổn định — dao động 996,1 đến 997,8 trong 10 phút liên tục, **biên độ dưới 0,2%**. Tính cả 60 giây ramp thì trung bình toàn lượt là 952,6 req/s |
| **Trần bộ nhớ (memory ceiling)** | **161 MB RSS** — tăng từ 122 MB ở phút đầu rồi **chững hẳn** từ phút thứ 8 (160,9 → 160,9 → 161,0) |
| **Trần CPU** | 100 – 109% của **một** nhân; máy 16 luồng còn thừa khoảng 88% |
| Độ trễ | p95 toàn lượt 8 ms; theo phút đi từ 5 ms lên 11 ms rồi ổn định ở 8–9 ms |
| Tỉ lệ lỗi | 3,51 – 3,58%, **không thay đổi theo thời gian** |

### 8.4 Diễn giải

- **Nút thắt là một nhân CPU**, không phải bộ nhớ và không phải toàn máy. Đây là kết luận nhất quán
  với kịch bản Stress ở mục 6.6.
- **Đường đọc không rò rỉ bộ nhớ.** RSS chững hẳn ở 161 MB và giữ nguyên trong 3 phút cuối. Trái
  ngược hoàn toàn với đường **ghi**: kịch bản Spike cho thấy RSS đi từ 75,0 MB lên đỉnh 119,7 MB
  rồi chỉ về 94,0 MB — **19,0 MB không bao giờ nhả lại** vì biến `userCarts` không có đường xoá
  (PERF-01).
- **Tỉ lệ lỗi đứng yên là dấu hiệu tốt.** 3,57% không đổi suốt 11 phút chứng tỏ không có lỗi nào
  phát sinh do chạy lâu; toàn bộ đến từ BUG-01 vốn có sẵn.
- **p95 tăng nhẹ từ 5 ms lên 11 ms rồi ổn định.** Đây là mức suy giảm chấp nhận được, không phải
  dấu hiệu tích luỹ hỏng hóc.

---

## 9. Review và sửa những gì AI làm sai

*(đề mục 6:92 — "explain why it missed them: prompt quality, model limitations, or characteristics of the endpoint")*

Nhật ký đầy đủ ở `submission/report/AI-Review-Fix-Log.md`, ghi **tại thời điểm phát hiện**. Tóm tắt
5 lỗi và phân loại nguyên nhân:

| # | Lỗi | Hậu quả nếu không bắt được | Nguyên nhân gốc |
|---|---|---|---|
| 1 | `pgrep -f "node server.js"` không neo hai đầu, bắt trúng tiến trình `bash` bao ngoài | 332 mẫu tài nguyên của lượt Load đầu ghi RSS 2,1 MB / CPU 0,0% — sai hoàn toàn | **Đặc điểm môi trường.** Cách viết này đúng ở hầu hết bối cảnh, chỉ hỏng vì lệnh được bọc trong `bash -c`. Đáng trách hơn là AI không tự nghi ngờ: RSS 2,1 MB cho tiến trình Node phục vụ 45 req/s là bất khả thi về mặt vật lý |
| 2 | Đo CPU bằng `ps -o %cpu` | Cột CPU đứng phẳng ở 2,1% suốt lượt chạy — tự tạo ra một lỗi diễn giải metric | **Giới hạn model kiểu mặc định theo thói quen.** `ps -o %cpu` là cách phổ biến nhất, và AI chọn cái phổ biến mà không xét ngữ cảnh đo lường — nơi phân biệt "tức thời" với "trung bình đời sống tiến trình" là bản chất |
| 3 | Nhánh thăm dò lockout không bật Ignore Status | 401/403 là kết quả **mong đợi** nhưng bị JMeter tính là lỗi, thổi phồng error rate của cả kịch bản | **Đặc điểm công cụ.** AI hiểu đúng ý định nghiệp vụ nhưng bỏ qua việc JMeter có **hai tầng phán quyết độc lập**: trạng thái sampler và kết quả assertion |
| 4 | Đề xuất reset lockout bằng `node backend/database.js` | Mất sạch 200 tài khoản + 147 sản phẩm. Đã dính bẫy **hai lần** | **Đọc tài liệu thay vì đọc mã nguồn.** `setup_guide.md` giới thiệu lệnh đó là "reset dữ liệu"; AI chép lại mà không mở file xem nó làm gì. File này vừa là module vừa là script — import nó cũng kích hoạt tác dụng phụ huỷ dữ liệu |
| 5 | Vòng lặp đo CPU của JMeter tự khớp chính nó qua `pgrep -f` | Ghi được `CPU=0%` vô nghĩa, không quy trách được nút thắt | **Tái phát đúng lỗi số 1** dù nó đã nằm trong nhật ký này từ 2 ngày trước |

### Bài học rút ra

Lỗi số 5 là điều đáng suy nghĩ nhất. Nó cho thấy **ghi nhật ký thôi không ngăn được tái phạm** —
nhật ký chỉ có giá trị nếu được đọc lại *trước khi* sinh artifact cùng loại. Đây là giới hạn thật
của cách làm việc với AI, không phải một chi tiết kỹ thuật vặt.

Điểm chung của cả 5 lỗi: AI sinh ra thứ **trông đúng và chạy không báo lỗi**. Không lỗi nào làm
chương trình dừng — chúng chỉ âm thầm cho ra số sai. Nếu chỉ nghiệm thu bằng "chạy được không" thì
cả 5 đều lọt lưới, và báo cáo sẽ đầy những con số bịa mà vẫn trông chuyên nghiệp.

---

## 10. Lỗi phát hiện được

Chi tiết đầy đủ ở `submission/report/Bug-Report.md`. Toàn bộ **13 lỗi** đã được log thành GitHub
Issue kèm ảnh bằng chứng: https://github.com/dinosauce-285/HW05-Software-Testing/issues

| Loại | Số lượng | Issue |
|---|---|---|
| Lỗi chức năng và bảo mật (BUG) | **10** | #1 – #10 |
| Vấn đề hiệu năng (PERF) | **3** | #11 – #13 |

Bốn lỗi nghiêm trọng nhất, đều **chỉ phát hiện được khi gọi thật** chứ không lộ ra khi đọc mã:

| Mã | Lỗi | Cách phát hiện |
|---|---|---|
| BUG-01 | SQL injection ở `?search=` | Dòng CSV chứa dấu nháy đơn → 6 808 lỗi 500 trong lượt ramp |
| BUG-05 | Đặt được đơn 999 999 999 đ từ giỏ **rỗng** | Tái hiện bằng `curl` với tài khoản chưa từng thêm gì vào giỏ |
| BUG-06 | Tạo sản phẩm **không cần token** | Chính `seed-data.js` khai thác điều này để tạo 147 sản phẩm |
| BUG-07 | Đọc trọn đơn hàng người khác, thấy cả địa chỉ giao hàng, **không cần token** | Tạo đơn bằng tài khoản A rồi đọc lại bằng request không có token |

---

## 11. Tổng hợp bằng chứng

| Bằng chứng | Trạng thái | Vị trí |
|---|---|---|
| 3 test plan đúng quy ước `{MSSV}_{Scenario}_{YYYYMMDD}` | ✅ | `plans/` |
| 3 file CSV riêng cho 3 nhóm endpoint | ✅ | `data/` |
| 3 listener khác loại (Summary / Aggregate / View Results Tree) | ✅ | trong từng `.jmx` |
| Log `.jtl` thô, nguyên vẹn — **8 lượt chạy, 1 386 000+ request** | ✅ | `results/raw/` + `MANIFEST.md` (checksum SHA-256) |
| Thư mục HTML dashboard cho mỗi lượt | ✅ | `results/html/` |
| CSV lấy mẫu tài nguyên cho mỗi lượt | ✅ | `evidence/monitor/` |
| 14 ảnh bằng chứng lỗi | ✅ | `evidence/bugs/` |
| 13 GitHub Issue | ✅ | repo bài làm |
| Screenshot JMeter + `htop` **cùng một khung hình** | ⬜ **chưa có** | `evidence/monitor/` |
| Hardware report (ảnh chụp + bảng spec) | ⬜ **chưa có** | `evidence/hardware/` |
| Video demo ≥ 6 phút | ⬜ **chưa có** | — |

Ba mục còn thiếu đều thuộc phần sinh viên trực tiếp thực hiện, không tự động hoá được. Lý do và
hiện trạng ghi ở `Not-Run.md` mục 4.

---

## 12. Kết luận

### Ba con số quan trọng nhất

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| **Ngưỡng chịu đựng ổn định** | **997 req/s** giữ đều 10 phút, trần bộ nhớ **161 MB** | soak 11 phút, 627 943 mẫu |
| **Điểm gãy** | **1 800 người dùng đồng thời**, throughput đỉnh **2 682 req/s** | stress 2 000 luồng, 770 065 mẫu |
| **Khả năng chịu sốc** | Hấp thụ cú vọt **gấp 20 lần**, 0 lỗi, hồi phục **dưới 15 giây** | spike, 17 376 mẫu |

### Nút thắt thật sự

Trong cả ba kịch bản, giới hạn luôn là **một nhân CPU** do Node chạy đơn luồng. Tại điểm gãy, tiến
trình `node` chiếm 102% CPU trong khi cả máy 16 luồng mới dùng khoảng 12%. Bộ nhớ chưa bao giờ là
vấn đề: RSS cao nhất ghi nhận được là 161 MB trên tổng 30 GiB.

Hướng tối ưu có căn cứ nhất, theo thứ tự ưu tiên:

1. **Chạy nhiều tiến trình** qua `cluster` hoặc PM2 — về lý thuyết có thể nhân throughput lên nhiều
   lần vì máy còn thừa 15 luồng CPU
2. **Bật SQLite WAL** để giảm chặn giữa đọc và ghi
3. **Sửa BUG-01** — không phải để tăng tốc mà để loại bỏ 3,57% lỗi nền đang làm nhiễu mọi phép đo

### Điều đáng nói nhất từ bài này

Con số dễ đọc sai nhất không phải con số lớn mà là con số **trông hợp lý**. Throughput 45,1 req/s
của kịch bản Load trông như một giới hạn của server, nhưng thực ra là giới hạn của think-time —
lệch **hơn 20 lần** so với 997 req/s đo được ở soak. Tương tự, error rate 1,29% ở kịch bản Stress
nghe như "server trả lỗi", nhưng phân rã ra thì 88% là request thành công chỉ vì quá chậm.

Muốn không rơi vào những cái bẫy đó thì mọi con số đều phải truy ngược được về `.jtl` thô bằng
lệnh, và phải giải thích được **vì sao nó là con số đó**.

---

*Các mục Task 2 (phân tích bằng AI và săn lỗi diễn giải) và Task 3 (mô hình kiểm thử hiệu năng liên
tục) sẽ được bổ sung vào báo cáo này khi hoàn thành.*
