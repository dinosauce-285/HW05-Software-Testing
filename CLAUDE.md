# CLAUDE.md - Hướng dẫn làm việc (HW05 / Performance Testing)

Đọc file này đầu mỗi phiên. Các quy tắc ở mục 2 phải **tự động áp dụng**, không cần được nhắc.

---

## 1. Biến - không được đoán

| Trường | Giá trị |
|---|---|
| MSSV | `23127262` |
| Họ tên | `Lý Quốc Thạnh` |
| Email MSSV | `23127262@student.hcmus.edu.vn` |
| Repo bài làm (public) | `https://github.com/dinosauce-285/HW05-Software-Testing` - remote `origin`, branch `main` |
| Công cụ đo hiệu năng | **JMeter** chế độ non-GUI (`jmeter -n -t ... -l ... -e -o ...`) |
| Resource monitor | `htop` (đề mục 8:121) |
| SUT - mã nguồn | `sut/` - clone từ `https://github.com/ttbhanh/eshop-sut`, gitignore, **không commit** |
| SUT - backend API | `http://localhost:3000` / `node backend/server.js` - đây là đối tượng bắn tải (đề mục 5:72) |
| Reset dữ liệu | `node backend/database.js` |
| Tài khoản admin | `admin@eshop.com` / `Admin123!` - **không phải** `admin123` như `setup_guide.md` ghi |
| Tài khoản user | `test@eshop.com` / `Test1234!` |
| Ngôn ngữ báo cáo | Tiếng Việt; tên test plan / file theo quy ước tiếng Anh của đề |
| Định dạng test data | **CSV** - `data/*.csv`, nạp bằng CSV Data Set Config của JMeter |
| YouTube Task 1 (demo ≥6 phút) | `<điền>` (unlisted) |
| YouTube Agent Skill | `<điền>` (unlisted) |
| Self-assessed grade | `<điền>` -> file nộp `23127262_HW05_AI_Performance_<grade>.zip` |

Khi còn `<điền>` mà cần dùng -> **hỏi**, không tự suy ra, không dùng giá trị ví dụ.

### Ma trận scenario x endpoint group (đã chốt)

Đề mục 6:88 bắt ghép 1-1: mỗi scenario bắn đúng một nhóm, ba nhóm phủ hết, không trùng.

| Scenario | Endpoint group | Endpoint dự kiến [!] | Lý do ghép (phải viết vào báo cáo chính) |
|---|---|---|---|
| **Load** | Read-heavy | `GET /api/products` (list + search) | API chỉ đọc, nhẹ, giữ tải đều lâu được -> đo ra ngưỡng chịu đựng bằng số cụ thể cho mục 6:94 |
| **Stress** | Auth-heavy | `POST /api/auth/login` | Ép tới gãy sẽ kích hoạt khoá tài khoản 3-lần-sai - đúng thứ mục 6:93 đòi mô tả quy trình reset |
| **Spike** | Transactional | `POST /api/orders` (add-to-cart -> checkout) | Burst đột ngột mô phỏng flash-sale; nhánh ghi DB dễ lộ bug thật cho mục 6:96 |

**[!] Đường dẫn endpoint và payload ở bảng trên CHƯA đối chiếu với mã nguồn SUT** - `sut/` chưa clone về máy tại thời điểm viết file này.
- [ ] Clone SUT, đọc `backend/routes/*` xác nhận path, method, body, mã lỗi
- [ ] Sửa lại bảng trên nếu lệch, rồi mới viết `.jmx` đầu tiên

**Không trùng với thành viên nhóm** (đề mục 5:78 - *"no two members may test the same endpoint / workflow"*):
- [ ] Đối chiếu với nhóm và ghi kết quả vào báo cáo chính

### Ba report view - mỗi plan một loại, không lặp

Đề mục 6:90 - *"use three distinct listener / report types... do not repeat a type"*.

