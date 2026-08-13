# Task 2 — Phân tích bằng AI và săn lỗi diễn giải

*(HW05 mục 6:98-104 · thang điểm mục 15:188 — 10 điểm)*

**Sinh viên thực hiện phần review:** Lý Quốc Thạnh — 23127262

---

## Quy trình ba bước

| Bước | Việc | Ai làm | Trạng thái |
|---|---|---|---|
| 1 | Cho AI phân tích `.jtl` và đề xuất ngưỡng (mục 6:102) | AI | ✅ **xong** — `submission/appendix/AI-Analysis-Raw.md` (bản 13/08/2026, ~5 200 từ) |
| 2 | **Săn chỗ AI đọc sai, kèm giá trị đúng từ `.jtl` thô** (mục 6:103) | **Sinh viên** | ⬜ bảng bên dưới |
| 3 | Phân loại đề xuất tối ưu: feasible / hallucinated (mục 6:104) | **Sinh viên** | ⬜ bảng bên dưới |

### Cách bước 1 được thực hiện

Bản phân tích ở `AI-Analysis-Raw.md` do một phiên AI **độc lập** sinh ra, được cô lập có chủ đích:

- Chỉ được cấp 4 file `.jtl` thô và một mô tả trung lập về hệ thống (Node.js + SQLite, danh sách
  endpoint đã bắn tải, cấu hình máy).
- **Không** được cấp mã nguồn SUT, **không** được cấp báo cáo chính, **không** biết gì về các lỗi
  đã phát hiện trước đó.

Cô lập như vậy để những chỗ AI đọc sai là **lỗi phát sinh tự nhiên**, đúng như tình huống thật khi
một người quăng log cho AI và hỏi "phân tích giúp". Nếu để AI vừa phân tích vừa tự bắt lỗi mình thì
lỗi tìm được sẽ là lỗi dàn dựng, và bài mất ý nghĩa.

---

## Công cụ kiểm chứng

Mọi con số trong cột "Giá trị đúng" phải lấy được bằng lệnh chạy trên `.jtl` **thô**, không lấy từ
`statistics.json` do JMeter sinh sẵn.

```bash
python3 scripts/jtl-stats.py summary  <file.jtl>          # thống kê theo từng sampler
python3 scripts/jtl-stats.py errors   <file.jtl>          # phân rã nguyên nhân lỗi
python3 scripts/jtl-stats.py timeline <file.jtl> [giây]   # diễn biến theo thời gian
python3 scripts/jtl-stats.py threads  <file.jtl> [giây]   # tải đồng thời ↔ độ trễ
python3 scripts/jtl-stats.py steady   <file.jtl> [giây]   # throughput ở trạng thái ổn định
```

Bốn file cần kiểm:

| Kịch bản | File |
|---|---|
| Load | `results/raw/load-20260811T023204Z.jtl` |
| Stress | `results/raw/stress-20260813T003655Z.jtl` |
| Spike | `results/raw/spike-20260813T005423Z.jtl` |
| Soak | `results/raw/soak-20260813T010601Z.jtl` |

Ngoài ra có thể đối chiếu với:

- `evidence/monitor/*.csv` — CPU và RSS của tiến trình backend theo từng giây
- `sut/backend/server.js` — mã nguồn thật của SUT, thứ mà phiên AI kia **không** được nhìn

---

## Bước 2 — Bảng săn lỗi diễn giải

⬜ **Phần này sinh viên tự làm.** Mỗi dòng bắt buộc đủ ba thành phần theo mục 6:103.

| # | AI nói gì (trích nguyên văn) | Giá trị đúng + lệnh lấy ra | Vì sao AI sai |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

**Gợi ý cách rà cho khỏi sót** — với mỗi con số AI đưa ra, tự hỏi ba câu:

1. Con số này lấy từ đâu? Chạy lệnh ra có đúng vậy không?
2. AI **quy nguyên nhân** cho hiện tượng — nguyên nhân đó có kiểm chứng được không, hay chỉ là suy
   đoán nghe hợp lý?
3. Con số này là giới hạn của **hệ thống được đo**, hay là giới hạn của **cách đo**?

Câu hỏi thứ ba là chỗ dễ sai nhất trong kiểm thử hiệu năng.

---

## Bước 3 — Phân loại đề xuất tối ưu

⬜ **Phần này sinh viên tự làm.** Mục 6:104 yêu cầu phân loại **feasible / hallucinated** kèm lý do.

| # | Đề xuất của AI | Phân loại | Lý do |
|---|---|---|---|
| 1 | | ⬜ feasible / hallucinated | |
| 2 | | ⬜ feasible / hallucinated | |
| 3 | | ⬜ feasible / hallucinated | |
| 4 | | ⬜ feasible / hallucinated | |
| 5 | | ⬜ feasible / hallucinated | |

Tiêu chí phân loại gợi ý:

| Xếp là | Khi nào |
|---|---|
| **Feasible** | Áp dụng được vào đúng SUT này, và có căn cứ trong số liệu đo được hoặc trong mã nguồn |
| **Hallucinated** | Đề xuất tối ưu một thứ **không tồn tại** trong hệ thống, hoặc giải quyết một nút thắt **không phải nút thắt thật**, hoặc dẫn số liệu không có trong log |

---

## Bước 4 — Tổng kết

⬜ Điền sau khi hoàn thành bước 2 và 3.

| Chỉ số | Số lượng | Tỉ lệ |
|---|---|---|
| Tổng số nhận định của AI đã kiểm | | |
| Nhận định đúng | | % |
| Nhận định sai / diễn giải nhầm | | % |
| Đề xuất tối ưu — feasible | | % |
| Đề xuất tối ưu — hallucinated | | % |
