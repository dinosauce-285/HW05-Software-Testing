---
name: perf-test-endpoint
description: Thiết kế, chạy và phân tích một kịch bản kiểm thử hiệu năng JMeter (Load / Stress / Spike / Soak) cho một endpoint group. Dùng khi cần đo hiệu năng một API mới, tìm điểm gãy, xác định ngưỡng chịu đựng, hoặc phân tích file .jtl. Bao trọn quy trình: khảo sát endpoint → sinh dữ liệu → dựng test plan → smoke → chạy thật kèm đo tài nguyên → phân tích log thô → dựng bằng chứng.
---

# Kiểm thử hiệu năng một endpoint group

Quy trình 7 bước, đúc kết từ 8 lượt chạy thật trên EShop backend (HW05). Mỗi cảnh báo trong
tài liệu này tương ứng với một lỗi đã thực sự mắc phải và đã sửa — không phải phòng xa lý thuyết.

**Nguyên tắc bao trùm:** không có con số nào được phép xuất hiện trong báo cáo nếu không lôi ra
được từ `.jtl` thô bằng lệnh.

---

## Bước 1 — Khảo sát endpoint bằng request thật

**Không đọc mã nguồn rồi suy ra.** Gọi thật, xem thật.

```bash
curl -s -w '\n<- HTTP %{http_code}  Content-Type: %{content_type}\n' <endpoint>
```

Bốn câu phải trả lời được trước khi viết dòng `.jmx` đầu tiên:

| Câu hỏi | Vì sao quan trọng |
|---|---|
| Endpoint có cần token không? | Cần thì plan phải có setUp Thread Group lấy token — xem bước 4 |
| Body và tên field chính xác? | AI bịa tên field rất nhiều. Chỉ `curl` mới xác nhận được |
| Có cơ chế trạng thái không? (khoá tài khoản, rate limit, session) | Quyết định có phải reset giữa các lượt không |
| Lỗi thì trả gì? JSON hay HTML? | Assertion phải kiểm đúng thứ đó |

⚠️ **Tài liệu của SUT có thể sai.** Đọc mã nguồn để đối chiếu, nhưng lấy kết quả `curl` làm chuẩn.

---

## Bước 2 — Sinh dữ liệu nền

Dữ liệu seed sẵn của SUT gần như luôn **không đủ** cho kiểm thử data-driven.

**Nguyên tắc vàng:** sinh dữ liệu theo cấu trúc biết trước, để **suy ra được kỳ vọng của assertion
từ chính cấu trúc đó** — không suy ngược từ phản hồi của SUT. Suy ngược thì assertion luôn đúng và
mất sạch tác dụng.

Ví dụ: sinh danh mục theo tổ hợp `7 thương hiệu × 3 thế hệ × 7 biến thể` → biết trước từ khoá
`iPhone` phải trả về đúng 21 kết quả → cột `expect_min_count` trong CSV có căn cứ.

---

## Bước 3 — Sinh CSV, mỗi endpoint group một file riêng

Cột `expect_*` cho phép assertion đọc kỳ vọng **từ dữ liệu** thay vì hard-code trong plan:

```csv
search_term,expect_min_count,expect_code,note
iPhone,21,200,tu khoa khop
O'Neill,0,200,dau nhay don - du kien lo loi SQL injection
```

**Luôn chèn vài dòng dữ liệu độc**: dấu nháy đơn, chuỗi rỗng, ký tự Unicode, giá trị vượt biên.
Chính dòng `O'Neill` ở trên đã phát hiện lỗ SQL injection trong SUT.

---

## Bước 4 — Dựng test plan `.jmx`

Đọc `references/jmx-template.md` để lấy khung XML và danh sách bẫy.

### Năm bất biến, kiểm ở mọi lần đụng vào plan