| Plan | Listener |
|---|---|
| Load (read-heavy) | Summary Report |
| Stress (auth-heavy) | Aggregate Report |
| Spike (transactional) | View Results Tree |

Đổi listener của một plan -> phải kiểm lại cả ba vẫn khác nhau.

### Quy ước tên file test plan

Đề mục 6:91 + mục 11:148 (TA verify trực tiếp): `{StudentID}_{ScenarioType}_{YYYYMMDD}`

```
23127262_Load_YYYYMMDD.jmx
23127262_Stress_YYYYMMDD.jmx
23127262_Spike_YYYYMMDD.jmx
```

`YYYYMMDD` là ngày tạo plan đó, không phải ngày nộp. Sai định dạng tên = sai mục Anti-AI-Cheat.

### Cấu trúc thư mục

```
hw05/
├── plans/          # *.jmx theo quy ước tên trên
├── data/           # products.csv | credentials.csv | orders.csv - mỗi group một file riêng
├── results/
│   ├── raw/        # *.jtl thô, nộp NGUYÊN VẸN (mục 11:149)
│   └── html/       # <scenario>-<ISO-timestamp>/ - dashboard sinh bởi -e -o
├── evidence/
│   ├── monitor/    # screenshot JMeter + htop CÙNG KHUNG HÌNH
│   └── hardware/   # screenfetch/dxdiag + bảng spec
├── submission/
│   ├── report/     # Main-Report.md | Bug-Report.md | AI-Review-Fix-Log.md | Not-Run.md
│   ├── appendix/   # AI-Audit-Report.md | AI-Prompt-Log.md | AI-Critique.md | git-log.txt
│   └── README.md   # bảng tự đánh giá + test summary (mục 14:177)
└── .claude/skills/ # Agent Skill (mục 7:112)
```

Chọn JMeter vì đề gọi là default (mục 8:119) và ba thứ đề đòi - `.jtl` thô, 3 listener khác loại, thư mục HTML report - đều là native. Chữ "bonus" của k6 ở mục 8:119 **không có dòng nào chống lưng trong thang điểm mục 15**, tổng vẫn chốt 100. Đổi sang k6 thì phải viết lại R5 và R8.

---

## 2. Quy tắc thường trực

### R1 - AI Audit Log tự động, không chen vào flow
*(HW05 mục 9:125-136 / mục 2:22 / Policies - "AI Disclosure":7)*

Mỗi tương tác AI phải được lưu: **tên công cụ / ngày giờ / prompt nguyên văn / output**.

**Không ghi tay từng lượt.** Transcript đầy đủ nằm ở `~/.claude/projects/-home-qt-projects-hw05/*.jsonl`. Cơ chế:
- **Chính** - Stop hook tự trích xuất khi kết thúc phiên, append vào `submission/appendix/AI-Prompt-Log.md` (nhật ký nguyên văn theo lượt).
- **Dự phòng** - skill `/log-ai`, gọi tay khi phiên bị ngắt đột ngột hoặc cần lọc lại.

`submission/appendix/AI-Audit-Report.md` bám **đúng mẫu 6 mục** của `[AI-02] - FIT@HCMUS - AI Audit Report_Vn.docx.md`, cập nhật tay:

| Mục mẫu | Nội dung |
|---|---|
| 1 | Thông tin sinh viên - điền từ bảng mục 1 trên |
| 2 | Hướng dẫn - giữ nguyên |
| 3 | Bảng audit, **1 hàng / artifact**: `Prompt + Công cụ` \| `Output AI` \| `Verdict` \| `Lý do (dẫn ISTQB/slide/RFC)` \| `Bản SV sửa` |
| 4 | Tổng kết độ chính xác - đếm VALID / INVALID / INCOMPLETE + tỉ lệ % |
| 5 | Kết luận **80-150 chữ** - đếm trước khi chốt |
| 6 | Mandatory Disclosure - **dán nguyên văn**, không diễn đạt lại |

