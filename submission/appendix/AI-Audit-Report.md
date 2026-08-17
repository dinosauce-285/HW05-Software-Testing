**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026)**

# **AI Audit Report — HW05 Performance Testing**

---

## **1. Thông tin Sinh viên**

| Mục | Giá trị |
| :---- | :---- |
| **Họ tên sinh viên (in hoa):** | **LÝ QUỐC THẠNH** |
| **MSSV:** | 23127262 |
| **Lớp / Khoá:** | CS423 / CSC13003 — Kiểm chứng Phần mềm, 2026 |
| **Mã bài tập:** | HW#05 — Performance Testing |
| **Ngày làm bài:** | 11/08/2026 – 17/08/2026 |
| **Công cụ AI đã dùng:** | **Claude Opus 5** (Claude Code CLI) — thiết kế test plan, sinh dữ liệu, phân tích `.jtl`, soạn tài liệu |
| **Có dùng AI không:** | **[x] Có**   [ ] Không |

**Khai báo:** *"Tôi có dùng công cụ AI cho các tác vụ dưới đây."* Toàn bộ prompt nguyên văn theo
từng lượt nằm ở `AI-Prompt-Log.md`.

---

## **2. Hướng dẫn (đọc trước khi điền)**

* Thêm 1 hàng cho mỗi artifact AI sinh (test case, script, checklist, OpenAPI spec, JMeter plan…).
* Dán nguyên văn prompt — KHÔNG paraphrase.
* Dán nguyên văn output AI (hoặc kèm screenshot có chú thích trong báo cáo).
* Gắn nhãn: VALID / INVALID / INCOMPLETE.
* Lý do phải dẫn chiếu slide, mục ISTQB, hoặc RFC kỹ thuật.
* Hiển thị bản sửa với phần thay đổi được tô sáng.
* Hàng mẫu in nghiêng — thay trước khi nộp.

---

## **3. Bảng Audit — 1 hàng / artifact**

