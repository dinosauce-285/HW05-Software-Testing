# HW05 — Performance Testing (EShop)

| | |
|---|---|
| **Sinh viên** | Lý Quốc Thạnh |
| **MSSV** | 23127262 |
| **Repo** | https://github.com/dinosauce-285/HW05-Software-Testing |
| **SUT** | EShop backend API — `http://localhost:3000` |
| **Công cụ** | Apache JMeter 5.6.3 (non-GUI) + `htop` / `/proc` sampling |
| **Máy chạy** | `qt-ThinkBook-14-G5-IRH`, 16 nhân, 31 GB RAM, Ubuntu 26.04 |

---

## 1. Test Summary Report

*(đề mục 14:177 — "scenarios run; endpoint groups covered; the endurance threshold (with numbers); number of bugs / performance issues; and the demo video link")*

### Kịch bản đã chạy và nhóm endpoint đã phủ

| Kịch bản | Nhóm endpoint | Endpoint | Listener | CSV riêng | Test plan |
|---|---|---|---|---|---|
| **Load** | Read-heavy | `GET /api/products` + `?search=` | Summary Report | `data/products.csv` | `23127262_Load_20260811.jmx` |
| **Stress** | Auth-heavy | `POST /api/login` | Aggregate Report | `data/credentials.csv` | `23127262_Stress_20260813.jmx` |
| **Spike** | Transactional | `POST /api/cart` → `POST /api/checkout` | View Results Tree | `data/orders.csv` | `23127262_Spike_20260813.jmx` |

Ba nhóm phủ hết, không trùng nhau; ba listener khác loại; ba file CSV riêng biệt.
**Mọi phân vị tính từ `.jtl` thô** — dashboard HTML của JMeter chỉ tính trên 20 000 mẫu cuối nên sai
tới 7,1 lần ở lượt Stress (xem `Task2-Misinterpretation-Hunt.md` mục B1).
Tổng cộng **8 lượt chạy**, **1 386 000+ request thật**, toàn bộ `.jtl` thô giữ nguyên vẹn
(danh mục + checksum ở `results/raw/MANIFEST.md`).

### Kết quả từng kịch bản

| Kịch bản | Cấu hình | Mẫu | p95 | Lỗi | Kết luận |
|---|---|---|---|---|---|
| Load | 50 luồng, ramp 60 s, 5 phút | 13 483 | 2 ms | 3,56% | Tải ngày thường không gây áp lực; toàn bộ lỗi đến từ BUG-01 |
| Stress | 2 000 luồng, ramp 250 s | 770 065 | 237 ms | 1,29% | **Gãy ở 1 800 luồng đồng thời** |
| Spike | nền 20 → vọt 400 (5 s) → rút | 17 376 | 6 ms | **0%** | Hấp thụ trọn cú vọt gấp 20 lần, hồi phục **dưới 1 giây** |

### Ngưỡng chịu đựng (endurance threshold) — bằng số

Soak **11 phút** ở 1 000 người dùng đồng thời trên nhóm read-heavy
(`soak-20260813T010601Z.jtl`, 627 943 mẫu):

| Chỉ số | Giá trị đo được |
|---|---|
| **Max stable RPS** | **997 req/s** ở trạng thái ổn định, giữ đều suốt 10 phút (dao động 996,1 – 997,8, biên độ dưới 0,2%). Tính cả 60 s ramp thì trung bình toàn lượt là 952,6 req/s |
| **Trần bộ nhớ (memory ceiling)** | **161 MB RSS** — tăng từ 122 MB rồi **chững hẳn** từ phút thứ 8 |
| Trần CPU | ~100–109% của **một** nhân — Node đơn luồng bão hoà, máy 16 nhân còn thừa |
| p95 theo thời gian | 5 ms (phút 1) → 11 ms (phút 5) → ổn định 8–9 ms |
| Tỉ lệ lỗi | 3,51–3,58%, **không đổi theo thời gian** → không có lỗi phát sinh do chạy lâu |

**Diễn giải:** nút thắt là **một nhân CPU**, không phải bộ nhớ và không phải toàn máy. RSS chững
lại ở 161 MB chứng tỏ đường đọc **không rò rỉ bộ nhớ** — khác hẳn đường ghi, nơi `userCarts`
không bao giờ được dọn (PERF-01).

### Số lỗi