Artifact ở đây = mỗi `.jmx`, mỗi file CSV, mỗi phân tích `.jtl`, mỗi bản đề xuất tối ưu, sơ đồ CPT. **Xoá hàng mẫu in nghiêng trước khi nộp.**

Đề khuyến khích đúng cách này: *"you are encouraged to create a skill or rule that extracts the information above automatically after an AI session"* (mục 9:136).
*Thiếu tài liệu bắt buộc -> 0 điểm (mục 17:204).*

### R2 - Commit theo từng bước
*(HW05 mục 12:155 - "Create a new Git commit for each step of the procedure (for example: each scenario's test plan, the AI analysis, and the continuous-testing proposal)" / Policies:22)*

Xong một bước có ý nghĩa (một `.jmx` chạy được, một file CSV, một lần chạy có `.jtl`, một lần sửa plan sau review, phần phân tích AI, sơ đồ CPT) -> **commit ngay, không hỏi**. Báo lại commit message trong câu trả lời.

**Định dạng bắt buộc - Conventional Commits, viết bằng tiếng Anh:**
```
<type>(<scope>): <mô tả ngắn, thức mệnh lệnh, không viết hoa đầu, không dấu chấm cuối>
```
- `type` thuộc `feat` / `fix` / `docs` / `chore` / `refactor` / `test` / `perf`
- `scope` thuộc `load` / `stress` / `spike` / `soak` / `data` / `config` / `analysis` / `cpt` / `report` / `skill` / `appendix` / `repo`
- Ví dụ: `test(stress): add auth-heavy plan with lockout-aware ramp-up`

**KHÔNG kèm trailer `Co-Authored-By`** - bài nộp phải đứng tên sinh viên; việc dùng AI đã khai ở AI Audit Report (R1).

### R3 - Xuất Git commit log trước khi nộp
*(HW05 mục 12:156 / mục 14:175 - "Git commit log (text file)")*

```bash
git log --pretty=format:'%h | %ad | %s' --date=iso > submission/appendix/git-log.txt
```

### R4 - Nhật ký review & fix AI
*(HW05 mục 6:92 / mục 2:21)*

*"Report what the AI got wrong or missed - for example, unrealistic ramp-up or think-time, wrong thread counts, weak assertions, or missing account-lockout handling - and explain **why** it missed them (prompt quality, model limitations, or characteristics of the endpoint)."*

**Mỗi lần sửa artifact do AI sinh ra** -> thêm ngay một dòng vào `submission/report/AI-Review-Fix-Log.md`:

| Scenario | File:vị trí | AI sinh gì | Sai chỗ nào | Mình sửa thành | **Vì sao AI trượt** |

Ghi tại thời điểm sửa, không gom cuối bài - cột "vì sao" không dựng lại được sau. Đây là phần Analyse (G9.3) và ăn thẳng vào 3x20 điểm của Task 1.

Bốn thứ AI hay sai ở đúng bài này, kiểm trước khi nhận plan:
1. **Ramp-up phi thực tế** - 500 thread trong 1 giây trên máy cá nhân là tự bóp JMeter, không phải đo SUT
2. **Thiếu think-time** - user thật không bắn request liên tiếp 0ms; thiếu nó thì số RPS vô nghĩa
3. **Không có assertion** - plan chỉ đo thời gian mà không kiểm response đúng -> lỗi 500 vẫn tính là "nhanh"
4. **Bỏ qua lockout** - plan auth-heavy không xử lý khoá tài khoản 3-lần-sai thì chạy được 3 vòng là hỏng dữ liệu

### R5 - Bằng chứng thu ngay sau mỗi lần chạy
*(HW05 mục 6:93 / mục 11:144-151 / mục 14:171-172)*

Chạy xong một scenario -> thu **đủ 4 thứ ngay lúc đó**, không dựng lại sau:

| Bằng chứng | Nơi lưu | Trích đề |
|---|---|---|
| `.jtl` thô, **nguyên vẹn** | `results/raw/` | *"The raw .jtl log files, attached in full - not only the summary"* (11:149) |
| Thư mục HTML dashboard | `results/html/<scenario>-<ISO-timestamp>/` | 14:171 |
| Screenshot JMeter **+ htop cùng một khung hình** | `evidence/monitor/` | *"a screenshot of the tool together with the backend process's resource usage"* (6:93) |
| Hardware report: screenfetch/dxdiag + bảng spec | `evidence/hardware/` | 6:93 |

Lệnh chuẩn - một phát ra cả log thô lẫn dashboard, không ghi đè lượt trước:
```bash
jmeter -n -t plans/23127262_Load_YYYYMMDD.jmx \
       -l results/raw/load-<ISO>.jtl \
       -e -o results/html/load-<ISO>/
```
Thư mục `-o` phải **chưa tồn tại**, nên mỗi lượt chạy tự nhiên có thư mục riêng - đừng dùng lại tên cũ.

**Hostname phải khớp HW04** - mục 11:151: *"The hardware report, whose hostname matches your previous homework deployments."* Chụp kèm `hostname` (và `whoami`) trong screenshot phần cứng.

*TA verify trực tiếp phần này (mục 11) - chỉnh tay `.jtl` hoặc HTML là gian lận.*

### R6 - Bug -> cả Markdown lẫn GitHub Issues
*(HW05 mục 6:96 / mục 14:176)*

*"Log any genuine bugs or performance issues (error responses, crashes, functional regressions) on your GitHub Issues page with screenshots."*

Thấy lỗi thật (5xx, backend chết, dữ liệu sai sau khi chạy tải) -> làm đủ 3 việc ngay lúc phát hiện:
1. Thêm dòng vào `submission/report/Bug-Report.md`
2. Tạo GitHub Issue trên repo bài làm
3. Đính screenshot vào issue - chụp ngay lúc thấy

Số bug trong Markdown phải **khớp** số issue trên GitHub.

Latency cao / error rate tăng: đề ghi *"encouraged but not penalised if absent"* - vẫn nên log, nhưng phân loại rõ là **performance issue**, không trộn với **functional bug**.

### R7 - Phần không chạy được -> ghi lý do ngay
*(HW05 mục 2:24 - "Quality over completion" / mục 6:93 - "Run as completely as possible")*

Bỏ scenario, hạ thread count vì máy không kham, không dựng được endurance test đủ 15 phút, không bắn được endpoint nào -> ghi ngay vào `submission/report/Not-Run.md` kèm lý do kỹ thuật và số liệu chứng minh (RAM đầy, JMeter tự nghẽn...). Không để trống rồi giải thích sau.

### R8 - Bất biến khi viết hoặc sửa test plan
*(HW05 mục 6:89-91)*

Kiểm 5 điều này ở **mọi** lần đụng vào `.jmx`, kể cả sửa vặt:

| Bất biến | Trích / nguồn |
|---|---|
| Mỗi endpoint group có **CSV riêng** | *"Each endpoint group must have its own CSV input file... A single shared CSV is not sufficient"* (6:89) |
| Ba listener **khác loại** giữa ba plan | *"do not repeat a type"* (6:90) |
| Tên file đúng `{StudentID}_{ScenarioType}_{YYYYMMDD}` | 6:91 + 11:148 |
| Có think-time và ramp-up **giải thích được** | *"realistic parameters (think-time, ramp-up, thread / virtual-user counts)"* (6:88) |
| Có assertion trên response, không chỉ đo thời gian | 6:92 liệt "weak assertions" là lỗi điển hình |

Sửa plan làm rụng assertion, gộp CSV, hay trùng listener -> chặn lại, không im lặng đi tiếp.

**Tham số phải giải thích được bằng lời, không phải số đẹp.** Mỗi lần đặt thread count / ramp-up / think-time -> viết ngay một câu vì sao vào báo cáo chính. "AI đề xuất 100 thread" không phải lý do.