| # | (1) Prompt + Công cụ | (2) Output AI | (3) Verdict | (4) Lý do (ISTQB / tài liệu kỹ thuật) | (5) Bản SV sửa |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **1** | **Tool:** Claude Opus 5 · **11/08/2026**<br>*"Khảo sát hành vi thật của SUT EShop: gọi curl từng endpoint, đối chiếu với server.js, ghi lại mọi sai lệch so với tài liệu"* | Bảng 8 phát hiện: khoá tài khoản sau 2 lần sai (không phải 3), khoá 180 s, mật khẩu plaintext, chỉ seed 5 sản phẩm / 2 user, `userCarts` trong RAM, `?search=` nối chuỗi SQL, `price` đổi kiểu theo id chẵn/lẻ, checkout không kiểm giỏ | **VALID** | Cả 8 dòng đều kiểm chứng được bằng `curl` thật. ISTQB FL §1.4.3 — *test basis* phải là hành vi quan sát được, không phải tài liệu | Không sửa. Bổ sung kiểm chứng lại từng dòng bằng `curl` trước khi dùng |
| **2** | **Tool:** Claude Opus 5 · **11/08/2026**<br>*"Sinh dữ liệu nền cho 3 kịch bản: sản phẩm theo tổ hợp thương hiệu × thế hệ × biến thể để biết trước số kết quả mỗi từ khoá, tài khoản hợp lệ và tài khoản thăm dò lockout tách riêng"* | `scripts/seed-data.js` — 147 sản phẩm (7 thương hiệu × 3 thế hệ × 7 biến thể), 200 tài khoản hợp lệ, 10 tài khoản thăm dò | **VALID** | Kỳ vọng assertion suy từ **cấu trúc dữ liệu**, không suy ngược từ phản hồi SUT. ISTQB FL §4.2 — *equivalence partitioning* cần biết trước lớp tương đương | Không sửa |
| **3** | **Tool:** Claude Opus 5 · **11/08/2026**<br>*"Sinh 3 file CSV riêng cho 3 endpoint group, mỗi file có cột expect_* để assertion đọc kỳ vọng từ dữ liệu"* | `products.csv` (14 dòng), `credentials.csv` (210), `orders.csv` (200) | **VALID** | Đề mục 6:89 bắt mỗi group một CSV riêng. Dòng `O'Neill` có dấu nháy đơn — ISTQB FL §4.3 *boundary value*, đúng thứ sau này phát hiện lỗ SQL injection | Không sửa |
| **4** | **Tool:** Claude Opus 5 · **11/08/2026**<br>*"Sinh script theo dõi tài nguyên tiến trình backend trong lúc bắn tải"* | `scripts/monitor.sh` dùng `pgrep -f "node server.js"` và `ps -o %cpu` | **INVALID** | Hai lỗi đo lường: (a) `pgrep -f` không neo khớp trúng tiến trình `bash` bao ngoài → RSS 2,1 MB thay vì 117 MB; (b) `ps %cpu` là **trung bình cộng dồn từ lúc tiến trình khởi động**, không phải mức tức thời — sai bản chất trong bối cảnh đo hiệu năng | Neo `pgrep -f '^node server\.js$'` + chốt chặn từ chối PID có RSS < 30 MB. Đọc `utime+stime` từ `/proc/<pid>/stat` lấy hiệu giữa 2 lần mẫu. **Huỷ bỏ số liệu lượt chạy đầu**, chạy lại |
| **5** | **Tool:** Claude Opus 5 · **11/08/2026**<br>*"Sinh test plan JMeter cho kịch bản Load trên nhóm read-heavy, có think-time và assertion kiểm JSON"* | `23127262_Load_20260811.jmx` — 50 luồng, ramp 60 s, think-time 800 ms ± 200, 5 assertion thuộc 4 loại | **VALID** | Assertion kiểm cả `Content-Type` vì SUT trả HTML khi lỗi (`server.js:149`). ISTQB FL §4.3 — chỉ kiểm mã trạng thái là *weak oracle* | Không sửa |
| **6** | **Tool:** Claude Opus 5 · **13/08/2026**<br>*"Sinh test plan Stress trên POST /api/login, tách riêng nhánh tài khoản hợp lệ và nhánh thăm dò lockout"* | `23127262_Stress_20260813.jmx` — If Controller tách 2 nhánh, `Assertion.assume_success = false` ở cả hai | **INCOMPLETE** | JMeter có **hai tầng phán quyết độc lập**: trạng thái sampler và kết quả assertion. Mọi HTTP 4xx bị đánh lỗi ở tầng sampler bất kể assertion pass → 30/30 mẫu probe bị tính lỗi dù cả 2 assertion đều `failure=false`, thổi phồng error rate | Bật `assume_success = true` (Ignore Status) **chỉ trên nhánh probe**, giữ `false` ở nhánh chính. Sau sửa: 20 mẫu 401 + 10 mẫu 403 đều `success=true` |
| **7** | **Tool:** Claude Opus 5 · **13/08/2026**<br>*"Ghi quy trình reset trạng thái khoá tài khoản giữa các lượt chạy vào quy tắc thường trực"* | Đề xuất `rm database.sqlite && node backend/database.js`, hoặc `sqlite3 ... UPDATE users SET login_attempts=0` | **INVALID** | `sqlite3` CLI không có trên máy. Nghiêm trọng hơn: `database.js` gọi `initDatabase()` **ngay khi import** (dòng 117), mà hàm này mở đầu bằng **6 lệnh `DROP TABLE`** (dòng 15-20) → mất sạch 200 tài khoản + 147 sản phẩm. Đã dính bẫy **2 lần** | Viết `scripts/reset-lockout.js` mở thẳng `database.sqlite` bằng driver `sqlite3`, **không import `database.js`**. Kiểm chứng: sau reset còn nguyên 212 tài khoản |
| **8** | **Tool:** Claude Opus 5 · **13/08/2026**<br>*"Sinh test plan Spike cho luồng cart → checkout, cả hai endpoint đều cần Bearer token"* | `23127262_Spike_20260813.jmx` — setUp Thread Group lấy 50 token vào `props`, 2 Thread Group tách biệt cho nền và cú vọt | **VALID** | Tách 2 Thread Group là bắt buộc để có đường cơ sở đo **thời gian hồi phục**. Dùng `props` thay `vars` vì `vars` là biến cục bộ của luồng | Không sửa |
| **9** | **Tool:** Claude Opus 5 · **13/08/2026**<br>*"Phân tích 4 file .jtl thô, đề xuất ngưỡng hiệu năng và hướng tối ưu"* (phiên cô lập, chỉ được cấp `.jtl` + mô tả trung lập) | `AI-Analysis-Raw.md` — 7 715 từ: phân tích 4 lượt, 15 ngưỡng đề xuất, 10 hướng tối ưu | **INCOMPLETE** | Kiểm 25 nhận định định lượng: **20 đúng (80%)**. 3 nhận định kết luận đúng nhưng suy luận sai, 2 nhận định sai. Điểm mạnh: tính p95 đúng hơn cả dashboard JMeter. Điểm yếu: quy nguyên nhân bằng suy đoán trình bày như sự thật | Giữ nguyên văn output, viết `Task2-Misinterpretation-Hunt.md` chỉ ra 5 lỗi kèm lệnh kiểm chứng. Phân loại 10 đề xuất: **9 feasible, 1 hallucinated** (B4 tối ưu một vấn đề không tồn tại) |
| **10** | **Tool:** Claude Opus 5 · **13/08/2026**<br>*"Thiết kế mô hình kiểm thử hiệu năng liên tục cho SUT: theo dõi commit, quyết định chạy test, cảnh báo hồi quy p95. Kèm flow chart và bàn trade-off"* | `Task3-Continuous-Performance-Testing.md` + flow chart Mermaid — 3 tầng test, ngưỡng cảnh báo, phân tích chi phí | **VALID** | Ngưỡng suy từ **nhiễu nền đo được** (p95 dao động 1,83 lần trên cùng một lượt soak) chứ không từ trực giác. ISTQB FL §5.3 — *entry/exit criteria* phải định lượng được | Không sửa. Bổ sung mục giới hạn: nhiễu 1,83 lần đo trên máy rảnh, CI runner dùng chung sẽ ồn hơn nên phải đo lại |
| **11** | **Tool:** Claude Opus 5 · **17/08/2026**<br>*"Chắt quy trình kiểm thử hiệu năng đã chạy 8 lượt thành Agent Skill tái dùng được"* | `.claude/skills/perf-test-endpoint/` — `SKILL.md` (7 bước) + `jmx-template.md` + `analysis-playbook.md`, 3 598 từ | **VALID** | Mọi cảnh báo trong skill đều là lỗi **đã thực sự mắc phải** trong bài này, không phải phòng xa lý thuyết. Đề mục 7:112 đòi skill *"reused on additional endpoints"* | Không sửa |
| **12** | **Tool:** Claude Opus 5 · **17/08/2026**<br>*"Chụp ảnh JMeter và htop trong cùng một khung hình"* | Vòng lặp dùng `pgrep -f "ApacheJMeter.jar"`, rồi `pkill -f "Xvfb :99"` | **INVALID** | **Tái phát đúng lỗi ở hàng 4**, hai lần nữa: mẫu `pgrep`/`pkill` không neo khớp trúng chính tiến trình đang chạy lệnh đó, cho ra `CPU=0%` vô nghĩa và tự giết shell của mình | Đổi sang `pgrep -x java` / `pgrep -x node`; chuyển toàn bộ logic vào **file script riêng** để dòng lệnh không chứa chuỗi mẫu. Ghi vào nhật ký như bằng chứng rằng ghi nhật ký không ngăn được tái phạm |