| Bất biến | Vì sao |
|---|---|
| Mỗi endpoint group một **CSV riêng** | Dùng chung một file là sai yêu cầu data-driven |
| Ba plan dùng **ba listener khác loại** | Summary Report / Aggregate Report / View Results Tree |
| Tên file `{StudentID}_{Scenario}_{YYYYMMDD}` | Ngày **tạo plan**, không phải ngày nộp |
| Think-time và ramp-up **giải thích được bằng lời** | "AI đề xuất 100 thread" không phải lý do |
| **≥ 3 loại assertion khác nhau**, không chỉ kiểm mã 200 | Lỗi 500 vẫn "nhanh" nếu chỉ đo thời gian |

### Tham số theo từng loại kịch bản

| Kịch bản | Thread | Ramp-up | Think-time | Mẹo |
|---|---|---|---|---|
| **Load** | Mức "ngày thường" | Dài, đều | 800 ms ± 200 | Cao hơn thì thành stress |
| **Stress** | Cao, tăng tuyến tính | **1 thread/giây** | 300 ms ± 100 | Ramp 1/giây biến trục thời gian thành trục tải — giây thứ N có đúng N người dùng |
| **Spike** | Nền thấp + cú vọt gấp 10-30 lần | Cú vọt ramp **≤ 5 giây** | 1000 ms ± 300 | **Hai Thread Group tách biệt**, nếu gộp thì không đo được hồi phục |
| **Soak** | ~80% mức bão hoà | Ngắn | như Load | 10-15 phút, cần đo cả RSS |

### Ba bẫy đã mắc phải

**Bẫy 1 — Phản hồi lỗi mong đợi bị tính là lỗi.** Nếu kịch bản có nhánh negative (401/403/404 là
kết quả **đúng**), JMeter vẫn đánh sample là thất bại vì mặc định coi mọi 4xx là lỗi — assertion
pass cũng không ghi đè được. Phải bật **Ignore Status** (`Assertion.assume_success = true`) **chỉ
trên nhánh đó**, giữ `false` ở nhánh chính.

**Bẫy 2 — Trộn nhánh nhanh giả tạo vào luồng chính.** Ví dụ phản hồi "tài khoản đã khoá" trả rất
nhanh vì bỏ qua bước so mật khẩu. Trộn chung sẽ kéo throughput đẹp lên một cách giả tạo. Tách bằng
**If Controller** theo cột nhãn trong CSV, hai sampler riêng.

**Bẫy 3 — Đăng nhập lại trong mỗi vòng lặp.** Làm vậy thì số liệu nhóm transactional bị trộn với
nhóm auth. Dùng **setUp Thread Group** lấy sẵn N token vào properties, luồng chính lấy theo
`ctx.getThreadNum() % N`.

---

## Bước 5 — Smoke trước, chạy thật sau

**Luôn** chạy thử quy mô nhỏ trước. Một plan sai cấu hình mà chạy thẳng 10 phút là mất 10 phút.

```bash
source env.sh
cd plans && jmeter -n -t <plan>.jmx -Jthreads=6 -Jrampup=3 -Jduration=15 \
  -l /tmp/smoke.jtl
awk -F',' 'NR>1{print $3", HTTP "$4", success="$8}' /tmp/smoke.jtl | sort | uniq -c
```

Kiểm ba điều: mọi sampler có chạy không · mã phản hồi có đúng kỳ vọng không · có sample nào
`success=false` ngoài ý muốn không.

Muốn xem **assertion nào** trượt thì chạy lại với output XML:

```bash
jmeter -n -t <plan>.jmx ... \
  -Jjmeter.save.saveservice.output_format=xml \
  -Jjmeter.save.saveservice.assertion_results=all -l /tmp/smoke.xml
```

---

## Bước 6 — Chạy thật kèm đo tài nguyên

```bash
# 1. đưa hệ thống về trạng thái sạch
./scripts/reset-db.sh              # hoặc reset-lockout.js nếu chỉ cần mở khoá

# 2. bật đo tài nguyên nền
TS=$(date -u +%Y%m%dT%H%M%SZ)
./scripts/monitor.sh "evidence/monitor/<scenario>-${TS}-resource.csv" 1 &

# 3. chạy — một lệnh ra cả log thô lẫn dashboard
source env.sh && cd plans && jmeter -n -t <plan>.jmx \
  -l "../results/raw/<scenario>-${TS}.jtl" \
  -e -o "../results/html/<scenario>-${TS}/"

pkill -f monitor.sh
```