### R9 - Giữ README đúng
*(HW05 mục 14:177)*

`submission/README.md` phải có bảng tự đánh giá (mẫu mục 15) + test summary gồm: *"scenarios run; endpoint groups covered; the endurance threshold (with numbers); number of bugs / performance issues; and the demo video link."*
Con số nào đổi -> cập nhật README ngay trong cùng phiên.
*mục 17:204 - thiếu bất kỳ tài liệu bắt buộc nào -> 0 điểm.*

### R10 - Đánh dấu phần chưa chạy thật
*(HW05 mục 2:21 - "submitting the raw AI output without review is not acceptable")*

`.jmx`, endpoint path, payload, hay CSV sinh ra mà **chưa bắn thật vào backend EShop** phải có [!] và ô [ ] để verify. Nói rõ trong câu trả lời, không im lặng.
AI bịa đường dẫn API và tên field rất nhiều - một plan "trông đúng" mà chưa chạy thì chưa tính là xong.

### R11 - Mọi con số phải truy ngược được về `.jtl`
*(HW05 mục 6:103 - "cite the correct value from your raw .jtl log" / mục 15:188)*

Đây là quy tắc ăn điểm của Task 2. Không được viết vào báo cáo bất kỳ con số nào (p95, throughput, error rate, response time) mà không lôi ra được từ `.jtl` bằng lệnh. Số do AI đọc log rồi kể lại -> **kiểm bằng tay trước khi tin**, vì mục 6:103 bắt chỉ ra chính chỗ AI đọc sai.

Ngoài ra: số scenario / endpoint group / ngưỡng endurance / bug xuất hiện ở README, báo cáo chính, và AI Audit Report. Một con số đổi -> cập nhật **đồng thời** mọi nơi, và **đếm lại bằng lệnh**, không tin trí nhớ.

### R12 - Bồi Agent Skill dần
*(HW05 mục 7:112-113; thang điểm mục 15:190 chấm **10 điểm**)*

Làm xong scenario Load -> chắt quy trình vừa dùng (sinh plan -> nạp CSV -> chạy non-GUI -> phân tích `.jtl` -> dựng báo cáo) thành `.claude/skills/`. Stress và Spike dùng lại skill đó và tinh chỉnh. Gom vào cuối bài thì skill sẽ rỗng và video demo không có gì để quay.

### R13 - Lockout: reset giữa các lượt, và ghi lại quy trình
*(HW05 mục 6:93)*

*"When Stress/Spike runs trigger the 3-fail login lockout, reset it between runs and document the steps."*

Plan auth-heavy sẽ tự làm khoá tài khoản. Mỗi lần chạy xong:
1. Reset trạng thái khoá (qua `node backend/database.js` hoặc thao tác DB - **ghi lại chính xác lệnh đã dùng**)
2. Chép các bước đó vào báo cáo chính, không viết chung chung "đã reset"
3. Chạy lượt sau từ trạng thái sạch - nếu không, số liệu lượt sau là số của tài khoản đã bị khoá, vô nghĩa

Đây là điểm chấm riêng, không phải chi tiết vặt.

---

## 3. Việc người dùng tự làm - không đụng vào

Xuất PDF / quay video / đóng gói zip (nén, split, đặt tên) / chụp screenshot màn hình.

Không làm hộ, không tự nhắc mỗi phiên. Chỉ trả lời khi được hỏi thẳng.

---

## 4. Ràng buộc khi tạo nội dung