---

## **4. Tổng kết Độ chính xác AI**

| Chỉ số | Số lượng | Tỉ lệ |
| :---- | :---- | :---- |
| **Tổng artifact AI sinh đã audit** | **12** | 100% |
| **VALID (đúng, dùng nguyên)** | **6** | **50%** |
| **INVALID (sai; loại bỏ hoặc viết lại)** | **4** | **33%** |
| **INCOMPLETE (chấp nhận sau khi sửa)** | **2** | **17%** |

Ngoài ra, riêng artifact #9 được audit ở mức chi tiết hơn — **25 nhận định định lượng**, kiểm từng
cái bằng lệnh trên `.jtl` thô: 20 đúng (80%), 3 kết luận đúng nhưng suy luận sai, 2 sai. Mười đề
xuất tối ưu: 9 feasible, 1 hallucinated.

---

## **5. Kết luận — Khi nào nên / không nên dùng AI?**

AI mạnh nhất ở việc **sinh cấu trúc và tính toán**: 6/12 artifact dùng được gần như nguyên vẹn, và
ở phần phân tích log nó tính phân vị chính xác hơn cả dashboard của JMeter. Nhưng cả 4 artifact
INVALID đều rơi vào một nhóm — **những chỗ đòi hiểu ngữ cảnh vận hành thật**: đo CPU tức thời hay
trung bình cộng dồn, một file vừa là module vừa có tác dụng phụ huỷ dữ liệu, JMeter có hai tầng
phán quyết độc lập. Đáng chú ý hơn, cùng một lỗi `pgrep` tái phát ba lần dù đã ghi vào nhật ký.