| Loại | Số lượng | Nơi ghi |
|---|---|---|
| Lỗi chức năng / bảo mật (BUG) | **10** | `submission/report/Bug-Report.md` mục A |
| Vấn đề hiệu năng (PERF) | **3** | `submission/report/Bug-Report.md` mục B |
| GitHub Issue đã tạo | **13** ✅ | [`#1` … `#13`](https://github.com/dinosauce-285/HW05-Software-Testing/issues) — mỗi issue có ảnh bằng chứng |

### Video demo

| | |
|---|---|
| Video Task 1 (≥ 6 phút) | `<điền>` ⬜ |
| Video Agent Skill | `<điền>` ⬜ |

---

## 2. Bảng tự đánh giá

*(mẫu ở đề mục 15:183-191)*

| No. | Tiêu chí | Điểm | Tự chấm |
|---|---|---|---|
| 1 | Task 1 — Load testing | 20 | |
| 2 | Task 1 — Stress testing | 20 | |
| 3 | Task 1 — Spike testing | 20 | |
| 4 | Task 2 — AI analysis + misinterpretation hunt | 10 | |
| 5 | Task 3 — Continuous Performance Testing proposal | 10 | |
| 6 | Agent Skills | 10 | |
| | **Tổng** | **100** | |

> Cột tự chấm để trống cho tới khi hoàn tất Task 2, Task 3, Agent Skill và bộ bằng chứng
> screenshot/video — chấm khi chưa xong sẽ là con số bịa.

---

## 3. Cấu trúc thư mục

```
hw05/
├── plans/          3 test plan .jmx đúng quy ước {MSSV}_{Scenario}_{YYYYMMDD}
├── data/           products.csv | credentials.csv | orders.csv — mỗi nhóm một file
├── scripts/        seed-data | gen-csv | monitor | reset-lockout | reset-db | count-orders
├── results/
│   ├── raw/        *.jtl thô + MANIFEST.md (checksum sha256)
│   └── html/       dashboard HTML mỗi lượt chạy
├── evidence/
│   ├── monitor/    CSV lấy mẫu CPU/RSS của tiến trình backend
│   ├── bugs/       14 ảnh bằng chứng đính vào GitHub Issue
│   ├── diagrams/   flow chart Task 3 (PNG)
│   └── hardware/   ⬜ screenfetch + bảng spec
└── submission/
    ├── report/     Main-Report | Bug-Report | AI-Review-Fix-Log | Not-Run
    │                Task2-Misinterpretation-Hunt | Task3-Continuous-Performance-Testing
    └── appendix/   ⬜ AI-Audit-Report | AI-Prompt-Log | AI-Critique | git-log.txt
```

---

## 4. Cách chạy lại

```bash
source env.sh                      # nạp JDK + JMeter portable trong tools/
./scripts/reset-db.sh              # xoá DB, seed lại 147 sản phẩm + 210 tài khoản
node scripts/gen-csv.js            # sinh lại 3 file CSV

cd plans && jmeter -n -t 23127262_Load_20260811.jmx \
  -l ../results/raw/load-<ISO>.jtl -e -o ../results/html/load-<ISO>/
```

⚠️ **Không dùng `node sut/backend/database.js`** để reset — file đó gọi `DROP TABLE` ngay khi
được import (BUG-04), mất sạch dữ liệu seed. Dùng `scripts/reset-lockout.js` nếu chỉ cần mở khoá
tài khoản giữa các lượt chạy Stress.

---

## 5. Còn phải làm

| Hạng mục | Trạng thái |
|---|---|
| Task 1 — 3 kịch bản + endurance | ✅ |
| Screenshot JMeter + htop cùng khung hình | ⬜ phải chạy lại một lượt để chụp |
| Hardware report + hostname khớp HW04 | ⬜ |
| GitHub Issues cho 13 lỗi + ảnh bằng chứng | ✅ |
| Task 2 — bước 1 (AI phân tích) | ✅ |
| Task 2 — bước 2, 3 (săn lỗi + phân loại) | ⬜ sinh viên tự làm |
| Task 3 — Continuous Performance Testing + flow chart | ✅ |
| Agent Skill + video demo | ⬜ |
| Main-Report (Task 1) | ✅ — Task 2/3 bổ sung sau |
| AI Audit Report + AI Critique | ⬜ |
| Video Task 1 ≥ 6 phút | ⬜ |