**Chung**
- Bài làm viết bằng **Markdown**, kèm bản PDF (mục 2:23 / Policies - "PDF Copies":16).
- **AI-first, từng bước** - cấm một prompt kiểu *"run a load test and tell me whether the performance is good"* (mục 2:20). Quy trình phải chia bước: chọn endpoint -> chọn tham số -> sinh CSV -> sinh `.jmx` -> review & sửa -> chạy -> phân tích. Chính AI Audit Log là bằng chứng cho việc này.
- Ba endpoint group không trùng với thành viên nhóm (mục 5:78).
- File thật phải nằm trong zip - *"Misuse or over-reliance on online links... will result in a score of zero"* (Policies:42).
- **Cấm chép prompt của bạn khác** - mục 17:205: copying *including prompts* -> 0 điểm cả hai bên.

**Task 1 (60đ = 20 Load + 20 Stress + 20 Spike)** - mỗi scenario: 1 endpoint group riêng / CSV riêng / listener riêng / tên file đúng quy ước / `.jtl` thô / thư mục HTML / screenshot tool+htop cùng khung / hardware report. Xem R5, R8, R13.

**Endurance / soak** - chạy **10-15 phút tải giữ đều**, kết luận bằng số cụ thể: max stable RPS, trần bộ nhớ (mục 6:94). Không có số = không có mục này.

**Task 2 (10đ)** - ba bước, làm đúng thứ tự (mục 6:102-104):
1. Cho AI phân tích `.jtl` và đề xuất ngưỡng
2. **Săn chỗ AI đọc sai** - mỗi lỗi phải kèm giá trị đúng lấy từ `.jtl` thô (R11)
3. Cho AI đề xuất tối ưu (index DB, connection pool, SQLite WAL...) rồi tự phân loại **feasible / hallucinated** kèm lý do

**Task 3 (10đ, G9.6 Disrupt)** - mô hình continuous performance testing: theo dõi commit của SUT -> quyết định có chạy test không -> cảnh báo khi p95 xấu đi. Bắt buộc có **flow chart** + bàn **trade-off (chi phí, báo động giả)** (mục 6:108).

**Video Task 1** - unlisted YouTube, **tổng ≥6 phút** (được cắt thành nhiều clip, mỗi scenario một clip), thuyết minh **tiếng Việt bằng giọng của mình**, và **JMeter với resource monitor phải nằm chung một khung hình** (mục 6:95 / mục 11:150).

**Agent Skill (10đ)** - nộp kèm video demo riêng, quay end-to-end việc dùng skill trên một endpoint group hoàn chỉnh (mục 7:113).

**Phụ lục** - AI Critique phải **200-300 chữ** (mục 10:138), trả lời đủ 3 câu: AI sai/thiên lệch/thiếu ở đâu, vì sao nó không bắt được, và mình rút ra nguyên tắc gì khi làm việc với AI. Đếm chữ trước khi kết luận là đạt.

**Vấn đáp** - 30% sinh viên bị gọi vấn đáp 5-7 phút tuần sau deadline (mục 13:160). Mọi con số trong báo cáo phải giải thích được bằng miệng.

**Nộp** - `23127262_HW05_AI_Performance_<grade>.zip` (mục 14:164). Bắt buộc có: báo cáo chính (md+pdf) / link repo / 3 test plan đúng tên / 3 `.jtl` thô + 3 thư mục HTML / screenshot resource monitor + hardware / link video / AI Critique + AI Audit (md+pdf) / git commit log (text) / bug report + screenshot / README.

---

## 5. Tra cứu

| Cần gì | Ở đâu |
|---|---|
| Yêu cầu chính thức | `2026.HW05.Performance Testing_En.md` |
| Chính sách môn học | `___2026.Homework.Policies.md` |
| Mẫu AI Audit Report (6 mục) | `[AI-02] - FIT@HCMUS - AI Audit Report_Vn.docx.md` |
| SUT (source, endpoint, cách chạy) | `https://github.com/ttbhanh/eshop-sut` -> clone vào `sut/` |
| Cấu trúc thư mục, trạng thái, self-assessment | `submission/README.md` |

**Repo bài làm:** `https://github.com/dinosauce-285/HW05-Software-Testing` (public, remote `origin`, branch `main`)