Thư mục `-o` phải **chưa tồn tại** → mỗi lượt tự nhiên có thư mục riêng, không ghi đè.

### Hai lỗi đo lường đã mắc phải

**Đo CPU bằng `ps -o %cpu` là sai.** Đó là trung bình cộng dồn **từ lúc tiến trình khởi động**, nên
một đợt bắn tải 5 phút bị pha loãng bởi thời gian rảnh trước đó — cột CPU sẽ đứng phẳng ở một con số
vô nghĩa. Phải đọc `utime + stime` từ `/proc/<pid>/stat` và lấy hiệu giữa hai lần lấy mẫu.

**`pgrep -f "node server.js"` không neo hai đầu sẽ bắt nhầm tiến trình `bash` bao ngoài** — dòng
lệnh của nó có chứa chính chuỗi đó. Dùng `pgrep -f '^node server\.js$'`, và thêm chốt chặn từ chối
PID nào có RSS nhỏ bất thường.

⚠️ Lỗi này **tái phát** ở một script khác sau khi đã ghi vào nhật ký. Đọc lại nhật ký trước khi viết
bất kỳ lệnh `pgrep` nào.

### Thu đủ bằng chứng ngay lúc đó, không dựng lại sau

`.jtl` thô · thư mục HTML · **screenshot công cụ và resource monitor CÙNG MỘT KHUNG HÌNH** ·
báo cáo phần cứng. Lượt chạy đã kết thúc thì không chụp lại được.

---

## Bước 7 — Phân tích log thô

Đọc `references/analysis-playbook.md` để lấy danh sách lỗi diễn giải thường gặp.

```bash
python3 scripts/jtl-stats.py summary  <file.jtl>          # thống kê theo sampler
python3 scripts/jtl-stats.py errors   <file.jtl>          # phân rã nguyên nhân lỗi
python3 scripts/jtl-stats.py timeline <file.jtl> [giây]   # diễn biến theo thời gian
python3 scripts/jtl-stats.py threads  <file.jtl> [giây]   # tải đồng thời ↔ độ trễ
python3 scripts/jtl-stats.py steady   <file.jtl> [giây]   # throughput trạng thái ổn định
```

**Luôn tính từ `.jtl` thô, không đọc `statistics.json`** do JMeter sinh — vì con số trong báo cáo
phải truy ngược được về log gốc.

### Ba câu hỏi bắt buộc với mỗi con số

1. Chạy lệnh ra có đúng con số đó không?
2. Nguyên nhân được quy có kiểm chứng được không, hay chỉ là suy đoán nghe hợp lý?
3. **Đây là giới hạn của hệ thống được đo, hay giới hạn của cách đo?**

Câu 3 là chỗ sai nhiều nhất. Ví dụ thật: kịch bản Load đo được 45 req/s — nhưng đó là giới hạn của
**think-time** (50 luồng ÷ 1,6 giây mỗi vòng), không phải của server. Soak trên cùng endpoint đó
đo được **997 req/s**, lệch hơn 20 lần.

---

## Danh sách kiểm cuối

- [ ] Endpoint đã gọi thật bằng `curl`, không suy từ code
- [ ] CSV riêng cho endpoint group này, có cột `expect_*` và vài dòng dữ liệu độc
- [ ] Plan có ≥ 3 loại assertion, think-time và ramp-up giải thích được bằng lời
- [ ] Đã smoke trước khi chạy thật
- [ ] Đã reset trạng thái trước lượt chạy
- [ ] `.jtl` thô + thư mục HTML + CSV tài nguyên đủ cả ba
- [ ] Screenshot công cụ + resource monitor chung một khung hình
- [ ] Mọi con số trong báo cáo lôi ra được bằng lệnh từ `.jtl` thô
- [ ] Đã phân biệt rõ **lỗi chức năng** với **vấn đề hiệu năng**