Khuyến nghị: dùng AI để sinh khung và tính toán, nhưng **mọi lệnh đo lường và mọi giải thích nhân
quả phải tự kiểm chứng bằng dữ liệu thô**. Không lỗi nào ở trên làm chương trình dừng — chúng chỉ
âm thầm cho ra số sai.

*(Đếm bằng lệnh: 149 từ — yêu cầu 80–150.)*


---

## **6. Mandatory Disclosure (dán nguyên văn)**

*"[Test case / script / dataset / báo cáo] này được sinh phiên bản đầu bởi [tên công cụ AI]; tôi đã
rà soát và chỉnh sửa [phần X], bổ sung [edge case Y, Z]; [phần W] do tôi tự viết. AI Audit Report
chi tiết đính kèm ở Phụ lục A. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh
mục bị cấm."*

**Bản điền cụ thể cho bài này:**

> Ba test plan JMeter, các script sinh dữ liệu và phân tích, cùng bản thảo đầu của các tài liệu báo
> cáo trong bài này được sinh phiên bản đầu bởi **Claude Opus 5 (Claude Code CLI)**; tôi đã rà soát
> và chỉnh sửa **script đo tài nguyên** (thay `ps %cpu` bằng `/proc/<pid>/stat`, neo biểu thức
> `pgrep`), **quy trình reset trạng thái** (viết lại `reset-lockout.js` để không xoá dữ liệu nền),
> và **assertion của plan Stress** (bật Ignore Status cho nhánh thăm dò lockout); bổ sung **dòng dữ
> liệu biên `O'Neill`** vốn là thứ phát hiện lỗ SQL injection, và **bảng săn lỗi diễn giải** đối
> chiếu từng nhận định của AI với `.jtl` thô. **Phần kiểm chứng số liệu, quyết định chọn endpoint,
> và toàn bộ 8 lượt chạy thật** do tôi thực hiện và chịu trách nhiệm. AI Audit Report chi tiết đính
> kèm ở Phụ lục A. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh mục bị cấm.

---

## **Chữ ký**

| Mục | Giá trị |
| :---- | :---- |
| **Họ tên sinh viên (in hoa):** | **LÝ QUỐC THẠNH** |
| **MSSV:** | 23127262 |
| **Lớp / Khoá:** | CS423 / CSC13003 — 2026 |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Giảng viên:** | Dr. Lâm Quang Vũ / Dr. Trần Duy Hoàng / MSc. Trần Thị Bích Hạnh / MSc. Trương Phước Lộc / MSc. Hồ Tuấn Thanh |
| **Ngày:** | ..... / ..... / 2026 |
| **Chữ ký:** | |

---

## **Tham khảo**

* Kharbach, M. (2026). *AI Use Policy Templates for Higher Education.* CC BY-NC-SA 4.0.
* ISTQB Foundation Level Syllabus (latest version).
* Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
* Fuster Rabella, M. (2025). *OECD Education Working Paper No. 338.*
* Perkins, M., Roe, J., & Furze, L. (2025). *AI Assessment Scale.*
* Anthropic (2025). *Building reliable AI test agents* — engineering blog.
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.
