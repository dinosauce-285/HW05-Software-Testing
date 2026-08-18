# AI Prompt Log — nhật ký tương tác nguyên văn

*(HW05 mục 9:130-134 — "include the following information for each interaction: Name of the AI tool · Date and time · Your prompt · The AI output")*

| Mục | Giá trị |
|---|---|
| **Công cụ AI** | Claude Opus 5 (`claude-opus-5`) qua Claude Code CLI |
| **Sinh viên** | Lý Quốc Thạnh — 23127262 |
| **Bài tập** | HW05 — Performance Testing |
| **Tổng số lượt tương tác** | **100** |
| **Số phiên làm việc** | 4 |
| **Múi giờ** | UTC+7 (giờ Việt Nam) |

**Nguồn:** trích tự động bằng `scripts/extract-prompt-log.py` từ transcript
`~/.claude/projects/-home-qt-projects-hw05/*.jsonl`.

**Prompt giữ nguyên văn 100%**, không sửa, không paraphrase — kể cả lỗi chính tả và câu cụt.
Output của AI cắt ở 2500 ký tự mỗi lượt cho gọn; chỗ nào bị cắt đều ghi rõ. Bản đầy đủ nằm
trong transcript gốc và trong chính các artifact đã nộp.

Bảng audit theo mẫu của Khoa — có verdict và phần sinh viên sửa — nằm ở `AI-Audit-Report.md`.

---

# Phiên `d724bcc4` — 45 lượt

## Lượt 1 — 11/08/2026 08:28:41

**Prompt (nguyên văn):**

```text
<ide_opened_file>The user opened the file /home/qt/projects/hw05/2026.HW05.Performance Testing_En.md in the IDE. This may or may not be related to the current task.</ide_opened_file>
```

**Công cụ AI đã gọi:** 5 lần — `Read`, `Bash`, `AskUserQuestion`

**Output AI:**

```text
I'll read the HW05 spec and the audit template first.

Đọc xong cả 3 file. Trước khi viết lại CLAUDE.md, có vài biến HW05 tôi không được phép đoán:
```

---

## Lượt 2 — 11/08/2026 08:31:08

**Prompt (nguyên văn):**

```text
tôi chưa hiểu 3 câu hỏi của bạn
```

**Output AI:**

```text
Xin lỗi, tôi hỏi tắt quá. Giải thích lại từng câu:

---

**Câu 1 — Dùng JMeter hay k6?**

Đề (mục 8:119) cho chọn: *"JMeter (default) or k6 (bonus)"*. Đây là 2 công cụ đo hiệu năng khác nhau, phải chọn 1 trước khi tôi viết CLAUDE.md vì nó quyết định gần hết các quy tắc còn lại:

| | JMeter | k6 |
|---|---|---|
| Cách viết test | GUI kéo thả, file `.jmx` (XML) | Code JavaScript |
| File log thô | `.jtl` — **đúng tên đề đòi** (mục 11:149) | phải tự cấu hình xuất ra tương đương |
| 3 "report view" (đề bắt buộc, mục 6:90) | có sẵn: View Results Tree / Summary Report / Aggregate Report | phải tự dựng 3 output khác nhau |
| Điểm | mặc định | được cộng bonus |

Nói ngắn: **JMeter = đi đúng đường ray đề vẽ sẵn. k6 = code sướng hơn nhưng phải tự chế mấy thứ đề đòi.**

---

**Câu 2 — Ghép scenario với endpoint group**

Đề bắt 2 việc cùng lúc:

- Mục 5:72 — chọn **3 nhóm endpoint** của backend EShop:
  - *Read-heavy*: xem/tìm sản phẩm (`GET /api/products`) — chỉ đọc, nhẹ
  - *Auth-heavy*: đăng nhập (`POST /api/auth/login`) — có cơ chế khoá tài khoản sau 3 lần sai
  - *Transactional*: thêm giỏ hàng / đặt hàng — ghi vào DB, nặng nhất

- Mục 6:88 — chạy **3 kiểu test**:
  - *Load*: tải bình thường, đều, kéo dài → xem hệ thống chịu tải hàng ngày thế nào
  - *Stress*: tăng dần tới lúc **gãy** → tìm ngưỡng chết
  - *Spike*: bắn một cú **đột ngột** rồi rút → xem có phục hồi không

Và **mỗi nhóm chỉ được ghép đúng 1 kiểu test** (3×3 nhưng chỉ chọn 3 cặp). Câu hỏi của tôi là: cặp nào với cặp nào?

Tôi đề xuất **Load→Read, Stress→Auth, Spike→Transactional**, vì:
- Read-heavy nhẹ và ổn định → hợp để đo tải nền dài hạn (Load)
- Stress ép login tới gãy sẽ **kích hoạt lockout 3-lần-sai** — mà đề nhắc riêng ở mục 6:93 (*"When Stress/Spike runs trigger the 3-fail login lockout, reset it between runs and document the steps"*), tức là có sẵn nội dung để viết báo cáo
- Spike bắn burst vào checkout = mô phỏng flash-sale, rất đời thực

---

**Câu 3 — Repo GitHub**

Đề (mục 14:169) bắt nộp link repo public chứa test plan + data file. HW04 bạn dùng `github.com/dinosauce-285/HW04-Software-Testing`. HW05 thì tôi ghi URL nào vào bảng biến? Tạo repo mới tên `HW05-Performance-Testing`, hay để trống `<điền>` rồi bạn báo sau?

---

Cần tôi giải thích thêm chỗ nào không, hay trả lời luôn 3 câu?
```

---

## Lượt 3 — 11/08/2026 08:32:07

**Prompt (nguyên văn):**

```text
với câu 1: cái nào điểm cũng tương đương hay có cái nhiều điểm hơn, chọn cái nào có nhiều điểm hơn (nếu có) hoặc cái nào dễ hơn (nếu không )
```

**Output AI:**

```text
Kiểm tra lại thang điểm ở mục 15:183-191:

| Mục | Điểm |
|---|---|
| Task 1 — Load / Stress / Spike | 20 + 20 + 20 |
| Task 2 — AI analysis | 10 |
| Task 3 — CPT proposal | 10 |
| Agent Skills | 10 |
| **Tổng** | **100** |

**Không có dòng nào cộng điểm cho k6.** Chữ "bonus" ở mục 8:119 không được bảng điểm chống lưng, tổng vẫn chốt 100 — nên coi như điểm ngang nhau.

Vậy chọn theo tiêu chí "cái nào dễ hơn" → **JMeter**, và không chỉ vì dễ mà vì ít rủi ro mất điểm:

- Mục 11:149 (Anti-AI-Cheat, TA verify tận tay) ghi thẳng *"The raw `.jtl` log files, attached in full"* — `.jtl` là định dạng riêng của JMeter. k6 phải tự chế file tương đương rồi đi thuyết phục TA rằng nó "tương đương", trong khi mục 17:204 ghi *thiếu tài liệu bắt buộc → 0 điểm*. Đánh cược không đáng.
- Mục 6:90 bắt 3 report view khác nhau — JMeter có sẵn View Results Tree / Summary Report / Aggregate Report, khai báo ngay trong file `.jmx`. k6 phải tự dựng 3 kiểu output rồi tự biện luận.
- Chạy thì vẫn gọn, không cần đụng GUI:
  ```bash
  jmeter -n -t 23127262_Load_20260811.jmx -l results.jtl -e -o report/
  ```
  Một lệnh ra cả `.jtl` thô lẫn thư mục HTML report — đúng 2 thứ mục 14:171 đòi.

→ **Chốt JMeter.** Nếu sau này dư thời gian, thêm 1 script k6 làm phụ lục cũng được, nhưng không tính vào 3 scenario chính.

---

Còn **câu 2** (ghép Load/Stress/Spike với read-heavy / auth-heavy / transactional) và **câu 3** (URL repo HW05) — bạn quyết giúp, hoặc bảo tôi lấy phương án tôi đề xuất ở tin nhắn trước.
```

---

## Lượt 4 — 11/08/2026 08:33:02

**Prompt (nguyên văn):**

```text
câu số 2 chưa hiểu
```

**Output AI:**

```text
Được, tôi diễn giải bằng ví dụ cụ thể.

## Có 2 danh sách, phải bắt cặp với nhau

**Danh sách 1 — 3 nhóm API của EShop** (đề mục 5:72-77). Đây là *bắn vào đâu*:

| Nhóm | API cụ thể | Đặc điểm |
|---|---|---|
| Read-heavy | `GET /api/products` — xem danh sách / tìm sản phẩm | Chỉ đọc DB, nhẹ, chịu tải tốt |
| Auth-heavy | `POST /api/auth/login` — đăng nhập | Có hash mật khẩu (tốn CPU) + **khoá tài khoản sau 3 lần sai** |
| Transactional | `POST /api/orders` — đặt hàng | Ghi vào DB, nhiều bước, nặng nhất |

**Danh sách 2 — 3 kiểu test** (đề mục 6:88). Đây là *bắn kiểu gì*:

| Kiểu | Cách bắn | Trả lời câu hỏi |
|---|---|---|
| **Load** | 50 user đều đặn, chạy liên tục 10 phút | "Ngày thường hệ thống có ổn không?" |
| **Stress** | 10 user → 50 → 100 → 200... tăng tới lúc **gãy** | "Chết ở mức nào?" |
| **Spike** | 5 user đang chạy êm, **đột ngột nhảy lên 200 trong 10 giây** rồi tụt về 5 | "Bị sốc xong có hồi phục không?" |

## Đề bắt ghép 1-1

Mục 6:88: *"design and generate the three test plans: Load, Stress, and Spike, **each targeting one endpoint group**, so that the three groups are each covered by **exactly one** scenario"*

Tức là mỗi kiểu test bắn vào đúng 1 nhóm API, không được trùng. Có 6 cách ghép, tôi hỏi bạn chọn cách nào.

## Phương án tôi đề xuất

| Kiểu test | → bắn vào | Vì sao |
|---|---|---|
| **Load** | Read-heavy (`GET /api/products`) | API nhẹ, chạy đều 10-15 phút không sập → đo được ngưỡng chịu đựng bằng số cụ thể (mục 6:94 đòi "maximum stable RPS") |
| **Stress** | Auth-heavy (`POST /api/auth/login`) | Ép login tới gãy sẽ **kích hoạt lockout 3-lần-sai** — mà mục 6:93 nhắc riêng: *"When Stress/Spike runs trigger the 3-fail login lockout, reset it between runs and document the steps"*. Đề đã dọn sẵn nội dung để viết, không tận dụng thì phí |
| **Spike** | Transactional (`POST /api/orders`) | Giống flash-sale đời thực: đang vắng, sale mở, 200 người bấm đặt hàng cùng lúc. Đây cũng là chỗ dễ lòi bug thật (mục 6:96 đòi log bug lên GitHub Issues) |

Còn cách ghép nào cũng chạy được, nhưng cách này khớp nhất với những gì đề đã gợi ý sẵn.

---

Bạn chọn phương án này, hay muốn đổi cặp nào?
```

---

## Lượt 5 — 11/08/2026 08:35:52

**Prompt (nguyên văn):**

```text
oke chốt, giải thích câu 3
```

**Output AI:**

```text
Câu 3 đơn giản hơn nhiều.

## Đề bắt nộp link repo GitHub

Mục 14:169: *"The public GitHub repository link (test plans and data files)"* — tức là 3 file `.jmx` và các file CSV phải nằm trên một repo GitHub **public**, rồi dán link vào bài nộp.

Ngoài ra mục 12:155-156 bắt commit từng bước và xuất git log ra file text.

## Vấn đề

Thư mục `/home/qt/projects/hw05` hiện **chưa phải git repo** (chưa có `.git`). HW04 bạn dùng `github.com/dinosauce-285/HW04-Software-Testing`.

Nên tôi cần biết ghi URL nào vào bảng biến ở đầu CLAUDE.md — vì R2/R3 (commit từng bước, xuất git log) và mục 4 (danh mục file nộp) đều trỏ tới nó.

## 2 lựa chọn

| | Nghĩa là gì |
|---|---|
| **A. Repo mới** | Tôi ghi sẵn `https://github.com/dinosauce-285/HW05-Performance-Testing` vào CLAUDE.md, theo đúng pattern HW04. Bạn tạo repo trên GitHub lúc nào cũng được, tôi `git init` + set remote khi bắt đầu làm bài |
| **B. Để `<điền>`** | Ghi placeholder. Khi nào cần dùng thật (commit đầu tiên, viết README) tôi sẽ hỏi lại — theo đúng quy tắc "không tự suy ra" của CLAUDE.md |

Tôi nghiêng về **A**: tên repo tự đặt được, không phải giá trị bí mật, và có sẵn thì R2 chạy trơn ngay từ commit đầu. Nếu bạn muốn tên khác (`HW05-Performance`, `hw05-perf-testing`...) thì cứ báo tên.
```

---

## Lượt 6 — 11/08/2026 08:36:56

**Prompt (nguyên văn):**

```text
echo "# HW05-Software-Testing" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/dinosauce-285/HW05-Software-Testing.git
git push -u origin main
```

**Công cụ AI đã gọi:** 9 lần — `Bash`, `Write`

**Output AI:**

```text
Chốt xong 3 câu. Set up repo trước:

Repo lên rồi. Giờ viết lại CLAUDE.md cho HW05:

Xong. [CLAUDE.md](CLAUDE.md) đã viết lại cho HW05.

**Repo:** `git init` + first commit + remote + push đều chạy được, đã lên `github.com/dinosauce-285/HW05-Software-Testing`. Commit thứ 2 (`74ede44 docs(repo): rewrite working rules for HW05 performance testing`) mới nằm ở local, chưa push.

## Những gì thay đổi so với bản HW04

**Bảng biến (mục 1)** — thêm 3 bảng con mà HW04 không có:
- Ma trận scenario × endpoint group đã chốt, kèm cột "lý do ghép" vì đề mục 6:88 bắt *"briefly justify which group you paired with each scenario"*
- Bảng phân listener (Summary / Aggregate / View Results Tree) — vì mục 6:90 cấm lặp loại
- Cấu trúc thư mục `plans/ data/ results/{raw,html}/ evidence/{monitor,hardware}/`

**Quy tắc** — R1-R12 giữ khung cũ nhưng đổi ruột, thêm R13:

| Rule | Đổi gì |
|---|---|
| R1 | Bám đúng **mẫu 6 mục** của file `[AI-02]`, có bảng ánh xạ từng mục (bảng audit 5 cột, tổng kết %, kết luận 80-150 chữ, disclosure dán nguyên văn) |
| R4 | Liệt sẵn 4 lỗi AI hay mắc ở bài hiệu năng: ramp-up phi thực tế, thiếu think-time, không assertion, bỏ qua lockout — đây là ví dụ đề nêu thẳng ở mục 6:92 |
| R5 | HW04 là "lưu HTML report"; HW05 thành "thu đủ 4 bằng chứng": `.jtl` nguyên vẹn / thư mục HTML / screenshot JMeter+htop **cùng khung hình** / hardware report. Thêm ràng buộc **hostname phải khớp HW04** (mục 11:151) |
| R8 | 3 bất biến → 5: CSV riêng từng group (không dùng chung), listener khác loại, tên file đúng `{StudentID}_{ScenarioType}_{YYYYMMDD}`, tham số giải thích được, có assertion |
| R11 | Đổi hẳn nghĩa — thành **"mọi con số phải truy ngược được về `.jtl`"**, vì mục 6:103 chấm đúng chỗ này: chỉ ra AI đọc sai chỗ nào *kèm giá trị đúng từ log thô* |
| R13 | Mới — reset lockout giữa các lượt chạy và **ghi lại chính xác lệnh đã dùng** (mục 6:93) |

Bỏ R7 cũ (test case không automate được) → thành `Not-Run.md` cho scenario/tham số phải hạ.

## Hai chỗ tôi đánh dấu [!] trong file

1. **Endpoint path chưa verify** — `GET /api/products`, `POST /api/auth/login`, `POST /api/orders` là suy từ mô tả pool trong đề, chưa đối chiếu mã nguồn vì `sut/` chưa clone về. Phải đọc `backend/routes/*` trước khi viết `.jmx` đầu tiên.
2. **Chưa đối chiếu trùng lặp với nhóm** — mục 5:78 cấm 2 thành viên test cùng endpoint.

Còn 2 ô `<điền>`: link YouTube và self-assessed grade.
```

---

## Lượt 7 — 11/08/2026 08:43:12

**Prompt (nguyên văn):**

```text
clone luôn eshop về rồi set up và xoá cái thư mục git của nó để nó khỏi hiện trong source control
```

**Công cụ AI đã gọi:** 21 lần — `Bash`, `Read`, `Edit`

**Output AI:**

```text
Clone SUT, gỡ `.git` của nó, và thêm vào `.gitignore` theo đúng quy ước ở CLAUDE.md mục 1:

`sut/` đã ẩn khỏi source control. Giờ verify endpoint — đây là mục [!] còn treo:

Ba giả định endpoint của tôi: **1 đúng, 2 sai**. Đọc kỹ phần login + checkout:

Có mấy phát hiện quan trọng. Đọc nốt cart/checkout:

Chạy thử backend để verify bằng thật, không tin đọc code:

Xác nhận bug: **khoá sau 2 lần sai, không phải 3**. Verify nốt nhánh transactional:

Kill server và cập nhật CLAUDE.md theo những gì vừa verify:

Xong. `sut/` đã clone, gỡ `.git`, và gitignore — source control chỉ thấy 6 file tài liệu, không dính SUT.

## Ba endpoint tôi đoán ở phiên trước: 1 đúng, 2 sai

| Đoán ban đầu | Thực tế |
|---|---|
| `GET /api/products` | ✅ đúng |
| `POST /api/auth/login` | ❌ thật ra là **`POST /api/login`** |
| `POST /api/orders` | ❌ thật ra là **`POST /api/cart`** → **`POST /api/checkout`** |

Đã gọi thật bằng `curl` trên backend đang chạy chứ không đọc code suy ra. Bảng trong CLAUDE.md đã sửa và gỡ dấu [!].

## Khảo sát ra 8 điểm ảnh hưởng trực tiếp tới bài — 3 cái đáng chú ý nhất

**1. Đề bài sai về chính SUT.** Mục 6:93 ghi *"3-fail login lockout"*, nhưng [server.js:54](sut/backend/server.js#L54) cộng `login_attempts + 2` mỗi lần sai trong khi ngưỡng khoá là `>= 3` — nên **lần sai thứ 2 đã khoá**. Verify thật:

```
FAIL #1 → 401
FAIL #2 → 401
login lại bằng mật khẩu ĐÚNG → 403 "Tài khoản đã bị khóa"
```

Khoá 180 giây, và check khoá đặt *trước* khi so mật khẩu. Đây là bug thật → `Bug-Report.md` + GitHub Issue (R6), và plan Stress phải tính theo mốc 2 chứ không phải 3.

**2. Mật khẩu là plaintext**, không bcrypt ([server.js:46](sut/backend/server.js#L46)). AI phân tích log gần như chắc chắn sẽ giải thích latency login bằng "chi phí hash mật khẩu" — sai hoàn toàn. Đây là mồi sẵn cho phần săn lỗi diễn giải của Task 2 (mục 6:103).

**3. Giỏ hàng nằm trong RAM và không bao giờ dọn** — biến `userCarts = {}` ở [server.js:14](sut/backend/server.js#L14). Bắn tải vào `POST /api/cart` là bộ nhớ phình đơn điệu, không bao giờ nhả. Đúng bằng chứng cho "memory ceiling" mà mục 6:94 đòi.

Còn 5 phát hiện nữa (SQL injection ở `?search=` trả HTML khi lỗi, `price` thành string khi id chẵn, id không tồn tại trả 200 `{}`, checkout không kiểm giỏ/tồn kho) — đã ghi hết thành bảng trong CLAUDE.md mục 1.

## Một vấn đề về dữ liệu cần xử lý trước khi viết `.jmx`

DB chỉ seed **5 sản phẩm và 2 user**. Không đủ để làm CSV data-driven đúng nghĩa (mục 6:89 bắt mỗi group một file CSV riêng) — nhất

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 8 — 11/08/2026 08:52:37

**Prompt (nguyên văn):**

```text
check eshop và chọn enpoint của mình luôn để tôi gửi lên nhóm, đề xuất chọn endpoints nào dễ thực hiện. bài tập này có những task nào cần tương tác với nhóm
```

**Công cụ AI đã gọi:** 2 lần — `Read`, `Bash`

**Output AI:**

```text
Đọc nốt phần coupon và soát quyền của toàn bộ route để xếp hạng độ dễ:

## Bài này cần tương tác với nhóm mấy chỗ? — Đúng **một** chỗ

HW05 là **Individual Assignment** (mục 1:9). Rà hết đề + policies, chỉ có duy nhất một ràng buộc bắt buộc phải làm việc với nhóm:

> **Mục 5:78** — *"ensure that your selection is **not duplicated** among the members of your group: no two members may test the same endpoint / workflow."*

Hết. Không có peer review, không có chia task, không có báo cáo chung. Ba mục còn lại của Policies:27-29 (work allocation, task complexity, peer review) chỉ áp cho *project-related assignments* — HW05 không phải.

Và một điều **cấm** liên quan tới nhóm: mục 17:205 — chép của nhau, **kể cả prompt**, là 0 điểm cả hai bên. Nên chỉ trao đổi *đã chọn endpoint nào*, tuyệt đối không chia sẻ file `.jmx`, CSV, hay prompt.

---

## Bản đồ endpoint — soát quyền toàn bộ 31 route

Yếu tố quyết định độ khó khi bắn tải JMeter: **có cần token không** (phải thêm setUp Thread Group + JSON Extractor), **có phá dữ liệu không** (phải reset giữa các lượt), **có tự khoá không**.

### Read-heavy

| Endpoint | Auth | Độ khó | Ghi chú |
|---|---|---|---|
| `GET /api/products?search=` | không | **Dễ nhất** | CSV = từ khoá, muốn bao nhiêu dòng cũng được |
| `GET /api/products/:id` | không | Dễ | CSV chỉ có 5 id, hơi mỏng |
| `GET /api/orders/:id` | **không** ⚠️ | Dễ | Thiếu auth = lỗ IDOR, đọc được đơn người khác |
| `GET /api/categories` | không | Quá dễ | Chỉ 3 dòng, **không nên** — Policies:28 ghi chọn việc quá đơn giản sẽ bị chặn trần điểm |

### Auth-heavy

| Endpoint | Auth | Độ khó | Ghi chú |
|---|---|---|---|
| `POST /api/login` | không | **Trung bình** | Vướng khoá tài khoản, nhưng đề *muốn* mình xử lý cái đó (mục 5:75) |
| `POST /api/register` | không | Dễ | Không khoá, nhưng phình DB vô hạn |
| `POST /api/forgot-password` → `reset-password` | không | Trung bình | Workflow 2 bước, không khoá |
| `GET /api/users/me` | **có** | Trung bình | Cần token |

### Transactional

| Endpoint | Auth | Độ khó | Ghi chú |
|---|---|---|---|
| `POST /api/apply-coupon` | **không** ⚠️ | Dễ | Không cần token. Nhưng **chỉ tính toán, không ghi DB** → hơi khiên cưỡng khi gọi là "transactional" |
| `POST /api/products` | **không** ⚠️ | Dễ | Thiếu auth = ai cũng tạo được sản phẩm. Ghi DB thật, nhưng thuộc Pool C admin |
| `POST /api/cart` → `POST /api/checkout` | **có** | Trung bình | Chính là ví dụ đề nêu ở mục 5:77 |

---

## Đề xuất: giữ nguyên 3 lựa chọn đã chốt

Tôi cân nhắc 

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 9 — 11/08/2026 08:55:49

**Prompt (nguyên văn):**

```text
oke bạn chọn cái nào chọn luôn để max 100 điểm liệt kê rõ
```

**Output AI:** (chỉ gọi công cụ, không có phần văn bản)

---

## Lượt 10 — 11/08/2026 09:01:21

**Prompt (nguyên văn):**

```text
continue
```

**Công cụ AI đã gọi:** 3 lần — `Edit`, `Bash`

**Output AI:**

```text
Chốt. Không đổi nữa — đây là bộ 3 endpoint chính thức:

## Chốt — 3 endpoint chính thức

| # | Nhóm | Endpoint | Scenario | Listener | CSV riêng | Tên file |
|---|---|---|---|---|---|---|
| 1 | Read-heavy | `GET /api/products` + `?search=` | **Load** | Summary Report | `data/products.csv` | `23127262_Load_YYYYMMDD.jmx` |
| 2 | Auth-heavy | `POST /api/login` | **Stress** | Aggregate Report | `data/credentials.csv` | `23127262_Stress_YYYYMMDD.jmx` |
| 3 | Transactional | `POST /api/cart` → `POST /api/checkout` | **Spike** | View Results Tree | `data/orders.csv` | `23127262_Spike_YYYYMMDD.jmx` |

Không đổi sang bộ "không cần token" vì bộ này bám đúng ví dụ đề nêu ở mục 5:74-77 — mà 3 nhóm này ăn 60/100 điểm. Cái giá phải trả chỉ là một setUp Thread Group lấy `$.token` cho plan Spike.

## Tại sao bộ này ăn được trọn 100

Ba phát hiện lúc khảo sát SUT biến phần khó thành phần ghi điểm — mỗi cái nhắm đúng một mục chấm:

| Phát hiện | Ăn điểm ở đâu |
|---|---|
| SUT khoá tài khoản sau **2** lần sai, đề ghi 3 | Mục 6:93 chấm riêng phần lockout + 1 bug thật cho GitHub Issue (mục 6:96) |
| Mật khẩu **plaintext**, không bcrypt | Task 2 (10đ) — AI gần như chắc chắn đổ latency login cho "chi phí hash", mình bắt lỗi kèm số từ `.jtl` |
| `userCarts` nằm trong RAM, **không bao giờ dọn** | Mục 6:94 đòi "memory ceiling" bằng số — bắn Spike vào `/api/cart` là ra ngay |

Nếu chọn `apply-coupon` / `register` cho nhẹ thì mất sạch 3 mồi này.

## Checklist 100 điểm

Đã ghi thành mục 5 trong [CLAUDE.md](CLAUDE.md) để không rơi giữa chừng — 6 khối theo đúng 6 dòng thang điểm, cộng khối "thiếu là 0 điểm toàn bài":

- **20đ Load** — 10 gạch đầu dòng, gồm cả **endurance 10-15 phút chạy trên chính endpoint read-heavy** (mục 6:94), kết luận bằng max stable RPS + trần RSS
- **20đ Stress** — thêm 3 việc riêng: sinh sẵn nhiều tài khoản qua `POST /api/register`, nêu sai lệch 2-vs-3 lần khoá, ghi chính xác lệnh reset lockout
- **20đ Spike** — thêm: setUp Thread Group lấy token, đo thời gian hồi phục sau spike, reset DB giữa lượt
- **10đ Task 2** — mỗi lỗi diễn giải **bắt buộc kèm giá trị đúng trích từ `.jtl` thô**; đây là chỗ chấm chặt nhất
- **10đ Task 3** — flow chart + đủ 3 khâu (theo dõi commit → quyết định chạy → cảnh báo p95) + bàn trade-off
- **10đ Agent Skill** — bồi từ scenario Load, có video demo riêng

Đã điền luôn `Self-assessed grade = 100` → file nộp `23127262_HW05_AI_Performance_100.zip`.

**Commit:** `f1d4d1f docs(repo): lock endpoint selection and add 100-point delivery chec

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 11 — 11/08/2026 09:06:24

**Prompt (nguyên văn):**

```text
gen cho tôi tin nhắn gửi lựa chọn của tôi cho nhóm
```

**Output AI:**

```text
```
HW05 – Performance Testing | Lý Quốc Thạnh – 23127262

Mình xin nhận 3 endpoint group sau (đề mục 5 yêu cầu không trùng giữa các thành viên):

1. Read-heavy    — GET  /api/products  (kèm ?search=)        → kịch bản Load
2. Auth-heavy    — POST /api/login                           → kịch bản Stress
3. Transactional — POST /api/cart → POST /api/checkout       → kịch bản Spike

Công cụ: JMeter (non-GUI).

Nếu bạn nào đã nhận trùng cái nào thì báo mình, mình nhường và đổi sang:
- Read-heavy    → GET  /api/products/:id
- Auth-heavy    → POST /api/forgot-password → POST /api/reset-password
- Transactional → POST /api/apply-coupon

Mọi người chốt sớm giúp mình nhé, mình bắt đầu dựng test plan cuối tuần này.

P/S: đề mục 17 ghi rõ chép của nhau — kể cả prompt — là 0 điểm cả hai bên,
nên mình chỉ trao đổi phần "ai lấy endpoint nào" thôi, không share file
.jmx / CSV / prompt nha.
```

Nếu nhóm dùng kênh có render markdown (Discord, Slack) thì bọc cả khối trên trong ba dấu ` để giữ thẳng hàng cột.
```

---

## Lượt 12 — 11/08/2026 09:10:00

**Prompt (nguyên văn):**

```text
rồi chọn 3 cái đó làm đi, không có trùng đâu khỏi nhường
```

**Công cụ AI đã gọi:** 38 lần — `Bash`, `Write`, `Edit`

**Output AI:**

```text
JMeter và Java đều chưa có. Kiểm tra cách cài:

`sudo` cần mật khẩu nên tôi không cài hệ thống được. Cài bản portable vào `tools/` (không cần quyền root, gitignore luôn):

JMeter 5.6.3 chạy được. Dựng khung thư mục + script env:

Bước tiếp: dựng dữ liệu. DB chỉ có 5 sản phẩm + 2 user, không đủ cho CSV data-driven.

152 sản phẩm, 212 tài khoản. Giờ sinh 3 file CSV — mỗi nhóm một file riêng theo mục 6:89:

Kiểm chứng vài dòng CSV bằng API thật (để chắc seed đúng, không phải để lấy kỳ vọng từ SUT):

Cả 5 khớp chính xác với giá trị tự tính. Và dấu nháy đơn xác nhận lỗi SQL injection → **500 + HTML**, không phải JSON.

Giờ dựng plan Load. Trước hết ghi rõ tham số và lý do — R8 cấm đặt số đẹp không giải thích được:

Chạy thử ngắn (5 thread / 15 giây) để verify XML parse được và assertion hoạt động — chưa phải lượt chạy thật:

Chạy được. Kiểm 2 lỗi đó có đúng là dòng dấu nháy đơn không:

Đúng như thiết kế — cả 2 lỗi là dòng `O'Neill` → **HTTP 500**, assertion bắt chính xác.

Chạy lượt Load thật — 50 thread / ramp-up 60s / 300 giây:

Xong. Dừng monitor và bóc số liệu từ `.jtl` thô:

Số liệu tài nguyên sai — RSS 2.1 MB và CPU 0% cho một tiến trình Node phục vụ 45 req/s là bất khả thi. Monitor bắt nhầm tiến trình:

Tìm ra: `pgrep -f "node server.js"` khớp nhầm **PID 44059** — chính là tiến trình bash bao ngoài, vì chuỗi `node server.js` nằm trong dòng lệnh của nó. Backend thật là **PID 44060, RSS 117 MB, CPU 2.2%**.

Đây đúng là một lỗi do AI sinh script → phải ghi vào nhật ký R4. Sửa trước:

PID đúng rồi (44060, RSS 117 MB). Nhưng còn một vấn đề nữa về **tính đúng của phép đo**: `ps %cpu` trả về trung bình CPU trên **toàn bộ đời sống tiến trình**, không phải mức tức thời — dùng số đó trong báo cáo là tự tạo ra một lỗi diễn giải. Sửa sang đọc delta từ `/proc`:

CPU giờ phản ứng thật: **0-1% lúc rảnh → 29% lúc có tải**. Bản cũ dùng `ps %cpu` sẽ báo phẳng 2.1%. Ghi vào nhật ký:

Kịch bản Load đã chạy xong và có bằng chứng hợp lệ. Tóm tắt tiến độ:

## Đã dựng xong

**Môi trường** — `sudo` cần mật khẩu nên tôi cài bản portable vào `tools/` (Temurin JRE 21 + JMeter 5.6.3), không đụng hệ thống. `source env.sh` là dùng được.

**Dữ liệu** — DB gốc chỉ có 5 sản phẩm / 2 tài khoản, không đủ. Đã seed lên **152 sản phẩm + 212 tài khoản** và sinh 3 CSV riêng biệt: [products.csv](data/products.csv) (14 dòng), [credentials.csv](data/credentials.csv) (210), [orders.csv](data/orders.csv) (200). Kỳ vọng trong CSV tính từ danh mục tự sinh, **không lấy ngược từ phản hồi SUT** — đã kiểm

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 13 — 11/08/2026 09:50:05

**Prompt (nguyên văn):**

```text
<ide_opened_file>The user opened the file /home/qt/projects/hw05/env.sh in the IDE. This may or may not be related to the current task.</ide_opened_file>
```

**Output AI:**

```text
## HW05 là bài gì

Đo **hiệu năng** của backend EShop: hệ thống chịu được bao nhiêu người dùng cùng lúc, phản hồi chậm đi từ mức nào, và gãy ở đâu. Bài **cá nhân**, dự kiến 10 giờ, nộp Moodle (mục 1:5-10).

Khác với HW04: HW04 hỏi *"chức năng có đúng không"*, HW05 hỏi *"chức năng đó chịu tải được bao nhiêu"*. Không bắn vào giao diện web nữa mà bắn thẳng vào API cổng 3000.

---

## Bốn kiểu test — nền tảng cần hiểu trước

| Kiểu | Cách bắn | Trả lời câu hỏi | Ví dụ trong bài mình |
|---|---|---|---|
| **Load** | Số user cố định, đều, kéo dài | Ngày thường có ổn không? | 50 user duyệt sản phẩm suốt 5 phút → đã chạy: 45 req/s, p95 = 2ms |
| **Stress** | Tăng dần tới lúc **gãy** | Chết ở mức nào? | Đăng nhập: 10 → 50 → 100 → 200 user, xem tới đâu thì lỗi bung |
| **Spike** | Đang êm thì **vọt đột ngột** rồi rút | Bị sốc xong có hồi phục không? | 5 user → 200 user trong 10 giây → về 5, mô phỏng flash-sale |
| **Endurance / Soak** | Tải vừa phải nhưng **giữ lâu** (10-15 phút) | Chạy lâu có rò rỉ tài nguyên không? | Bắn đều rồi xem RSS có phình mãi không |

Ba kiểu đầu là 3 kịch bản chính, mỗi kiểu ăn **20 điểm**. Endurance nằm trong Task 1, dùng để trả lời câu "ngưỡng phần cứng của mình là bao nhiêu".

---

## Task 1 — 60 điểm (mục 6:84-96)

Đây là phần nặng nhất. Tám việc phải làm:

**1. Thiết kế bằng AI, từng bước** (mục 6:88)
Cấm một prompt kiểu *"chạy load test rồi bảo tôi hiệu năng có tốt không"*. Phải chia bước: chọn endpoint → chọn tham số → sinh CSV → sinh `.jmx` → review → chạy → phân tích. Bằng chứng chính là AI Audit Log.

**2. Ghép 1-1 giữa kịch bản và nhóm endpoint** (mục 6:88)
Ba nhóm — read-heavy, auth-heavy, transactional — mỗi nhóm đúng một kịch bản. Và phải **giải thích vì sao ghép như vậy**. Của mình:

| Kịch bản | Endpoint | Trạng thái |
|---|---|---|
| Load | `GET /api/products` | ✅ đã chạy |
| Stress | `POST /api/login` | chưa |
| Spike | `POST /api/cart` → `POST /api/checkout` | chưa |

**3. Mỗi nhóm một file CSV riêng** (mục 6:89)
Câu chốt của đề: *"A single shared CSV is not sufficient"* — dùng chung một file là mất điểm. Đã có đủ 3 file.

**4. Ba loại report view khác nhau** (mục 6:90)
JMeter có nhiều "listener" để xem kết quả. Ba plan phải dùng **ba loại khác nhau**, không lặp: Summary Report / Aggregate Report / View Results Tree.

**5. Tên file đúng khuôn** (mục 6:91) — `23127262_Load_20260811.jmx`. TA soi trực tiếp cái này.

**6. Review và sửa những gì AI làm sai** (mục 6:92)
Không chỉ liệt kê lỗi mà phải giải thích **vì sao AI trượ

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 14 — 13/08/2026 07:09:33

**Prompt (nguyên văn):**

```text
Kịch bản	Endpoint	Trạng thái
Load	GET /api/products	✅ đã chạy
Stress	POST /api/login	chưa
Spike	POST /api/cart → POST /api/checkout	chưa

bạn test như thế nào, dùng script ?
```

**Công cụ AI đã gọi:** 8 lần — `Bash`, `Read`

**Output AI:**

```text
Để tôi mở đúng những gì đã chạy ra cho bạn xem, thay vì kể lại:

Câu hỏi đúng chỗ — phân biệt này quan trọng cho điểm. Để tôi mở các file ra:

Hai câu này liên quan nhau, trả lời chung.

## Không — phần bắn tải **không** dùng script

Đề mục 6:90-91 chấm **test plan JMeter**, nên nếu tôi viết script tự gửi request thì sai yêu cầu. Thứ thực sự bắn tải là file `.jmx`, JMeter đọc nó và thực thi.

| File | Vai trò | Có phải công cụ test không? |
|---|---|---|
| [plans/23127262_Load_20260811.jmx](plans/23127262_Load_20260811.jmx) | **Test plan** — JMeter đọc và bắn tải | ✅ Đây là thứ được chấm |
| [scripts/seed-data.js](scripts/seed-data.js) | Tạo 152 sản phẩm + 212 tài khoản qua API, vì DB gốc chỉ có 5 sản phẩm / 2 user | ❌ Chỉ dựng dữ liệu trước khi test |
| [scripts/gen-csv.js](scripts/gen-csv.js) | Sinh 3 file CSV từ dữ liệu vừa seed | ❌ Chỉ dựng dữ liệu |
| [scripts/monitor.sh](scripts/monitor.sh) | Lấy mẫu CPU/RAM của process node mỗi giây trong lúc test | ❌ Chỉ ghi lại tài nguyên |
| [env.sh](env.sh) | Nạp Java + JMeter bản portable trong `tools/` (máy không cài được vì sudo cần mật khẩu) | ❌ Chỉ cấu hình |

Nội dung plan Load: 2 HTTP Sampler, **5 assertion** (3 Response + 2 Duration + 1 JSONPath), 1 Uniform Random Timer làm think-time, 1 listener. Tham số để ngoài: `${__P(threads,50)}`, `${__P(rampup,60)}`, `${__P(duration,300)}` — 50 luồng, ramp-up 60 giây, chạy 300 giây.

## "Đã chạy" nghĩa là gì

Nghĩa là lệnh này đã thực thi thật, backend đang chạy, và **13.483 request HTTP thật** đã bay vào cổng 3000:

```bash
jmeter -n -t plans/23127262_Load_20260811.jmx \
       -l results/raw/load-20260811T023204Z.jtl \
       -e -o results/html/load-20260811T023204Z/
```

Bằng chứng đang nằm trong repo, không phải tôi kể lại:

| Thứ | Thực tế |
|---|---|
| File `.jtl` thô | 2.0 MB, **13.484 dòng**, mỗi dòng là 1 request có timestamp thật |
| Thư mục HTML dashboard | `results/html/load-20260811T023204Z/` |
| Thời lượng | timestamp đầu → cuối = **298.921 ms ≈ 4 phút 59 giây** |
| Throughput | **45,11 req/s** |
| p95 | **2 ms** |
| Mẫu tài nguyên | `evidence/monitor/load-...-resource.csv` |

Dòng đầu tiên trong `.jtl` trông như thế này — đây là dữ liệu máy sinh, không sửa tay được:

```
1786415538905,14,GET danh sach san pham,200,OK,Nguoi dung duyet san pham 1-1,text,true,,22283,155,1,1,http://localhost:3000/api/products,13,0,9
```

## Lượt chạy đó bắt được một bug thật

**480 request lỗi HTTP 500**, tất cả cùng một nguyên nhân:

```
480 GET tim kiem san pham | HTT

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 15 — 13/08/2026 07:13:27

**Prompt (nguyên văn):**

```text
oke tôi hiểu, tiếp tục cho xong task 1
```

**Công cụ AI đã gọi:** 57 lần — `ToolSearch`, `Read`, `TodoWrite`, `Bash`, `Write`, `Edit`

**Output AI:**

```text
Tiếp Task 1. Còn Stress, Spike, và endurance. Đọc plan Load để tái dùng cấu trúc:

DB đã bị reset về mặc định (5 sản phẩm / 2 user) — phải seed lại trước khi chạy. Kiểm tra script seed:

Seed xong: 152 sản phẩm, 212 tài khoản. Kiểm tra ngày để đặt tên plan đúng quy ước:

Chạy thử 20 giây trước để bắt lỗi cấu hình, chưa phải lượt chính thức:

Lỗi 401 lẽ ra phải PASS vì `expect_code` là `401|403`. Bắt lỗi này trước khi chạy thật:

Chưa chạm tới dòng probe (nằm ở dòng 201-210). Ép chạy đủ lâu để tái hiện:

Tìm ra rồi — **tất cả assertion đều PASS** nhưng sample vẫn bị đánh `success=false`. JMeter mặc định coi mọi HTTP 4xx là lỗi, bất kể assertion nói gì. Với nhánh thăm dò lockout thì 401/403 là kết quả **mong đợi**, nên error rate của cả kịch bản sẽ sai:

Nhánh probe đã đúng, nhưng giờ **nhánh hợp lệ trả 401** — kiểm tra ngay:

DB bị xoá sạch lần nữa — và thủ phạm là chính lệnh chẩn đoán của tôi. Kiểm tra `database.js`:

Đây là phát hiện quan trọng, không phải lỗi vặt:

Reset script giữ nguyên 212 tài khoản. Smoke lại plan Stress:

Plan chạy đúng thiết kế — và số liệu xác nhận đúng bug: **10 tài khoản × đúng 2 lần 401 rồi sang 403**. Commit rồi chạy thật:

Commit bị gộp nhầm do tôi dùng `--amend`. Tách lại cho đúng R2:

Giờ chạy lượt Stress chính thức — reset lockout trước, monitor chạy song song:

Chạy xong nhưng **SUT không gãy** — 250 thread, 0% lỗi, max 22ms. Kiểm tra số liệu và tài nguyên:

Backend mới dùng 72% CPU đỉnh, 121 MB RSS — chưa gãy. Throughput bị chặn bởi think-time (250 thread ÷ 0,4s ≈ 625/s), không phải bởi server. Phải leo thang mới tìm được điểm gãy thật:

p95 tăng gấp hơn 3 lần (3ms → 10ms), CPU chạm 115% — đã tới vùng bão hoà nhưng vẫn 0 lỗi. Đẩy nốt một nấc để tìm điểm gãy, đồng thời theo dõi cả CPU của JMeter để biết ai mới là nút thắt:

Đây rồi — đường cong gãy rõ ràng. Phân tích chi tiết:

Hai điều cần làm rõ trước khi kết luận. Thứ nhất, 8758 "lỗi" mang mã HTTP 200 — đó là assertion độ trễ 2000ms bị vượt, tức là SLA gãy chứ không phải request hỏng. Thứ hai, phép đo CPU của JMeter trả 0% — nó tự bắt nhầm chính tiến trình vòng lặp, đúng loại lỗi PID đã gặp trước đây. Chạy lại một lượt ngắn tại vùng gãy để quy trách nút thắt cho đúng:

Ghi nhật ký review-fix ngay lúc còn nhớ bối cảnh (R4):

Sửa R13 trong CLAUDE.md vì lệnh reset tôi ghi trước đó là sai:

234 MB `.jtl` — file 106 MB vượt giới hạn 100 MB của GitHub, và Policies:41 giới hạn 20 MB/file khi nộp. Xử lý ngay:

Stress xong. Sang Spike — kịch bản khó nhất vì cả hai endpoint đều 

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 16 — 13/08/2026 08:15:22

**Prompt (nguyên văn):**

```text
xong chưa/
```

**Công cụ AI đã gọi:** 9 lần — `Bash`, `Edit`, `Write`, `TodoWrite`

**Output AI:**

```text
Chưa — soak còn khoảng 2,5 phút nữa (đã chạy 9 phút 28 giây / 12 phút).

Số liệu tạm thời đang rất ổn định:

| Chỉ số | Giá trị |
|---|---|
| Throughput | **943,7 req/s** giữ đều |
| Độ trễ trung bình | 2 ms |
| Max | 182 ms |
| Tỉ lệ lỗi | 3,57% — **cố định**, đúng bằng tỉ lệ của từ khoá `O'Neill` (BUG-01), không phải do tải |

Tỉ lệ lỗi đứng yên ở 3,57% suốt 9 phút là dấu hiệu tốt: không có lỗi nào phát sinh thêm do chạy lâu.

Đợi nó chạy nốt rồi tôi rút ra max stable RPS + trần bộ nhớ và viết README, sẽ báo lại.

Soak xong: **627 943 request trong 11 phút**. Phân tích độ ổn định theo thời gian — đây mới là thứ chứng minh "stable":

Số liệu soak rất sạch. Cập nhật manifest và viết README:

**Task 1 xong phần chạy được bằng máy.** Kết quả endurance:

| Chỉ số | Giá trị |
|---|---|
| **Max stable RPS** | **997 req/s** giữ đều 10 phút liền — dao động 996,1–997,8, biên độ dưới 0,2% |
| **Trần bộ nhớ** | **161 MB RSS** — leo từ 122 MB rồi **chững hẳn** từ phút thứ 8 |
| Trần CPU | 100–109% của **một** nhân; máy 16 nhân còn thừa rất nhiều |
| Tỉ lệ lỗi | 3,51–3,58% **không đổi theo thời gian** |

Hai điều đáng giá rút ra: nút thắt là **một nhân CPU** chứ không phải bộ nhớ hay toàn máy; và RSS chững lại chứng tỏ đường **đọc không rò rỉ** — trái ngược hẳn đường **ghi**, nơi `userCarts` phình 75 → 103,6 MB rồi không về lại mốc cũ.

Tổng kết ba kịch bản:

| Kịch bản | Mẫu | p95 | Lỗi | Kết luận |
|---|---|---|---|---|
| Load | 13 483 | 2 ms | 3,56% | Tải ngày thường không gây áp lực |
| Stress | 770 065 | 1 671 ms | 1,29% | Gãy ở ~1 626 người dùng đồng thời |
| Spike | 17 376 | 6 ms | **0%** | Hấp thụ trọn cú vọt gấp 20 lần |

8 lượt chạy, hơn 1,38 triệu request thật, `.jtl` thô giữ nguyên vẹn kèm checksum sha256 trong [MANIFEST.md](results/raw/MANIFEST.md).

Một điểm cần bạn quyết: file `.jtl` lớn nhất là **106 MB**, vượt giới hạn 100 MB của GitHub nên tôi để chúng ngoài repo (Policies:41 cho phép split-and-zip khi nộp). Nếu bạn muốn chúng nằm trong repo thì phải chạy lại với thời lượng ngắn hơn — nói tôi biết.

**Bốn việc còn lại của Task 1 chỉ bạn làm được:**

1. **Screenshot JMeter + htop cùng một khung hình** — các lượt đã chạy không dựng lại ảnh được, phải chạy lại một lượt trong lúc bạn mở htop. Tôi chuẩn bị sẵn lệnh nếu bạn muốn.
2. **Hardware report** — `screenfetch` + bảng spec, hostname phải là `qt-ThinkBook-14-G5-IRH` để khớp HW04 (đề mục 11:151).
3. **Tạo 13 GitHub Issue** — nội dung đã soạn sẵn trong [Bug-Report.md](submission/report/Bug-Report.md), 

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 17 — 13/08/2026 08:21:35

**Prompt (nguyên văn):**

```text
Tạo 13 GitHub Issue — nội dung đã soạn sẵn trong Bug-Report.md, mỗi issue cần screenshot.

mở playwright rôi tạo đi xon tự chụp ảnh cho tôi
```

**Công cụ AI đã gọi:** 28 lần — `Bash`, `Write`, `Edit`, `Read`

**Output AI:**

```text
Trước khi làm, kiểm tra công cụ sẵn có:

Đủ công cụ: `gh` đã đăng nhập sẵn, browser Playwright còn trong cache từ HW04. Kiểm tra repo và package:

Đủ điều kiện. Trước khi chạy, nói rõ tôi sẽ tạo loại ảnh nào để bạn không bị bất ngờ:

- **Ảnh chụp thật màn hình dashboard HTML** của JMeter (mở bằng Chromium qua Playwright) — dùng cho các lỗi có bằng chứng là con số đo được
- **Ảnh render lại transcript `curl` chạy thật** — tôi chạy lệnh thật vào backend, lấy nguyên văn output rồi render thành ảnh. Đây **không phải** ảnh chụp cửa sổ terminal của bạn; mỗi ảnh đều in kèm lệnh gốc để ai cũng chạy lại được

Bắt đầu — dựng backend sạch rồi chạy tái hiện thật:

Kiểm tra transcript có thật sự tái hiện được lỗi không, trước khi render ảnh:

Transcript tái hiện đúng cả 10 lỗi. Giờ render sang ảnh:

Bản Playwright trong cache đòi browser mới hơn. Dùng Google Chrome có sẵn trên máy thay vì tải về:

Kiểm tra ảnh có đọc được không trước khi đính lên GitHub:

Chữ có dấu bị lỗi dấu thanh — font monospace không dựng được tiếng Việt. Sửa: chỉ dùng monospace cho phần lệnh/output (toàn ASCII), phần tiếng Việt dùng font có hỗ trợ dấu:

Chuẩn rồi. Kiểm tra một ảnh dashboard:

Dashboard chụp rất rõ — thấy đủ tên file nguồn, 770 065 mẫu, 1,29% lỗi, p95 = 1670,95 ms. Còn PERF-01 (rò rỉ bộ nhớ) chưa có ảnh, dựng biểu đồ từ chính file đo tài nguyên:

Biểu đồ nói rõ: 75 → 119,7 MB đỉnh → chỉ về 94 MB, **19 MB không bao giờ nhả lại**. Commit và push để ảnh có URL đính vào issue:

Ảnh đã live trên GitHub. Giờ tạo 13 issue:

13/13 tạo xong. Kiểm chứng ảnh có hiển thị thật trên GitHub:

Cập nhật `Bug-Report.md` và README để số liệu khớp nhau (R6, R11):

**Xong 13 issue** — https://github.com/dinosauce-285/HW05-Software-Testing/issues

| # | Issue | Nhãn |
|---|---|---|
| 1–10 | BUG-01 … BUG-10 | `bug`, thêm `security` cho 4 lỗi bảo mật |
| 11–13 | PERF-01 … PERF-03 | `performance` |

Mỗi issue có: vị trí dòng mã, lệnh tái hiện copy-paste chạy được, kết quả thực tế vs kỳ vọng, và ảnh bằng chứng. Đã kiểm chứng ảnh tải được từ GitHub (HTTP 200).

**Về ảnh — cần bạn biết rõ vì đây là chỗ dễ bị hiểu nhầm.** Tôi không chụp màn hình máy bạn. Ba loại ảnh, mỗi ảnh đều tự khai loại của nó ở chân ảnh:

| Loại | Thực chất | Số lượng |
|---|---|---|
| Transcript render | Tôi chạy `curl` **thật** vào backend, lấy nguyên văn output rồi render thành ảnh. In kèm lệnh gốc + hostname + thời điểm để ai cũng chạy lại kiểm chứng được | 10 |
| Ảnh chụp dashboard | Mở trang HTML JMeter sinh ra bằng Chromium rồi c

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 18 — 13/08/2026 22:32:33

**Prompt (nguyên văn):**

```text
oke còn những gì phải làm lịêt kê ra cho xong task 1
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Rà lại từng gạch đầu dòng của đề mục 6:84-96. Task 1 còn **4 việc**:

## Việc tôi làm được — 2 việc

### 1. `Main-Report.md` — thiếu hẳn, và đây là điều kiện chặn

Đề mục 6:82 bắt *"document your process in the main report"*, mục 14:168 liệt nó vào danh mục nộp, mục 17:204 ghi thiếu tài liệu bắt buộc là **0 điểm toàn bài**. Hiện có `Bug-Report`, `AI-Review-Fix-Log`, `Not-Run`, `README` — nhưng **chưa có báo cáo chính**.

Nó phải chứa 5 thứ mà hiện đang nằm rải rác trong `CLAUDE.md` và các script, chưa gom vào chỗ TA đọc:

| Nội dung | Đề đòi ở đâu | Hiện nằm ở đâu |
|---|---|---|
| Lý do ghép Load↔read-heavy, Stress↔auth-heavy, Spike↔transactional | 6:88 | `CLAUDE.md` |
| Từng con số thread / ramp-up / think-time **và vì sao chọn số đó** | 6:88 | comment trong `.jmx` |
| Quy trình reset lockout — **lệnh chính xác**, không nói chung chung | 6:93 | `scripts/reset-lockout.js` |
| Ngưỡng endurance kèm số | 6:94 | `README.md` |
| Tóm tắt AI sai gì và **vì sao** | 6:92 | `AI-Review-Fix-Log.md` |

### 2. Bảng spec phần cứng

Phần **bảng** thì tôi lấy được bằng lệnh (`hostname`, `lscpu`, `free`, `lsblk`, phiên bản OS/Java/JMeter). Chỉ phần **ảnh chụp** là của bạn.

---

## Việc chỉ bạn làm được — 2 việc

### 3. Screenshot JMeter + htop **cùng một khung hình** ⬅️ quan trọng nhất

Mục 6:93 và 11:150 đòi cái này, và mục 11 ghi rõ TA verify trực tiếp. **Cả 3 kịch bản đều đang thiếu.** Ảnh không dựng lại được từ lượt đã chạy — phải chạy lại thật trong lúc bạn chụp.

Tôi chuẩn bị sẵn cho bạn: mở 2 cửa sổ cạnh nhau, một chạy `htop -p <pid backend>`, một chạy JMeter, rồi chụp cả màn hình. Nói tôi biết thì tôi viết script gom sẵn để bạn chỉ việc chạy một lệnh rồi bấm chụp — có thể tiện thể quay luôn video (việc 4) trong cùng lượt đó.

### 4. Video ≥ 6 phút, giọng tiếng Việt của bạn

Mục 6:95. Được cắt thành nhiều clip, mỗi kịch bản một clip. Điều kiện: JMeter và resource monitor **chung khung hình**.

---

## Không thuộc Task 1 nhưng còn nợ

Task 2 (10đ), Task 3 (10đ), Agent Skill (10đ, `.claude/skills/` đang rỗng), AI Audit Report + AI Critique, `git-log.txt`, và bản PDF.

---

Tôi bắt tay viết `Main-Report.md` và bảng spec phần cứng luôn nhé? Đó là hai thứ chặn Task 1 mà không cần bạn động tay.
```

---

## Lượt 19 — 13/08/2026 22:33:48

**Prompt (nguyên văn):**

```text
oke làm cái main-report
```

**Công cụ AI đã gọi:** 7 lần — `Bash`, `Write`

**Output AI:**

```text
Trước khi viết, kiểm lại hai con số tôi đã dùng trong Bug-Report — nghi có sai:

Đúng là sai hai chỗ — RSS đỉnh thật là **119,7 MB** (tôi đọc nhầm một dòng mẫu chứ không lấy max), và số lần thêm giỏ là **8 767** chứ không phải 12 767. Sửa cả file lẫn issue:

Giờ viết báo cáo chính. Gom số liệu chính xác của mọi lượt chạy để không viết sai (R11):

Đo thời gian hồi phục của Spike — nền trước, trong, và sau cú vọt:

Kết quả bất ngờ: trong lúc bị vọt, độ trễ nền lại **giảm** (3,0 → 1,84 ms), và hồi phục dưới 15 giây. Lấy nốt thông số máy rồi viết:

Xong [Main-Report.md](submission/report/Main-Report.md) — 12 mục, phủ trọn Task 1.

**Năm thứ đề bắt buộc mà trước đó nằm rải rác, giờ đã gom vào chỗ TA đọc:**

| Nội dung | Mục | Đề đòi |
|---|---|---|
| Lý do ghép 3 kịch bản với 3 nhóm endpoint | 1 | 6:88 |
| Từng tham số thread/ramp-up/think-time **và vì sao chọn số đó** | 5.1, 6.1, 7.1 | 6:88 |
| Quy trình reset lockout — lệnh chính xác + output kiểm chứng | 6.2 | 6:93 |
| Ngưỡng endurance bằng số | 8.3 | 6:94 |
| AI sai gì và **vì sao sai** | 9 | 6:92 |

**Hai số liệu tôi phát hiện mình viết sai và đã sửa** trước khi đưa vào báo cáo:

- RSS đỉnh lượt Spike: **119,7 MB** chứ không phải 103,6 MB — trước đó tôi đọc một dòng mẫu thay vì lấy max
- Số lần thêm giỏ: **8 767** chứ không phải 12 767

Đã sửa đồng loạt ở `Bug-Report.md`, `README.md` và GitHub Issue #11 để ba nơi khớp nhau (R11).

**Hai thứ đo được trong lúc viết báo cáo:**

- **Thời gian hồi phục sau spike: dưới 15 giây.** Khung 15 giây đầu ngay sau cú vọt đã về 3,32 ms, tương đương mức nền 3,0 ms trước đó.
- **Trong lúc bị vọt gấp 20 lần, độ trễ nền lại *giảm*** — từ ~3,0 ms xuống 1,84 ms. Tôi ghi nhận thẳng cùng lời giải thích ở mục 7.5 thay vì lờ đi: ở mức tải này SUT còn xa điểm bão hoà nên chi phí cố định mới là thứ chi phối, không phải tranh chấp tài nguyên.

Phần kết luận nêu điều đáng nói nhất của bài: throughput 45,1 req/s của kịch bản Load trông như giới hạn của server, nhưng thực ra là giới hạn của think-time — **lệch hơn 20 lần** so với 997 req/s đo được ở soak. Đây chính là loại bẫy mà Task 2 sẽ đi săn.

Commit `362dd59`, đã push.

Task 1 giờ chỉ còn **3 việc tay của bạn**: screenshot JMeter+htop cùng khung hình, hardware report, và video ≥6 phút. Muốn tôi viết script gom sẵn để bạn chạy một lệnh là có đủ cả hai cửa sổ trong một khung, chụp/quay luôn một thể không?
```

---

## Lượt 20 — 13/08/2026 22:41:22

**Prompt (nguyên văn):**

```text
tiếp theo task 2 yêu cầu gì
```

**Output AI:**

```text
## Task 2 — 10 điểm (đề mục 6:98-104)

Ba bước, **bắt buộc đúng thứ tự**. Điểm nằm gần hết ở bước 2.

### Bước 1 — Cho AI phân tích (mục 6:102)

> *"prompt an AI tool to analyse the `.jtl` logs and suggest performance thresholds"*

Đưa file `.jtl` thô cho AI, bảo nó phân tích và đề xuất ngưỡng hiệu năng. Đây là **output của AI**, không phải của bạn — và phải giữ nguyên văn, kể cả chỗ nó sai.

### Bước 2 — Săn chỗ AI đọc sai ⬅️ chấm chặt nhất

> *"For each misinterpretation, cite the **correct value from your raw `.jtl` log** and explain the error"*

Mỗi lỗi diễn giải phải có đủ **ba** thứ:

| Thành phần | Nghĩa là |
|---|---|
| AI nói gì | Trích nguyên văn câu sai |
| Giá trị đúng | Con số lấy từ `.jtl` thô **bằng lệnh**, kèm chính lệnh đó |
| Vì sao sai | Giải thích cơ chế dẫn tới hiểu lầm |

Thang điểm mục 15:188 ghi thẳng *"with correct values from raw logs"* — thiếu con số đối chứng là mất điểm, dù phần "AI sai" viết hay đến đâu.

### Bước 3 — Phân loại đề xuất tối ưu (mục 6:104)

> *"classify each as **feasible or hallucinated**, with reasoning"*

Bảo AI đề xuất tối ưu (đề gợi ý: thêm index CSDL, connection pool, bật SQLite WAL), rồi tự phân loại từng cái là **làm được** hay **AI bịa**, kèm lý do.

---

## Mình đang có sẵn 4 cái bẫy rất ngon

Đây là chỗ bài này có lợi thế — dữ liệu thật đã lộ ra mấy thứ mà AI gần như chắc chắn đọc sai:

| Bẫy | AI sẽ nói gì | Sự thật đo được |
|---|---|---|
| **Throughput 45,1 req/s** ở kịch bản Load | "Server chỉ chịu được ~45 req/s" | Đó là giới hạn của **think-time**, không phải của server. Soak đo được **997 req/s** — lệch hơn 20 lần |
| **Mật khẩu plaintext** | "Độ trễ login cao do chi phí băm bcrypt" | `server.js:46` so sánh chuỗi trần, **không hề băm**. Đây là mồi đề bài dựng sẵn |
| **Error rate 1,29%** ở Stress | "Server trả lỗi khi quá tải" | 8 758/9 971 = **88%** là HTTP 200 thành công, chỉ vượt ngưỡng SLA 2000 ms |
| **Error rate 3,57%** ở soak | "Tỉ lệ lỗi tăng do chạy lâu" | Đứng yên 3,51–3,58% suốt 11 phút, và 100% đến từ đúng một từ khoá `O'Neill` (BUG-01) |

---

## Một vướng mắc về phương pháp, cần nói thẳng

Bước 1 và bước 2 đối kháng nhau: AI phân tích, rồi có người phải bắt lỗi AI. **Nếu tôi làm cả hai thì thành ra tôi tự chấm tôi** — lỗi sinh ra sẽ là lỗi tôi cố tình gài, không phải lỗi thật, và mục 2:21 đòi *"Human review... You are fully responsible"*.

Cách làm cho nó hợp lệ:

1. Chạy bước 1 trong một **phiên AI riêng, chỉ được nhìn bảng thống kê tóm tắt** — đúng tình huống thật khi người ta q

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 21 — 13/08/2026 22:43:27

**Prompt (nguyên văn):**

```text
oke làm đi rồi tôi tự phân tích lại chứ tôi có kêu bạn tự làm tự verify đâu
```

**Công cụ AI đã gọi:** 6 lần — `Bash`, `Agent`, `Write`

**Output AI:**

```text
Rõ. Tôi chỉ làm **bước 1** — sinh ra bản phân tích AI thật, chưa qua kiểm chứng. Việc săn lỗi là của bạn.

Dựng môi trường cô lập để phiên AI kia không nhìn thấy kết luận của mình:

Trong lúc nó chạy, tôi dựng bộ công cụ để **bạn** tự kiểm chứng — mọi con số phải lôi ra được từ `.jtl` thô bằng lệnh (mục 6:103):

Bộ công cụ khớp chính xác với `statistics.json` do JMeter tự sinh (13483 mẫu, 480 lỗi, p95=2ms) — nghĩa là nó tính đúng. Giờ dựng khung để bạn điền phần săn lỗi:

Đã chuẩn bị xong phần của tôi trong lúc phiên AI kia đang phân tích:

**1. Bộ trích số liệu từ `.jtl` thô** — [scripts/jtl-stats.py](scripts/jtl-stats.py), 5 lệnh con:

```bash
python3 scripts/jtl-stats.py summary  <file.jtl>    # thống kê theo sampler
python3 scripts/jtl-stats.py errors   <file.jtl>    # phân rã nguyên nhân lỗi
python3 scripts/jtl-stats.py timeline <file.jtl>    # diễn biến theo thời gian
python3 scripts/jtl-stats.py threads  <file.jtl>    # tải đồng thời ↔ độ trễ
python3 scripts/jtl-stats.py steady   <file.jtl>    # throughput ở trạng thái ổn định
```

Nó tính thẳng từ log thô, **không** đọc `statistics.json` — vì mục 6:103 đòi con số phải truy về raw log. Đã đối chứng: kết quả trùng khít với bản JMeter tự sinh (13 483 mẫu, 480 lỗi, p95 = 2 ms), nên nó tính đúng.

**2. Khung điền cho bạn** — [Task2-Misinterpretation-Hunt.md](submission/report/Task2-Misinterpretation-Hunt.md): bảng bước 2 (săn lỗi), bảng bước 3 (phân loại feasible/hallucinated), bảng tổng kết. Tôi để trống, không điền hộ.

Có kèm 3 câu hỏi rà soát, trong đó câu quan trọng nhất là: *con số này là giới hạn của **hệ thống được đo**, hay giới hạn của **cách đo**?*

**Về việc cô lập** — phiên AI phân tích chỉ được cấp 4 file `.jtl` và một mô tả trung lập (Node.js + SQLite, danh sách endpoint, cấu hình máy). Không có mã nguồn SUT, không có báo cáo chính, không biết gì về 13 lỗi đã tìm ra. Tôi ghi rõ cách cô lập này vào đầu file để TA thấy lỗi tìm được là lỗi thật chứ không phải dàn dựng.

Đang chờ bản phân tích. Xong tôi lưu nguyên văn vào `AI-Analysis-Raw.md` và báo bạn.
```

---

## Lượt 22 — 13/08/2026 22:54:43

**Prompt (nguyên văn):**

```text
xong chưa
```

**Công cụ AI đã gọi:** 4 lần — `ListAgents`, `Write`, `Bash`

**Output AI:**

```text
Chưa — phiên phân tích vẫn đang chạy, đã 9 phút. Hợp lý vì nó phải quét 2 file lớn (106 MB và 95 MB, tổng hơn 1,4 triệu dòng).

Phần của tôi đã xong và commit rồi (`f1c66bf`): bộ trích số liệu `jtl-stats.py` và khung điền `Task2-Misinterpretation-Hunt.md`.

Tôi sẽ báo ngay khi có bản phân tích, rồi lưu nguyên văn vào `AI-Analysis-Raw.md` — kể cả những chỗ nó viết sai, vì đó chính là nguyên liệu cho bước 2 của bạn.

Bản phân tích đã xong sau ~10 phút. Lưu **nguyên văn**, không sửa một chữ:

Xong bước 1. Bản phân tích lưu nguyên văn ở [AI-Analysis-Raw.md](submission/appendix/AI-Analysis-Raw.md) — 7 715 từ, không sửa một chữ, kèm prompt nguyên văn và mô tả đúng những gì phiên AI đó được cấp.

**Cần báo trước để bạn khỏi mất thời gian sai hướng: đây không phải một bản phân tích dở.** Nó khá mạnh — tự tính lại percentile từ log thô, tự bóc tách 9 971 "lỗi" ra thành SLA-vi-phạm và timeout thật, và thậm chí tự suy ra được mật khẩu là plaintext từ chỗ độ trễ 1 ms ở tải thấp. Cái bẫy bcrypt mà tôi tưởng nó sẽ dính thì nó lại tránh được, còn quay ra cảnh báo người khác đừng dính.

Nên việc săn lỗi sẽ khó hơn dự kiến. Bù lại, khi bạn tìm ra thì mỗi lỗi có sức nặng hơn hẳn.

**Một điều tôi phải nói thẳng:** có vài chỗ số của nó **lệch với số trong Main-Report của tôi**. Ví dụ điểm gãy, thời gian hồi phục sau spike, và p95 của lượt Stress. Tôi **không** kết luận bên nào đúng — và bạn đừng mặc định là nó sai. Nó dùng phương pháp cắt dữ liệu khác tôi (theo mức đồng thời thực trong cột `allThreads`, và cửa sổ 1 giây thay vì 15 giây), mà cách đó có thể chính xác hơn cách tôi làm. Việc đối chiếu bằng lệnh sẽ cho ra câu trả lời, và **kết quả có thể là báo cáo của tôi mới là chỗ phải sửa**.

Đó thực ra đúng tinh thần mục 6:103 — bắt lỗi diễn giải, bất kể lỗi của ai.

**Bạn có sẵn để làm việc:**

- Bản phân tích thô — [AI-Analysis-Raw.md](submission/appendix/AI-Analysis-Raw.md)
- Khung điền 3 bảng — [Task2-Misinterpretation-Hunt.md](submission/report/Task2-Misinterpretation-Hunt.md)
- Bộ trích số — `python3 scripts/jtl-stats.py {summary|errors|timeline|threads|steady} <file.jtl>`
- 4 file `.jtl` thô trong `results/raw/`, và `sut/backend/server.js` — thứ mà phiên AI kia không được nhìn

Commit `8f98066`. Khi bạn điền xong bảng, gọi tôi nếu muốn tôi gom kết quả vào báo cáo chính và cập nhật AI Audit Report.
```

---

## Lượt 23 — 13/08/2026 23:03:06

**Prompt (nguyên văn):**

```text
còn gì của task 2
```

**Output AI:**

```text
Task 2 còn **3 việc của bạn** và **1 việc của tôi sau đó**.

## Của bạn

### Bước 2 — Săn lỗi diễn giải (chỗ ăn điểm chính)

Bảng trống ở [Task2-Misinterpretation-Hunt.md](submission/report/Task2-Misinterpretation-Hunt.md). Mỗi dòng cần đủ ba thành phần theo mục 6:103: AI nói gì → giá trị đúng kèm lệnh lấy ra → vì sao sai.

Đề không quy định số lượng tối thiểu. Nhưng thang điểm mục 15:188 ghi rõ *"with correct values from raw logs"*, nên **chất lượng dẫn chứng quan trọng hơn số dòng** — 3 lỗi có số đối chứng chắc ăn hơn 8 lỗi nói chung chung.

### Bước 3 — Phân loại 10 đề xuất tối ưu

Phần 3 của bản phân tích có đúng **10 đề xuất**, AI đã tự xếp thành 3 nhóm:

| Nhóm | Mã | Nội dung |
|---|---|---|
| A — làm ngay | A1, A2, A3 | prepared statement · backlog TCP + keep-alive · giới hạn vòng đời giỏ hàng |
| B — nâng trần | B1, B2, B3, B4 | Node cluster · cache + ETag · SQLite WAL · connection reuse + index |
| C — cân nhắc | C1, C2, C3 | băm mật khẩu · chuyển PostgreSQL · full-text search |

Việc của bạn là gán **feasible / hallucinated** cho từng cái kèm lý do. Lưu ý cách AI tự xếp nhóm **không phải** là phân loại mà đề yêu cầu — nó xếp theo độ ưu tiên, còn đề hỏi cái nào làm được thật và cái nào nó bịa.

### Bước 4 — Bảng tổng kết

Đếm số nhận định đã kiểm, số đúng/sai, tỉ lệ feasible/hallucinated.

## Của tôi, sau khi bạn xong

Gom kết quả vào báo cáo chính (hiện đang có dòng ghi *"Task 2 sẽ được bổ sung khi hoàn thành"*), và thêm các artifact của Task 2 vào AI Audit Report theo mẫu 5 mục.

---

## Một lưu ý về cách chấm

Nếu bước 2 tìm ra rằng chỗ sai nằm ở **báo cáo của tôi** chứ không phải ở bản phân tích AI, thì vẫn tính là làm đúng bài — mục 6:103 hỏi lỗi diễn giải metric, không hỏi "chứng minh AI ngu". Ngược lại, nếu bạn kết luận một nhận định nào đó của AI là đúng thì cũng nên ghi vào bảng tổng kết bước 4, vì tỉ lệ đúng/sai là một phần của kết quả.

Cần tôi giải thích thêm cách đọc output của `jtl-stats.py`, hay để bạn tự chạy trước?
```

---

## Lượt 24 — 13/08/2026 23:16:56

**Prompt (nguyên văn):**

```text
oke task 3 còn gi
```

**Output AI:**

```text
Task 3 **chưa làm gì cả** — còn nguyên 10 điểm. Đề mục 6:106-108 đòi ba thứ:

## 1. Mô hình kiểm thử hiệu năng liên tục — đủ 3 khâu

> *"propose a continuous performance-testing model that **watches the SUT's commits**, **decides whether to run** performance tests, and **flags p95 regressions**"*

| Khâu | Câu hỏi phải trả lời |
|---|---|
| Theo dõi commit | Bắt sự kiện gì? Commit nào cũng chạy, hay chỉ khi đụng vào file nào? |
| Quyết định có chạy không | Tiêu chí nào? Chạy bộ nào — smoke 2 phút hay soak đầy đủ? |
| Cảnh báo p95 xấu đi | So với mốc nào? Lệch bao nhiêu thì báo? Báo cho ai, chặn merge hay chỉ cảnh báo? |

## 2. Flow chart — **bắt buộc**

Đề ghi thẳng *"Include a **flow chart**"*. Thiếu là mất điểm, không phải trang trí.

## 3. Bàn trade-off — chi phí và báo động giả

> *"a discussion of the **trade-offs** (cost, false alarms)"*

---

## Chỗ bài này có lợi thế

Phần lớn sinh viên sẽ viết Task 3 kiểu lý thuyết suông — "đặt ngưỡng p95, vượt thì cảnh báo". Mình có **số liệu thật để đặt ngưỡng có căn cứ**, và quan trọng hơn là **đo được nhiễu nền**:

Lượt soak cho thấy p95 dao động **6 → 10 ms** giữa 5 đoạn của cùng một lượt chạy, cùng một code, cùng một máy. Nghĩa là **nếu đặt ngưỡng cảnh báo ở mức "p95 tăng 50%" thì hệ thống sẽ tự báo động giả với chính nó** dù chẳng ai đổi dòng code nào.

Đó chính là câu trả lời định lượng cho phần trade-off "false alarms" mà đề hỏi — rút thẳng từ dữ liệu đo được chứ không phải nói chung chung.

Thêm hai thứ nữa dùng được:

- **Chi phí thật**: soak 11 phút, stress 6,5 phút, tổng 8 lượt chạy hết khoảng 45 phút máy. Con số này cho phép tính cụ thể "chạy full suite mỗi commit tốn bao nhiêu" thay vì phán bừa.
- **Chỉ báo tốt hơn p95**: bản phân tích AI chỉ ra `Connect` p95 giữ nguyên 0–1 ms suốt từ 0 đến 1 700 luồng rồi nhảy thẳng lên 1 020 ms — một ngưỡng nhị phân sạch, gần như không có vùng xám. Nếu kiểm chứng được thì đây là chỉ báo ít báo động giả hơn hẳn p95. *(chưa verify — thuộc phần bạn đang review ở Task 2)*

---

Tôi viết Task 3 nhé? Dự kiến gồm: tài liệu đề xuất + flow chart vẽ bằng Mermaid (GitHub render trực tiếp, và xuất PNG được để nhét vào PDF). Bạn muốn flow chart kiểu Mermaid hay Excalidraw vẽ tay cho giống sơ đồ trình bày?
```

---

## Lượt 25 — 13/08/2026 23:17:49

**Prompt (nguyên văn):**

```text
oke thực hiện task 3
```

**Công cụ AI đã gọi:** 7 lần — `Bash`, `Write`, `Read`, `Edit`

**Output AI:**

```text
Chốt Mermaid — GitHub render thẳng trong repo, và xuất PNG được để nhét vào PDF.

Trước hết đo **nhiễu nền** thật, vì đó là căn cứ để đặt ngưỡng cảnh báo:

Nhiễu nền đo được rất rõ: cùng một code, cùng một máy, cùng một mức tải mà **p95 dao động 6 → 11 ms (1,83 lần)**, trong khi **p50 đứng yên 2 ms suốt 10 phút**. Đây là căn cứ để thiết kế ngưỡng cảnh báo:

Render flow chart ra PNG để nhét vào PDF, đồng thời kiểm cú pháp Mermaid có hợp lệ không:

Flow chart render đúng, đọc được rõ. Nhúng ảnh vào tài liệu để bản PDF cũng hiện được:

Xong Task 3: [Task3-Continuous-Performance-Testing.md](submission/report/Task3-Continuous-Performance-Testing.md) + flow chart Mermaid (render được trên GitHub, và có bản PNG cho PDF).

Đủ ba thứ đề đòi ở mục 6:108: **flow chart**, **3 khâu**, **trade-off**.

## Cách tôi tiếp cận khác một bản đề xuất thông thường

Thay vì chọn ngưỡng rồi biện luận, tôi **đo nhiễu nền trước**. Lấy lượt soak — cùng một commit, cùng một máy, cùng một mức tải — rồi cắt theo từng phút:

| Phút | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| p50 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| **p95** | 6 | 6 | 8 | 9 | **10** | **11** | 9 | 8 | 8 | 9 |

**p95 dao động 1,83 lần khi không ai sửa một dòng code nào.** Con số đó quyết định gần như toàn bộ thiết kế:

- Ngưỡng kiểu *"p95 tăng 20% thì báo động"* sẽ **tự kêu với chính nó** — phút 1 so phút 6 đã là +83%
- Nên p95 **không thể** làm tín hiệu chính, dù đề gợi ý vậy. Tôi vẫn giữ p95 đúng yêu cầu nhưng nới ngưỡng lên 2,0 lần và đặt nó trong tín hiệu tổ hợp
- **p50 mới là tín hiệu chính** — bất biến 2 ms suốt 10 phút, nhiễu gần bằng 0

## Một cái bẫy mà số liệu bài này lộ ra

Ngưỡng tuyệt đối kiểu *"error rate > 1% thì chặn merge"* sẽ **chặn mọi commit, vĩnh viễn** — vì SUT có sẵn 3,57% lỗi nền cố định từ BUG-01. Baseline bắt buộc phải là tương đối so với lượt chạy xanh gần nhất.

## Chi phí tính bằng số thật

Con số 45 phút cho full suite không phải ước lượng — đó là tổng thời lượng thật của 8 lượt chạy ở Task 1 (47,3 phút). Từ đó ra được: ~105 phút máy/ngày với đội 20 commit, tức khoảng **25 USD/tháng** trên GitHub Actions.

Tôi cũng ghi thẳng phần **giới hạn của chính mô hình** — quan trọng nhất là nhiễu 1,83 lần đo trên laptop rảnh rỗi, còn CI runner dùng chung sẽ ồn hơn nhiều, nên phải đo lại nhiễu trên chính runner đó trước khi áp ngưỡng.

---

**Còn lại:** Task 2 bước 2–3 (của bạn), Agent Skill (10đ, `.claude/skills/` vẫn rỗng), AI Audit Report + AI Criti

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 26 — 17/08/2026 09:17:36

**Prompt (nguyên văn):**

```text
oke giờ liệt ke các task còn lại để tôi xong cái bài tập này
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Rà toàn bộ. Còn **13 việc**, chia làm ba nhóm theo mức độ nguy hiểm.

---

## 🔴 Nhóm 1 — Thiếu là **0 điểm toàn bài** (mục 17:204)

| # | Việc | Ai | Trạng thái |
|---|---|---|---|
| 1 | **AI Audit Report** theo mẫu 5 mục của Khoa | tôi | ⬜ chưa có file |
| 2 | **AI Critique 200–300 chữ** | tôi | ⬜ chưa có file |
| 3 | **AI-Prompt-Log** — tên công cụ / ngày giờ / prompt nguyên văn / output (mục 9:130-134) | tôi | ⬜ transcript 6,7 MB có sẵn, chưa trích xuất |
| 4 | **git-log.txt** | tôi | ⬜ một lệnh |
| 5 | **Screenshot JMeter + htop chung một khung hình** | **bạn** | ⬜ cả 3 kịch bản đều thiếu |
| 6 | **Hardware report** — ảnh screenfetch + hostname khớp HW04 | **bạn** | ⬜ `evidence/hardware/` rỗng |
| 7 | **Video Task 1 ≥ 6 phút**, giọng tiếng Việt | **bạn** | ⬜ |
| 8 | **Bản PDF** của báo cáo chính, AI Audit, AI Critique | **bạn** | ⬜ |

---

## 🟡 Nhóm 2 — Điểm chưa lấy

| # | Việc | Điểm | Ai | Ghi chú |
|---|---|---|---|---|
| 9 | **Agent Skill** — `.claude/` hiện **chưa tồn tại** | **10** | tôi | Kèm video demo riêng (mục 7:113) → phần video là của bạn |
| 10 | **Task 2 bước 2, 3, 4** — săn lỗi + phân loại + tổng kết | **10** | **bạn** | Bước 1 đã xong |

---

## 🟢 Nhóm 3 — Hoàn thiện, không chặn nhưng nên làm

| # | Việc | Ai |
|---|---|---|
| 11 | Gộp Task 2 + Task 3 vào Main-Report (hiện đang ghi *"sẽ bổ sung"*) | tôi — sau khi bạn xong việc 10 |
| 12 | Bảng spec phần cứng (phần **bảng**, ảnh là của bạn) | tôi |
| 13 | Điền bảng tự đánh giá + 2 link YouTube vào README | **bạn** |

---

## Đề xuất thứ tự làm

**Bước 1 — tôi làm ngay, không cần chờ bạn:** việc 9 (Agent Skill), 3, 4, 12.

**Bước 2 — bạn làm, gộp một buổi:** mở htop cạnh terminal, chạy lại 3 kịch bản, **vừa quay video vừa chụp screenshot** — giải quyết luôn việc 5, 6, 7. Quay thêm một clip dùng Agent Skill là xong việc 9.

**Bước 3 — bạn làm:** việc 10 (Task 2 săn lỗi).

**Bước 4 — tôi làm cuối:** việc 1, 2, 11 — vì AI Audit Report phải liệt kê *mọi* artifact, và AI Critique phải nhắc tới kết quả săn lỗi của bạn. Làm sớm thì phải viết lại.

**Bước 5 — bạn chốt:** việc 13, 8, rồi đóng gói `23127262_HW05_AI_Performance_100.zip`.

---

Một lưu ý: **`.claude/` chưa hề tồn tại**, nên R12 trong CLAUDE.md ("bồi skill dần từ scenario Load") đã không được thực hiện. Giờ dựng thì skill vẫn thật — quy trình đã chạy 8 lượt và có sẵn `jtl-stats.py`, `reset-db.sh`, `monitor.sh`, `render-mermaid.js` để chắt vào — nhưng phải nói thẳng là nó được đúc kết **sau khi** làm xong chứ không phải bồi dần trong

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 27 — 17/08/2026 09:19:28

**Prompt (nguyên văn):**

```text
ủa nếu bước 1 có vài cái xong hết rồi hẵn xuất ra chứ giờ nó có một bản nhưng sau này phải bổ sung,
```

**Output AI:**

```text
Đúng, tôi xếp sai thứ tự. Ba trong bốn việc ở bước 1 là loại **"xuất một lần lúc cuối"**, làm bây giờ là chắc chắn phải làm lại:

| Việc | Vì sao phải để cuối |
|---|---|
| `git-log.txt` | Mỗi commit mới là file này lỗi thời. Còn ít nhất chục commit nữa |
| AI-Prompt-Log | Trích từ transcript phiên làm việc — mà phiên vẫn đang chạy, càng nói chuyện càng dài ra |
| AI Audit Report | Mẫu bắt **1 hàng / artifact**. Chưa có Agent Skill, chưa có kết quả Task 2 của bạn → viết giờ là thiếu hàng |
| AI Critique | Phải nhắc tới chỗ AI sai mà **bạn** tìm ra ở Task 2. Chưa có thì viết ra chỉ là văn suông |

## Xếp lại theo phụ thuộc

**Làm ngay — chỉ 2 việc, và cả hai đều chặn việc của bạn:**

| Việc | Vì sao phải làm trước |
|---|---|
| **Agent Skill** (10đ) | Bạn cần nó **tồn tại** mới quay được video demo. Đang chặn |
| Bảng spec phần cứng | Để bạn biết cần chụp những thông tin gì trong ảnh screenfetch |

**Rồi tới lượt bạn:** quay video + chụp screenshot (gộp một buổi), và Task 2 săn lỗi.

**Cuối cùng tôi xuất một lượt:** AI-Prompt-Log → AI Audit Report → AI Critique → gộp Task 2/3 vào Main-Report → `git-log.txt`. Đúng thứ tự đó, vì cái sau ăn dữ liệu của cái trước, và `git-log.txt` phải là **lệnh cuối cùng** chạy trước khi bạn đóng gói.

Làm Agent Skill luôn nhé?
```

---

## Lượt 28 — 17/08/2026 09:21:02

**Prompt (nguyên văn):**

```text
khoan đã giờ list ra tất cả task còn thiếu rồi show cho tôi 2 nhóm chính là làm ở cuối cùng và làm ngay, mỗi nhóm chính có 2 nhóm nhỏ là bạn làm hay tôi làm
```

**Output AI:**

```text
## NHÓM A — LÀM NGAY

### A1 · Tôi làm

| # | Việc | Điểm | Ghi chú |
|---|---|---|---|
| 1 | **Agent Skill** — dựng `.claude/skills/` | **10** | Đang chặn video demo của bạn |
| 2 | Bảng spec phần cứng (`evidence/hardware/spec.md`) | — | Để bạn biết ảnh screenfetch cần thể hiện gì |

### A2 · Bạn làm

| # | Việc | Điểm | Ghi chú |
|---|---|---|---|
| 3 | **Task 2 — bước 2, 3, 4**: săn lỗi + phân loại feasible/hallucinated + tổng kết | **10** | Độc lập, làm được ngay |
| 4 | **Screenshot JMeter + htop chung một khung hình** | 🔴 chặn | Cả 3 kịch bản đều thiếu — phải chạy lại để chụp |
| 5 | **Ảnh hardware** — screenfetch/neofetch + `hostname` + `whoami` | 🔴 chặn | Hostname phải là `qt-ThinkBook-14-G5-IRH` để khớp HW04 |
| 6 | **Video Task 1 ≥ 6 phút**, giọng tiếng Việt | 🔴 chặn | Gộp chung buổi với việc 4 và 5 |
| 7 | **Video demo Agent Skill** | — | Chờ tôi xong việc 1 |

---

## NHÓM B — LÀM CUỐI

### B1 · Tôi làm — đúng thứ tự này, cái sau ăn dữ liệu cái trước

| # | Việc | Vì sao phải cuối |
|---|---|---|
| 8 | **AI-Prompt-Log** — trích transcript phiên làm việc | Phiên còn đang chạy, càng làm càng dài |
| 9 | **AI Audit Report** (mẫu 5 mục) | 🔴 chặn · 1 hàng/artifact — phải có đủ Agent Skill và kết quả Task 2 mới liệt kê hết |
| 10 | **AI Critique 200–300 chữ** | 🔴 chặn · Phải dẫn được chỗ AI sai mà **bạn** tìm ra ở việc 3 |
| 11 | Gộp Task 2 + Task 3 vào Main-Report | Hiện đang ghi *"sẽ bổ sung sau"* |
| 12 | Ghi xác nhận **không trùng endpoint với nhóm** vào báo cáo chính | Mục 5:78 — bạn đã chốt với nhóm, còn thiếu dòng ghi nhận |
| 13 | **`git-log.txt`** | Phải là lệnh **cuối cùng** — mỗi commit mới là file này lỗi thời |

### B2 · Bạn làm — sau khi tôi xong B1

| # | Việc | Ghi chú |
|---|---|---|
| 14 | Điền **bảng tự đánh giá** + **2 link YouTube** vào README | Hiện còn `<điền>` |
| 15 | **Xuất PDF**: Main-Report, AI Audit Report, AI Critique | 🔴 chặn · mục 2:23 |
| 16 | **Đóng gói** `23127262_HW05_AI_Performance_100.zip` | 🔴 chặn · file lớn nhất 106 MB, cần split-and-zip |

---

## Tổng kết

| | Tôi | Bạn |
|---|---|---|
| **Làm ngay** | 2 việc (10đ) | 5 việc (10đ) |
| **Làm cuối** | 6 việc | 3 việc |
| **Tổng** | **8** | **8** |

**20 điểm còn treo:** Agent Skill (tôi) và Task 2 bước 2–4 (bạn) — hai việc này độc lập nhau, làm song song được.

**8 mục 🔴** thiếu là 0 điểm toàn bài, trong đó **6 mục nằm ở phía bạn** (screenshot, hardware, video, PDF, zip) — đây mới là đường găng thật của bài, không phải phần code.

Bắt đầu việc 1 nhé?
```

---

## Lượt 29 — 17/08/2026 09:22:15

**Prompt (nguyên văn):**

```text
xuất ra file để checklist dần, nhác trong file claude.md làm gì cũng phải checklist cho biết khi nào xong
```

**Công cụ AI đã gọi:** 4 lần — `Write`, `Edit`, `Bash`

**Output AI:**

```text
Giờ thêm quy tắc vào CLAUDE.md để checklist không bị bỏ quên:

Số đếm bằng lệnh không khớp bảng tôi viết tay — sửa lại, và phát hiện thêm một chỗ trong CLAUDE.md vẫn ghi lệnh reset nguy hiểm:

Xong. [CHECKLIST.md](CHECKLIST.md) — **22 xong / 31 còn**, đếm bằng lệnh chứ không tự viết số.

## Cấu trúc

| Phần | Nội dung |
|---|---|
| **Tiến độ** | Bảng đếm + lệnh tự kiểm |
| **ĐÃ XONG** | 22 mục đã tick, có cả số liệu chốt (997 req/s, 161 MB, 13 issue) |
| **NHÓM A — làm ngay** | A1 Claude (2) · A2 bạn (7) |
| **NHÓM B — làm cuối** | B1 Claude (6, đánh số theo thứ tự phụ thuộc) · B2 bạn (4) |
| **Kiểm tra lần cuối** | 12 điều kiện chặn, soát trước khi nộp |

Mỗi dòng có ký hiệu mức độ — 🔴 thiếu là 0 điểm toàn bài · 🟡 mất điểm mục đó · ⚪ hoàn thiện — và trích dẫn `mục:dòng` của đề để biết vì sao nó nằm đó.

## Thêm R14 vào CLAUDE.md

Bốn điều giờ thành tự động, không cần bạn nhắc:

- Xong việc nào **tick ngay trong cùng phiên**, cùng lúc với commit — không gom cuối buổi
- Phát sinh việc mới → thêm dòng ngay lúc phát hiện, kèm ký hiệu và trích dẫn đề
- Cập nhật bảng tiến độ mỗi lần tick, **đếm lại bằng lệnh**
- Bạn hỏi "còn gì phải làm" → tôi **đọc file** rồi trả lời, không liệt kê từ trí nhớ

Và một điều chặn tôi tick khống: chỉ được `[x]` khi **file thật đã tồn tại** hoặc **lệnh đã chạy thật**.

## Tiện thể sửa một lỗi nguy hiểm còn sót

Bảng biến ở đầu CLAUDE.md vẫn ghi `Reset dữ liệu | node backend/database.js` — chính là lệnh xoá sạch DB (BUG-04) mà R13 đã cấm ở phía dưới. Hai chỗ trong cùng một file nói ngược nhau, và chỗ sai lại nằm ở bảng dễ đọc hơn. Đã đổi thành `reset-lockout.js` và `reset-db.sh`.

Commit `bf99e9d`, đã push.

Giờ vào việc A1 — dựng Agent Skill nhé?
```

---

## Lượt 30 — 17/08/2026 09:25:19

**Prompt (nguyên văn):**

```text
[ ] Agent Skill — dựng .claude/skills/ 🟡 10đ (mục 7:112) → đang chặn video demo của sinh viên
[ ] Bảng spec phần cứng evidence/hardware/spec.md ⚪ → để biết ảnh screenfetch cần thể hiện gì

oke làm
```

**Công cụ AI đã gọi:** 7 lần — `Write`, `Bash`

**Output AI:**

```text
Bắt đầu A1. Dựng skill chắt từ đúng quy trình đã chạy 8 lượt:

Giờ bảng spec phần cứng:

Dòng "Hệ điều hành" trống do lỗi escape dấu nháy — vá lại:

Kiểm tra skill có được nhận diện không, rồi tick checklist:

Xong A1. Checklist: **24 xong / 29 còn** (đếm bằng lệnh).

## Agent Skill — `.claude/skills/perf-test-endpoint/`

| File | Từ | Nội dung |
|---|---|---|
| `SKILL.md` | 1 662 | Quy trình 7 bước, từ khảo sát endpoint tới phân tích log |
| `references/jmx-template.md` | 883 | Khung XML copy dùng được + bẫy cú pháp |
| `references/analysis-playbook.md` | 1 053 | 7 lỗi diễn giải thường gặp, mỗi lỗi kèm lệnh kiểm chứng |

Điều làm nó khác một bản hướng dẫn chép từ tài liệu JMeter: **mọi cảnh báo trong đó đều là lỗi đã thực sự mắc phải trong 8 lượt chạy**, không phải phòng xa lý thuyết. Ví dụ:

- Bẫy Ignore Status — 401/403 mong đợi bị JMeter tính là lỗi dù assertion pass
- `ps -o %cpu` là trung bình cộng dồn từ lúc khởi động, không phải CPU tức thời
- `pgrep -f` không neo hai đầu sẽ bắt nhầm tiến trình `bash` bao ngoài — kèm ghi chú rằng lỗi này **đã tái phát** sau khi ghi vào nhật ký
- `vars` là biến cục bộ của luồng, `props` mới dùng chung — truyền token giữa Thread Group bắt buộc dùng `props`
- Dấu phẩy cuối trong `${__groovy(...,)}` là bắt buộc

Sổ tay phân tích cũng đúc kết đúng cái bẫy 22 lần: throughput 45 req/s của Load trông như trần server, thật ra là trần think-time — soak trên chính endpoint đó ra 997 req/s.

## Bảng spec phần cứng — `evidence/hardware/spec.md`

Có sẵn `hostname` = `qt-ThinkBook-14-G5-IRH` và `user` = `qt` để đối chiếu HW04 (mục 11:151), cùng CPU/RAM/đĩa/OS và phiên bản 6 công cụ.

Tôi ghi thẳng một giới hạn vào đó: backend chạy trên **chính máy đo**, nên số liệu **không bao gồm độ trễ mạng** — cần nêu khi diễn giải.

---

## Giờ tới lượt bạn — nhóm A2, 7 việc

Gộp được thành **một buổi**: mở htop cạnh terminal → chạy lại 3 kịch bản → vừa quay video vừa chụp screenshot → quay thêm clip dùng Agent Skill. Xong 4 việc cùng lúc, trong đó 3 việc là điều kiện chặn.

Ảnh screenfetch cần thấy rõ `hostname`; đối chiếu với `evidence/hardware/spec.md` cho khớp.

Còn Task 2 bước 2–4 thì làm lúc nào cũng được, độc lập hoàn toàn.

Cần tôi viết script gom sẵn để bạn chạy một lệnh là có đủ backend + htop + JMeter cho buổi quay không?
```

---

## Lượt 31 — 17/08/2026 09:32:11

**Prompt (nguyên văn):**

```text
@Screenshot From 2026-08-17 09-31-40.png
```

**Công cụ AI đã gọi:** 4 lần — `Bash`, `Read`, `AskUserQuestion`

**Output AI:**

```text
Phát hiện quan trọng: **hostname đã đổi**. Máy giờ là `ly-quoc-thanh`, không còn là `qt-ThinkBook-14-G5-IRH` như lúc tôi chạy các lượt test.

Chỗ này ăn thẳng vào mục 11:151 nên phải xử lý triệt để. Rà ra 6 file + **14 ảnh bằng chứng có hostname in cứng trong ảnh** + **13 GitHub Issue có hostname ở chân bài**.

Trước khi sửa, một câu tôi không tự trả lời được:
```

---

## Lượt 32 — 17/08/2026 09:33:38

**Prompt (nguyên văn):**

```text
oke tôi đổi hostname lại là được
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Khoan — hai câu trả lời đang ngược nhau, và chọn sai thì mất điể

Chuẩn — `qt-ThinkBook-14-G5-IRH`, khớp đúng với mọi thứ đã có. Không phải sửa gì:

| Chỗ | Hostname |
|---|---|
| Máy hiện tại | `qt-ThinkBook-14-G5-IRH` ✅ |
| `evidence/hardware/spec.md` | khớp ✅ |
| `Main-Report.md`, `README.md`, `Not-Run.md` | khớp ✅ |
| 14 ảnh bằng chứng (in cứng trong ảnh) | khớp ✅ |
| 13 GitHub Issue | khớp ✅ |

Tránh được việc phải chụp lại 14 ảnh và sửa 13 issue.

**Lúc chụp ảnh phần cứng nhớ chụp cả `hostname` và `whoami`** đúng như ảnh bạn vừa gửi — mục 11:151 nói TA đối chiếu chéo tên máy giữa các bài, nên đó là bằng chứng trực tiếp.

Nhóm A phía tôi đã xong. Còn lại là 7 việc của bạn ở A2:

| Việc | Mức |
|---|---|
| Screenshot JMeter + htop chung khung hình | 🔴 |
| Ảnh hardware (screenfetch + hostname + whoami) | 🔴 |
| Video Task 1 ≥ 6 phút | 🔴 |
| Video demo Agent Skill | 🟡 |
| Task 2 bước 2, 3, 4 | 🟡 10đ |

Bốn việc đầu gộp được vào một buổi quay. Muốn tôi viết script dựng sẵn môi trường — chạy backend, mở htop bám đúng PID, và in sẵn lệnh JMeter — để bạn chỉ việc bấm quay không?
```

---

## Lượt 33 — 17/08/2026 09:34:53

**Prompt (nguyên văn):**

```text
rồi ảnh đó để đâu trongthư mục ?
```

**Công cụ AI đã gọi:** 6 lần — `Bash`, `Read`

**Output AI:**

```text
Ảnh đang nằm ở `~/Pictures/Screenshots/`. Đây là chỗ cần đặt:

| Loại ảnh | Thư mục | Tên gợi ý |
|---|---|---|
| **`hostname` + `whoami`** (ảnh bạn vừa chụp) | `evidence/hardware/` | `hostname-whoami.png` |
| **screenfetch / neofetch** | `evidence/hardware/` | `screenfetch.png` |
| **JMeter + htop chung khung hình** | `evidence/monitor/` | `load-jmeter-htop.png`<br>`stress-jmeter-htop.png`<br>`spike-jmeter-htop.png` |

Ảnh `09-34-00` là cái có hostname đúng (`qt-ThinkBook-14-G5-IRH`) — chuyển vào luôn nhé?

`screenfetch` chưa cài nhưng có **`fastfetch`** — bản thay thế hiện đại, cùng công dụng. Cập nhật `spec.md` để nhúng ảnh:

Ảnh đã vào đúng chỗ: [evidence/hardware/hostname-whoami.png](evidence/hardware/hostname-whoami.png), và `spec.md` đã nhúng nó.

## Quy ước thư mục cho ảnh

```
evidence/
├── hardware/     ← ảnh phần cứng + spec.md
│   ├── spec.md                 ✅ bảng thông số
│   ├── hostname-whoami.png     ✅ vừa thêm
│   └── fastfetch.png           ⬜ còn thiếu
├── monitor/      ← ảnh JMeter + htop chung khung hình
│   ├── load-jmeter-htop.png    ⬜
│   ├── stress-jmeter-htop.png  ⬜
│   └── spike-jmeter-htop.png   ⬜
├── bugs/         ✅ 14 ảnh bằng chứng lỗi
└── diagrams/     ✅ flow chart Task 3
```

## Còn một ảnh nữa cho phần phần cứng

Máy không có `screenfetch` hay `neofetch`, nhưng có **`fastfetch`** — cùng công dụng, cùng kiểu hiển thị logo + thông số. Chạy rồi chụp:

```bash
fastfetch
```

Lưu thành `evidence/hardware/fastfetch.png`.

Tôi đã ghi rõ trong `spec.md` lý do dùng `fastfetch` thay vì `screenfetch`, để TA không thắc mắc tại sao lệch với chữ trong đề.

---

Ba ảnh `*-jmeter-htop.png` là phần nặng nhất còn lại — phải chạy lại test mới chụp được, và nên quay video luôn trong cùng buổi đó.

Muốn tôi viết script dựng sẵn môi trường cho buổi quay không? Nó sẽ: khởi động backend, seed dữ liệu, in ra PID để bạn trỏ `htop -p`, rồi in sẵn 3 lệnh JMeter để bạn copy từng cái — đảm bảo cả JMeter lẫn htop nằm chung một khung hình.
```

---

## Lượt 34 — 17/08/2026 09:36:53

**Prompt (nguyên văn):**

```text
[ ] Task 2 — bước 2: săn lỗi diễn giải, mỗi lỗi kèm giá trị đúng từ .jtl thô 🟡 (mục 6:103)
[ ] Task 2 — bước 3: phân loại 10 đề xuất tối ưu feasible / hallucinated 🟡 (mục 6:104)
[ ] Task 2 — bước 4: bảng tổng kết tỉ lệ đúng/sai 🟡

bạn có thể thực hiện luôn 3 tasks này, tôi theo dõi và đánh giá
```

**Công cụ AI đã gọi:** 18 lần — `Bash`, `Write`, `Read`

**Output AI:**

```text
Được. Tôi làm bước 2–3–4, và sẽ verify từng con số bằng lệnh chứ không khẳng định suông — kể cả khi kết quả cho thấy **báo cáo của tôi** mới là chỗ sai.

Bắt đầu với con số nghi ngờ nhất: AI ghi p95 của Stress là **237 ms**, trong khi dashboard JMeter ghi **1 669 ms**:

Bất ngờ: công cụ của tôi ra **237 ms**, khớp với AI. JMeter ra **1 669 ms**. Phải đếm trực tiếp mới biết bên nào đúng:

Dứt khoát rồi: chỉ **4,945%** mẫu vượt 237 ms → **p95 = 237 ms là đúng**. Còn 1 669 ms chỉ có 1,45% mẫu vượt, tức đó là ~p98,5 chứ không phải p95.

Nghĩa là **báo cáo của tôi sai**, và AI đúng. Truy nguyên nhân:

**Tìm ra nguyên nhân gốc.** `jmeter.reportgenerator.statistic_window = 20000` — dashboard chỉ tính phân vị trên **20 000 mẫu cuối cùng**, không phải toàn lượt. Bằng chứng: p50 khớp chính xác **205 ms** ở đúng cửa sổ 20 000.

Kiểm xem lượt nào bị ảnh hưởng:

Xác nhận hoàn toàn: lượt ≤20 000 mẫu thì dashboard khớp raw (2=2, 6=6); lượt >20 000 thì lệch (7,1× và 1,5×).

Giờ verify điểm gãy — tôi ghi 1 626, AI ghi 1 800:

Verify của tôi tái hiện gần đúng bảng của AI. Và điểm gãy **1 800** có căn cứ mạnh hơn con số 1 626 của tôi — tại đó **ba** chỉ báo cùng vỡ: p95 nhảy 3 lần, lỗi tăng gấp 3, và `Connect` p95 nhảy từ 1 ms lên 1 020 ms.

Verify tiếp cụm lockout và spike:

Đủ dữ liệu. Viết kết quả:

Giờ phải sửa 4 lỗi trong báo cáo của chính tôi (R11 — một con số đổi thì mọi nơi phải đổi):

Cập nhật GitHub Issue #12 cho khớp, rồi tick checklist:

Số đếm lệch với bảng — sửa theo đúng R14 (đếm bằng lệnh, không tin trí nhớ):

Task 2 xong: [Task2-Misinterpretation-Hunt.md](submission/report/Task2-Misinterpretation-Hunt.md). Checklist **28 xong / 26 còn**.

## Kết quả không như tôi dự đoán

Tôi tưởng sẽ tìm được vài chỗ AI đọc sai metric. Thực tế **AI tính đúng 80%**, và phát hiện đắt giá nhất lại là chỗ **JMeter sai** — kéo theo 4 con số trong báo cáo của tôi phải sửa.

### Lỗi lớn nhất: p95 trên dashboard sai gấp 7,1 lần

Tôi ghi Stress p95 = **1 671 ms**, lấy từ `statistics.json`. AI ghi **237 ms**. Đếm trực tiếp:

```
số mẫu >  237 ms:  38 080 ( 4,945%)   ← đúng là p95
số mẫu > 1669 ms:  11 172 ( 1,451%)   ← thực ra là ~p98,5
```

**Nguyên nhân gốc:** `jmeter.reportgenerator.statistic_window = 20000` — dashboard chỉ tính phân vị trên **20 000 mẫu cuối**, tức phần đuôi quá tải nhất. Bằng chứng chốt: p50 khớp chính xác **205 ms** ở đúng cửa sổ 20 000.

| Lượt | Mẫu | p95 thô | p95 dashboard |
|---|---|---|---|
| Load | 13 483 | 2 ms | 2 ms ✓ |
| Spike | 17 376 | 6 ms | 6 ms 

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 35 — 17/08/2026 09:49:32

**Prompt (nguyên văn):**

```text
[ ] Screenshot JMeter + htop CHUNG MỘT KHUNG HÌNH 🔴 (mục 6:93, 11:150) → cả 3 kịch bản đều thiếu, phải chạy lại mới chụp được
[ ] Ảnh hardware 🔴 (mục 6:93, 11:151) → ✅ hostname + whoami đã có: evidence/hardware/hostname-whoami.png → ⬜ còn thiếu ảnh fastfetch (máy không có screenfetch/neofetch), lưu thành evidence/hardware/fastfetch.png

cái ảnh thì bạn làm được mà, ngoài ra task kia thì đây là linux, tôi cho phép bạn chạy lệnh để chụp màn hình và bật htop
```

**Công cụ AI đã gọi:** 20 lần — `Bash`, `Write`, `Read`

**Output AI:**

```text
Được. Kiểm tra công cụ chụp màn hình khả dụng trên phiên Wayland này:

Có `gnome-terminal`, `wmctrl`, và GNOME Shell Screenshot qua D-Bus. Không có `tmux` nên phải dùng hai cửa sổ đặt cạnh nhau. Thử cơ chế chụp trước:

Cả hai đều bị chặn: GNOME 45+ cấm chụp qua D-Bus, còn `import` không truy cập được root window trên Wayland. Tìm đường khác:

`Xvfb` có sẵn — đường khả thi: dựng một màn hình X ảo, chạy thật htop và JMeter trong đó rồi chụp. Kiểm nốt vài thứ:

Đủ rồi: `screen` để chia đôi màn hình, `gnome-terminal` chạy trong `Xvfb`. Thử xem cơ chế có hoạt động không:

Tôi vừa dính đúng cái bẫy đã ghi trong nhật ký: `pkill -f "Xvfb :99"` khớp trúng **chính shell của mình** vì dòng lệnh có chứa chuỗi đó — lần thứ ba của cùng một lỗi. Viết thành script riêng để tránh hẳn:

Ảnh đen — `gnome-terminal` không vẽ được. Chẩn đoán:

`gnome-terminal` khởi động service nhưng không tạo cửa sổ nào — nó vẫn ưu tiên Wayland. Ép dùng X11:

Có cửa sổ rồi (mean=4055, không còn đen). Xem thử nội dung:

Chạy được — thấy rõ `qt@qt-ThinkBook-14-G5-IRH`. Ba thứ cần chỉnh: banner "Set GNOME Terminal as default", cửa sổ quá nhỏ, và output bị cắt:

Chạy được thật — htop hiện `node server.js` PID 18806 RES 116M ở khung trên, JMeter đang bắn tải ở khung dưới. Tinh chỉnh nốt: ép vẽ lại cho hết nhiễu và cắt viền đen thừa:

htop hiện `node server.js` chiếm 74,4% CPU / RES 144M, JMeter chạy đúng plan Stress ở 997 req/s. Giờ chụp `fastfetch`:

Ảnh có đủ: `qt@qt-ThinkBook-14-G5-IRH`, Ubuntu 26.04, i5-13500H (16) @ 4.70 GHz, 30.57 GiB RAM.

**Một lưu ý:** ảnh lộ `Local IP: 192.168.1.249/24`. Là IP mạng nội bộ nên không nhạy cảm, nhưng nếu bạn muốn tôi cắt dòng đó thì báo.

Cập nhật tài liệu và ghi rõ cách chụp:

Xong cả 4 ảnh. Checklist **30 xong / 24 còn**.

| Ảnh | Nội dung thấy được |
|---|---|
| `evidence/monitor/load-jmeter-htop.png` | htop 16 nhân + `node server.js` PID 18806 / RES 116M · JMeter 120 luồng, 119 req/s |
| `evidence/monitor/stress-jmeter-htop.png` | node **74,4% CPU** / RES 144M · JMeter 400 luồng, **997 req/s**, 0% lỗi |
| `evidence/monitor/spike-jmeter-htop.png` | nền 20 → vọt 300 luồng |
| `evidence/hardware/fastfetch.png` | `qt@qt-ThinkBook-14-G5-IRH` · Ubuntu 26.04 · i5-13500H (16) @ 4.70 GHz · 30,57 GiB |

## Phải dựng màn hình ảo, và tôi ghi rõ điều đó

Ba đường chụp màn hình thông thường đều bị chặn trên phiên Wayland này:

| Cách | Kết quả |
|---|---|
| GNOME Shell qua D-Bus | `AccessDenied: Screenshot is not allowed` |
| `import -window root` | Wayland không có r

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 36 — 17/08/2026 10:04:58

**Prompt (nguyên văn):**

```text
b1 có sẽ mấy cái làm được luôn mà không cần đợi tới cuối vì giờ chỉ chờ quay video, còn mấy cái gì sợ có thay đổi nữa thì đợi tới cuối
```

**Công cụ AI đã gọi:** 11 lần — `Bash`, `Write`

**Output AI:**

```text
Đúng, tôi xếp nhầm 4 trong 6 việc. Rà lại theo tiêu chí "cái gì còn thay đổi được nữa":

| # | Việc | Còn phụ thuộc gì? | Kết luận |
|---|---|---|---|
| 2 | AI Audit Report | Cần đủ artifact — mà Task 2, Task 3, Agent Skill **đều xong rồi**. Video không phải artifact AI | **làm được ngay** |
| 3 | AI Critique | Cần kết quả săn lỗi Task 2 — **đã có** | **làm được ngay** |
| 4 | Gộp Task 2+3 vào Main-Report | Không phụ thuộc gì | **làm được ngay** |
| 5 | Ghi xác nhận không trùng endpoint | Bạn đã chốt với nhóm | **làm được ngay** |
| 1 | AI-Prompt-Log | Trích transcript — phiên vẫn đang dài ra từng lượt | **để cuối** |
| 6 | `git-log.txt` | Mỗi commit là lỗi thời | **lệnh cuối cùng** |

Bắt đầu với việc 4 và 5:

Giờ AI Audit Report theo đúng mẫu của Khoa:

Đếm lại mục 5 bằng lệnh — tôi ghi 148 từ, phải kiểm chứ không ước lượng:

Giờ AI Critique — đề bắt buộc **200-300 chữ**, sẽ đếm bằng lệnh:

369 từ — vượt. Cắt lại:

Xong 4/6 việc của B1. Checklist **34 xong / 20 còn**.

| Việc | Kết quả |
|---|---|
| **AI Audit Report** | 12 artifact, đúng mẫu 6 mục của Khoa. Kết luận **149 từ** (yêu cầu 80–150) |
| **AI Critique** | **297 từ** (yêu cầu 200–300) — bản đầu 369 từ, đã cắt |
| **Gộp Task 2+3 vào Main-Report** | Thành mục 12 và 13; báo cáo giờ 7 821 từ, phủ trọn cả 3 task |
| **Xác nhận không trùng endpoint** | Ghi vào mục 1 kèm cả phương án dự phòng đã chào nhóm |

Cả hai con số chữ đều **đếm bằng lệnh**, không ước lượng — đây là chỗ dễ trượt vì mục 10:138 quy định cứng.

## Bảng audit tự nhận 4 artifact INVALID

Không tô hồng: 6 VALID / 4 INVALID / 2 INCOMPLETE — tỉ lệ dùng nguyên chỉ **50%**. Bốn cái INVALID gồm script đo tài nguyên (`ps %cpu` + `pgrep` không neo), lệnh reset xoá sạch DB, và vòng lặp chụp màn hình tái phát đúng lỗi `pgrep` **lần thứ ba**.

Cột "Lý do" đều dẫn chiếu ISTQB hoặc tài liệu kỹ thuật như mẫu yêu cầu, và hàng mẫu in nghiêng đã xoá.

## AI Critique trả đủ ba câu hỏi

Sai ở đâu → vì sao không tự bắt được → rút ra nguyên tắc gì. Điểm tôi nhấn: **không lỗi nào làm chương trình dừng**, tất cả chạy trơn tru rồi âm thầm cho ra số sai. Và tự nhận rằng chính prompt của mình (*"đừng viết kiểu có thể là"*) đã ép AI bịa cơ chế nhân quả.

---

**Còn đúng 2 việc của tôi, và cả hai buộc phải để cuối:**

| Việc | Vì sao |
|---|---|
| `AI-Prompt-Log.md` | Trích transcript — phiên vẫn dài ra mỗi lượt nói chuyện |
| `git-log.txt` | Mỗi commit là lỗi thời; phải là lệnh cuối cùng |

**Phía bạn còn 4:** 2 video, điền bảng tự đánh giá + link YouTube, xu

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 37 — 17/08/2026 10:12:16

**Prompt (nguyên văn):**

```text
update lại checklist bỏ những cái đã xong cho tôi nhìn được những thứ còn thiếu dễ dàng
```

**Công cụ AI đã gọi:** 7 lần — `Bash`, `Write`, `Read`

**Output AI:**

```text
Đếm ra 35 chứ không phải 34 — sửa lại tiêu đề cho khớp:

[CHECKLIST.md](CHECKLIST.md) đã gọn lại. Mở file ra là thấy ngay phần thiếu, phần đã xong gấp vào trong `<details>`.

## Cấu trúc mới

```
🔴 CÒN THIẾU
   ① Sinh viên — 6 việc
   ② Claude — 2 việc (buộc để cuối)
✅ SOÁT LẦN CUỐI — 12 điều kiện chặn
▸ ĐÃ XONG — 35 mục (gấp lại)
```

## Còn thiếu — 8 việc thật

**Của bạn (6):**

| Việc | Ghi chú |
|---|---|
| Video Task 1 ≥ 6 phút 🔴 | JMeter + htop chung khung hình, **màn hình thật** |
| Video demo Agent Skill 🟡 | Skill đã sẵn sàng |
| Bảng tự đánh giá + 2 link YouTube 🔴 | Sau khi tôi xong phần ② |
| Xuất PDF 🔴 | 3 file |
| Đóng gói zip 🔴 | `.jtl` lớn nhất 106 MB → split-and-zip |

Bốn việc dưới đều phải đợi tôi xong phần ②, nên thứ tự là: **bạn quay video → tôi chạy 2 lệnh cuối → bạn điền số + xuất PDF + đóng gói**.

**Của tôi (2):** `AI-Prompt-Log.md` và `git-log.txt` — cả hai đều lỗi thời ngay khi có thêm commit hoặc thêm lượt nói chuyện, nên chỉ chạy được ở phút chót.

---

Tiện thể sửa hai chỗ số liệu lệch: đếm bằng lệnh ra **35 xong / 20 còn** chứ không phải 34 như tôi viết tay, và mục "AI Audit Report" trong bảng soát cuối ghi nhầm "mẫu 5 mục" trong khi template có **6 mục**.
```

---

## Lượt 38 — 17/08/2026 10:15:36

**Prompt (nguyên văn):**

```text
cho bảng tự đánh giá full điểm, nói luôn video cần quay gì, cái video không phải demo skill á, demo skill tôi biết cách quay
```

**Công cụ AI đã gọi:** 3 lần — `Bash`, `Write`

**Output AI:**

```text
Xong hai việc. Checklist **36 xong / 19 còn**.

## Bảng tự đánh giá — 100/100

Điền vào [README.md](submission/README.md), mỗi dòng kèm **cột căn cứ** để không phải là con số trơ:

| # | Tiêu chí | Tự chấm | Căn cứ |
|---|---|---|---|
| 1 | Load | **20** | 997 req/s · trần 161 MB |
| 2 | Stress | **20** | Điểm gãy 1 800 luồng · nêu sai lệch khoá-2-lần so với đề |
| 3 | Spike | **20** | Hồi phục < 1 giây · bằng chứng rò rỉ 19 MB |
| 4 | Task 2 | **10** | 25 nhận định kiểm bằng lệnh · **4 lỗi của chính báo cáo mình** |
| 5 | Task 3 | **10** | Ngưỡng suy từ nhiễu nền đo được 1,83 lần |
| 6 | Agent Skill | **10** | 3 598 từ, cảnh báo là lỗi đã thực mắc |

Tôi để một dòng điều kiện dưới bảng: bảng này chỉ đúng khi **hai video đã quay và điền link**. Còn lại đã kiểm chứng được bằng file trong repo.

---

## Kịch bản quay video: [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md)

Chuẩn bị: `./scripts/reset-db.sh`, rồi mở **hai terminal cạnh nhau** — trái chạy `htop -p $(pgrep -x node)`, phải chạy JMeter. Ghi **toàn màn hình**, đừng ghi từng cửa sổ, để hai cái luôn chung khung.

**5 phần, ~8 phút** (dư 2 phút làm biên an toàn):

| Phần | Thời lượng | Nội dung |
|---|---|---|
| 1 | 45 giây | `whoami`, `hostname`, git log, cấu trúc thư mục |
| 2 | 2 phút | Load — lý do ghép, think-time, và chỉ ra 3,5% lỗi là **do bug `O'Neill`**, không phải do tải |
| 3 | 2 phút 30 | Stress — reset lockout, **khoá 2 lần chứ không phải 3**, ramp 1 luồng/giây |
| 4 | 1 phút 30 | Spike — token, hai Thread Group, RSS không nhả lại 19 MB |
| 5 | 1 phút 30 | Soak 997 req/s, điểm gãy 1 800, và phát hiện **JMeter báo p95 sai 7 lần** |

Mỗi phần có sẵn **lệnh copy-paste** và **lời thoại viết ra chữ** — cứ đọc theo, không phải nghĩ lúc đang quay.

**Một chỗ đừng cắt:** phần 3 (quy trình reset lockout). Nếu thiếu thời gian thì cắt phần 5 xuống 45 giây, vì phần 3 là mục đề chấm riêng ở 6:93.

Cuối file có bảng soát 6 điều kiện trước khi upload, gồm cả nhắc đặt **unlisted** chứ không phải private.
```

---

## Lượt 39 — 17/08/2026 10:36:01

**Prompt (nguyên văn):**

```text
giờ soạn cái submission cho đầy đủ trước , làm 1 file show tất cả những gì tôi phải nói (không phải gợi ý nói mà là full script) cho video, không cần soạn cho demo skill
```

**Công cụ AI đã gọi:** 7 lần — `Bash`, `Write`

**Output AI:**

```text
Trước hết soát xem bài nộp đã đủ chưa theo đúng danh mục mục 14:167-178:

Giờ kịch bản video — lời thoại đầy đủ từng chữ:

1771 từ là đếm lẫn cả phần bảng. Đếm lại chỉ riêng lời thoại:

Con số tôi ghi trong file sai — lời thoại thuần **1 745 từ**, đọc ra **11–14 phút** chứ không phải 8 phút. Sửa lại và thêm hướng dẫn cắt cụ thể:

Xong hai file. Checklist **36 xong / 19 còn**.

## [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md) — lời thoại nguyên văn

**1 745 từ**, đọc ra **11–13 phút**. Không phải gợi ý mà là chữ để đọc thẳng — mỗi phần có lệnh gõ trong khung, ghi chú thao tác in nghiêng (không đọc), còn lại đọc nguyên văn.

Tôi đã sửa một sai sót của mình: ban đầu ghi "8 phút 10 giây" nhưng đếm bằng lệnh ra 11–13 phút. Đã sửa và thêm **bản rút gọn ~7 phút** chỉ rõ 4 đoạn cắt được, kèm 4 thứ **tuyệt đối không cắt** vì mỗi thứ là một mục đề chấm riêng:

| Không cắt | Mục chấm |
|---|---|
| `whoami` + `hostname` | 11:151 — TA đối chiếu tên máy giữa các bài |
| Quy trình reset khoá tài khoản | 6:93 chấm riêng |
| Lý do ghép kịch bản ↔ nhóm endpoint | 6:88 bắt giải thích |
| Con số ngưỡng chịu đựng | 6:94 đòi kết luận bằng số |

## [submission/PACKAGING.md](submission/PACKAGING.md) — đóng gói

Đối chiếu đủ **11 dòng** danh mục mục 14:167-178 với đường dẫn thật. Còn thiếu 4: 3 file PDF, link video, `git-log.txt`.

**Một vấn đề cần bạn biết trước:** Policies:41 giới hạn **20 file, mỗi file 20 MB**. Mà `results/raw/` nặng **360 MB**, riêng một file `.jtl` đã 106 MB — gấp 5 lần giới hạn. Bắt buộc split-and-zip:

```bash
zip -r -s 19m 23127262_HW05_AI_Performance_100.zip \
    submission/ plans/ data/ results/ evidence/ scripts/ .claude/ \
    -x "*/jmeter.log" "*/node_modules/*"
```

Nếu vượt 20 phần, cách giảm hợp lệ là **bỏ bớt 4 file `.jtl` phụ** (các lượt leo thang tìm ngưỡng), giữ 4 file chính thức. Nhưng **không được cắt nội dung bên trong** file `.jtl` nào — mục 11:149 đòi nguyên vẹn, bỏ bớt số lượng file thì được, cắt ruột file là gian lận.

Cuối file có **thứ tự 8 bước** cho khâu cuối, trong đó `git-log.txt` phải xuất **sau** commit cuối cùng, nếu không nó thiếu chính commit đó.
```

---

## Lượt 40 — 17/08/2026 10:42:01

**Prompt (nguyên văn):**

```text
bạn cứ để vào submission những thứ cần có chứ ai kêu bạn thêm bớt, dung lượng là việc của tôi, phải đảm bảo submission đủ
```

**Công cụ AI đã gọi:** 4 lần — `Write`, `Bash`

**Output AI:**

```text
Bạn đúng — việc của tôi là đảm bảo đủ, dung lượng là chuyện của bạn. Bỏ đề xuất cắt file. Dựng script gom đủ vào `submission/`:

Đọc lại mục 14:167-178 — đề liệt kê **11 hạng mục** phải có trong zip. Chạy script gom rồi đối chiếu từng dòng:

Bạn đúng — `submission/` trước đó thiếu 7/11 hạng mục. Giờ đã tự chứa đủ, **384 MB**, nén đúng một thư mục là xong.

## Đối chiếu đủ 11 dòng của mục 14:167-178

| # | Đề yêu cầu | Có gì |
|---|---|---|
| 1 | Báo cáo chính (md + pdf) | md ✅ · **pdf ⬜** |
| 2 | Link repo GitHub | ✅ |
| 3 | Ba test plan | ✅ 3 `.jmx` |
| 4 | `.jtl` thô + thư mục HTML | ✅ 8 file · 6 thư mục |
| 5 | Screenshot monitor + phần cứng | ✅ 3 + 2 ảnh |
| 6 | Link video YouTube | **⬜** |
| 7 | AI Critique + AI Audit (md + pdf) | md ✅ · **pdf ⬜** |
| 8 | Git commit log | **⬜** tôi chạy cuối |
| 9 | Bug report + screenshot | ✅ + 14 ảnh |
| 10 | README tự đánh giá + summary | ✅ |
| 11 | Tài liệu hỗ trợ | ✅ 3 CSV · 16 script · Agent Skill |

**Còn đúng 4 mục**, không phải 7 như trước.

## Cách gom

[scripts/assemble-submission.sh](scripts/assemble-submission.sh) — chạy lại bất cứ lúc nào, luôn dựng lại từ đầu nên không sót bản cũ.

Điểm đáng nói: `results/` và `evidence/` dùng **hard link** trỏ về bản gốc, nên `submission/` hiển thị 384 MB nhưng đĩa chỉ tốn thêm **468 KB**. Khi nén thì zip vẫn đóng gói đầy đủ nội dung, không phải link rỗng.

## Đã bỏ đề xuất cắt file

Tôi rút lại đoạn khuyên bỏ bớt 4 file `.jtl` — sai hướng. Policies:41 khuyên **split-and-zip** là để chia nhỏ lúc nén, không phải để bớt file lúc nộp. Giờ chỉ còn một lệnh:

```bash
zip -r -s 19m 23127262_HW05_AI_Performance_100.zip submission/
```

Và ghi rõ lý do nộp dư: **8 `.jtl`** thay vì 3 vì Stress phải leo thang 4 lượt mới tìm được điểm gãy — giữ đủ để chứng minh quá trình chứ không phải chọn sẵn con số đẹp.

`submission/results/raw/*.jtl` đã thêm vào `.gitignore` (GitHub chặn file >100 MB), nhưng file vẫn nằm trên đĩa và vào zip bình thường.
```

---

## Lượt 41 — 17/08/2026 10:45:37

**Prompt (nguyên văn):**

```text
<ide_opened_file>The user opened the file /home/qt/projects/hw05/submission/plans/23127262_Load_20260811.jmx in the IDE. This may or may not be related to the current task.</ide_opened_file>
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Ngoài 2 video thì `submission/` còn thiếu **5 file**, chia làm hai nhóm:

## Tôi làm — 2 file, phải chạy cuối cùng

| File | Vì sao đợi |
|---|---|
| `appendix/AI-Prompt-Log.md` | Trích transcript phiên làm việc — phiên vẫn dài ra mỗi lượt ta nói chuyện |
| `appendix/git-log.txt` | Mỗi commit là lỗi thời; phải là lệnh cuối cùng |

## Bạn làm — 3 file PDF

| File nguồn | PDF cần xuất |
|---|---|
| `report/Main-Report.md` | `Main-Report.pdf` |
| `appendix/AI-Audit-Report.md` | `AI-Audit-Report.pdf` |
| `appendix/AI-Critique.md` | `AI-Critique.pdf` |

Cộng thêm việc điền **2 link YouTube** vào `README.md` (đang là `<điền>`).

---

## Thứ tự bắt buộc

```
1. Bạn quay 2 video → upload unlisted
2. Bạn điền 2 link vào README.md
3. Tôi sinh AI-Prompt-Log.md
4. Tôi commit lần cuối
5. Tôi xuất git-log.txt        ← phải sau bước 4
6. Bạn xuất 3 PDF               ← phải sau bước 2, để PDF có link video
7. Bạn chạy lại assemble-submission.sh
8. Bạn split-and-zip
```

Bước 6 phải sau bước 2, nếu không PDF của README sẽ vẫn còn chữ `<điền>`.

**Hai chỗ cần kiểm sau khi xuất PDF:** flow chart Mermaid trong Task 3 (nhiều công cụ không render — tài liệu đã nhúng sẵn bản PNG ngay dưới, kiểm xem PDF có hiện không), và bảng audit 6 cột dễ tràn lề (nếu tràn thì xuất khổ ngang).

Tất cả ghi trong [submission/PACKAGING.md](submission/PACKAGING.md) mục 5.
```

---

## Lượt 42 — 17/08/2026 16:08:08

**Prompt (nguyên văn):**

```text
oke có 2 video là demo agent và video gì
```

**Output AI:**

```text
Hai video là:

| # | Video | Yêu cầu | Kịch bản |
|---|---|---|---|
| 1 | **Demo Task 1** — kiểm thử hiệu năng | ≥ 6 phút · JMeter và htop **chung một khung hình** · giọng tiếng Việt của bạn *(mục 6:95, 11:150)* | [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md) — lời thoại nguyên văn |
| 2 | **Demo Agent Skill** | Quay end-to-end việc dùng skill trên một endpoint group hoàn chỉnh *(mục 7:113)* | bạn tự quay |

Video 1 là cái nặng: nó chứng minh bạn thật sự chạy test, nên mục 11 xếp vào diện **Anti-AI-Cheat** — TA kiểm trực tiếp ba thứ: đủ 6 phút, hai cửa sổ chung khung, và giọng thật.

Video 2 nhẹ hơn, chỉ cần cho thấy skill được gọi và chạy trọn một vòng trên một endpoint group.

Cả hai đều để **unlisted**, rồi dán link vào `submission/README.md` mục "Video demo".
```

---

## Lượt 43 — 17/08/2026 16:09:01

**Prompt (nguyên văn):**

```text
tên của video đó là gì demo task 1 là sao, tôi cần nói cái tên
```

**Output AI:**

```text
Đề không quy định tên video, nên chọn theo nguyên tắc: **TA nhìn tên là biết ngay của ai, bài nào, nội dung gì**. Dán thẳng vào ô Title trên YouTube:

**Video 1:**
```
23127262 - Lý Quốc Thạnh - HW05 Performance Testing - Task 1 Demo (Load, Stress, Spike, Endurance)
```

**Video 2:**
```
23127262 - Lý Quốc Thạnh - HW05 Performance Testing - Agent Skill Demo
```

Ba lý do đặt vậy: MSSV đứng đầu để TA đối chiếu với tên file zip; có tên bài để không lẫn với HW04; và phần đuôi nói rõ nội dung để không phải mở lên mới biết cái nào là cái nào.

## Phần Description cũng nên điền

YouTube unlisted mà không có mô tả thì TA phải tự đoán. Dán cái này vào ô Description của video 1:

```
HW05 - Kiểm thử hiệu năng (Performance Testing)
Sinh viên: Lý Quốc Thạnh - MSSV 23127262
Môn: CS423/CSC13003 - Kiểm chứng Phần mềm

SUT: EShop backend API (https://github.com/ttbhanh/eshop-sut)
Công cụ: Apache JMeter 5.6.3 (non-GUI) + htop
Repo bài làm: https://github.com/dinosauce-285/HW05-Software-Testing

Nội dung:
- Kịch bản Load  - nhóm read-heavy    (GET /api/products)
- Kịch bản Stress - nhóm auth-heavy    (POST /api/login)
- Kịch bản Spike  - nhóm transactional (POST /api/cart -> /api/checkout)
- Endurance: 997 req/s ổn định 11 phút, trần bộ nhớ 161 MB
- Điểm gãy: 1 800 người dùng đồng thời
```

Cho video 2 thì rút gọn, chỉ ghi tên skill `perf-test-endpoint` và endpoint group đem ra demo.

Sau khi upload xong, gửi tôi 2 link để tôi điền vào `submission/README.md` và bảng biến trong `CLAUDE.md` — hoặc bạn tự điền cũng được, chỗ đó đang là `<điền>`.
```

---

## Lượt 44 — 17/08/2026 16:11:17

**Prompt (nguyên văn):**

```text
oke tôi sẽ làm gì khi quay video đó
```

**Công cụ AI đã gọi:** 2 lần — `Bash`

**Output AI:**

```text
Chưa có phần mềm quay nào cài sẵn — chỉ có bộ quay tích hợp của GNOME. Kiểm tra micro trước vì đề bắt buộc có giọng:
```

---

## Lượt 45 — 17/08/2026 16:12:07

**Prompt (nguyên văn):**

```text
bạn chỉ cần trình bày tôi demo task 1 như nào á
```

**Công cụ AI đã gọi:** 9 lần — `Bash`

**Output AI:**

```text
Đây là toàn bộ buổi quay, theo trình tự thời gian.

## Trước khi bấm ghi

1. Chạy `./scripts/reset-db.sh` — để dữ liệu sạch, không quay đoạn này
2. Mở **hai cửa sổ terminal cạnh nhau**, chiếm hết màn hình:
   - **Trái:** `htop -p $(pgrep -x node)` — để đó, không đụng nữa
   - **Phải:** để trống, đây là nơi bạn gõ lệnh
3. Mở `VIDEO-SCRIPT.md` trên **điện thoại hoặc màn hình phụ** — đừng mở trên màn hình đang quay
4. Bấm `Ctrl+Shift+Alt+R` để bật quay của GNOME, nhớ **bật micro** trong giao diện quay

## Trong lúc quay — bạn chỉ làm hai việc: gõ lệnh và nói

| Phút | Bạn gõ | Bạn nói trong lúc chờ |
|---|---|---|
| 0:00 | `whoami && hostname` rồi `ls plans/ data/` | Phần 1 — giới thiệu, xác nhận tên máy |
| 0:50 | Lệnh JMeter Load | Phần 2 — nói suốt 2 phút JMeter chạy |
| 2:40 | `node ../scripts/reset-lockout.js` rồi lệnh JMeter Stress | Phần 3 — nói suốt 2,5 phút |
| 5:00 | `./scripts/reset-db.sh` rồi lệnh JMeter Spike | Phần 4 — nói suốt 2,5 phút |
| 7:30 | Hai lệnh `jtl-stats.py` | Phần 5 — kết luận |
| ~9:00 | | Hết |

**Điểm mấu chốt:** mỗi lệnh JMeter chạy 2–2,5 phút. Bạn **không ngồi im chờ** — đó chính là lúc đọc lời thoại. Vừa nói vừa chỉ tay sang htop bên trái để thấy CPU và RES nhảy theo tải.

Vì vậy video tự nhiên dài 9–11 phút, thừa xa mức 6 phút. Không cần diễn thêm gì.

## Ba điều đừng làm

| Đừng | Vì sao |
|---|---|
| Đừng phóng to một cửa sổ | Mất điều kiện "chung một khung hình" — mục 11:150 kiểm đúng chỗ này |
| Đừng cắt cảnh giữa lúc JMeter chạy | Trông như ghép, mất tính xác thực |
| Đừng quay lại từ đầu khi lỡ lời | Cứ nói tiếp, TA chấm nội dung chứ không chấm giọng đọc |

## Nếu muốn quay nhiều clip

Đề cho phép (*"you may split it into one clip per scenario"*). Cắt tự nhiên nhất là **4 clip**: mở đầu+Load, Stress, Spike, kết luận. Mỗi clip vẫn phải có htop trong khung. Upload cả 4, dán đủ 4 link vào README, và ghi rõ tổng thời lượng.

Quay một mạch vẫn đơn giản hơn — đỡ phải cộng thời lượng và giải trình.

Bắt đầu 2 việc cuối. Trước hết soi cấu trúc transcript:

Rõ rồi — prompt nằm trong block `text` đầu của list. Viết script trích:

Thứ tự phiên đang sai — phiên bắt đầu 11/08 lại nằm cuối. Sắp lại theo mốc thời gian thật:
```

---

# Phiên `e3cb99c8` — 31 lượt

## Lượt 46 — 17/08/2026 16:13:36

**Prompt (nguyên văn):**

```text
đọc đề @2026.HW05.Performance Testing_En.md yêu cầu tôi quay video demotask 1, trong video tôi sẽ phải làm gì
```

**Công cụ AI đã gọi:** 3 lần — `Bash`, `Read`

**Output AI:**

```text
Đề chỉ ra 3 điều kiện cứng cho video Task 1, còn nội dung thì suy ra từ các mục chấm. Kịch bản đọc nguyên văn đã có sẵn ở [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md) — dưới đây là bản tóm tắt.

## Ba điều kiện bắt buộc (mục 6:95 + 11:150)

| Điều kiện | Ghi chú |
|---|---|
| Tổng **≥ 6 phút** | được cắt thành nhiều clip, mỗi scenario một clip |
| JMeter và resource monitor (htop) **chung một khung hình** | ghi toàn màn hình, không cắt cảnh qua lại — TA kiểm trực tiếp |
| Giọng **tiếng Việt của chính mình** | không dùng TTS |

Upload YouTube **unlisted** (không phải private), rồi dán link vào [submission/README.md](submission/README.md) và bảng biến trong [CLAUDE.md](CLAUDE.md).

## Trong video phải làm gì

**Phần 1 — Mở đầu (~50s).** Giới thiệu tên + MSSV. Gõ `whoami && hostname` cho thấy `qt-ThinkBook-14-G5-IRH` — mục 11:151 bắt hostname khớp HW04, đây là chỗ TA đối chiếu chéo. Gõ `ls plans/ data/` để chứng minh có 3 plan đúng tên và 3 CSV riêng biệt.

**Phần 2-4 — Chạy thật từng scenario (Load → Stress → Spike).** Mỗi scenario cần nói được 4 thứ:
- Vì sao ghép scenario này với nhóm endpoint này (mục 6:88 bắt giải thích)
- Lý do của từng tham số: think-time, ramp-up, thread count (R8 — không được nói "AI đề xuất")
- Chỉ tay sang htop lúc tải đang chạy, đọc CPU/RES
- Phát hiện đáng chú ý của scenario đó (SQL injection ở `O'Neill`, khoá sau 2 lần chứ không phải 3, memory không nhả sau spike)

Riêng Stress: **phải quay đoạn reset lockout** (`node ../scripts/reset-lockout.js`) và nói rõ vì sao không được dùng `node backend/database.js` — mục 6:93 chấm riêng quy trình reset.

**Phần 5 — Ngưỡng chịu đựng (~1.5 phút).** Mục 6:94 đòi kết luận bằng số cụ thể: 997 req/s ổn định, trần bộ nhớ 161 MB. Nên chốt bằng phát hiện p95 dashboard 1671ms vs log thô 237ms.

## Bốn thứ tuyệt đối không cắt

Nếu muốn rút xuống ~7 phút, file kịch bản đã đánh dấu sẵn 4 đoạn bổ trợ có thể bỏ. Nhưng phải giữ: đoạn `hostname`, đoạn reset lockout, lý do ghép scenario↔endpoint, và con số ngưỡng chịu đựng — mỗi thứ là một mục đề chấm riêng.
```

---

## Lượt 47 — 17/08/2026 16:15:05

**Prompt (nguyên văn):**

```text
phần này tôi thực hiện như nào 
Phần 2-4 — Chạy thật từng scenario (Load → Stress → Spike). Mỗi scenario cần nói được 4 thứ:

Vì sao ghép scenario này với nhóm endpoint này (mục 6:88 bắt giải thích)
Lý do của từng tham số: think-time, ramp-up, thread count (R8 — không được nói "AI đề xuất")
Chỉ tay sang htop lúc tải đang chạy, đọc CPU/RES
Phát hiện đáng chú ý của scenario đó (SQL injection ở O'Neill, khoá sau 2 lần chứ không phải 3, memory không nhả sau spike)
Riêng Stress: phải quay đoạn reset lockout (node ../scripts/reset-lockout.js) và nói rõ vì sao không được dùng node backend/database.js — mục 6:93 chấm riêng quy trình reset.

Phần 5 — Ngưỡng chịu đựng (~1.5 phút). Mục 6:94 đòi kết luận bằng số cụ thể: 997 req/s ổn định, trần bộ nhớ 161 MB. Nên chốt bằng phát hiện p95 dashboard 1671ms vs log thô 237ms.
```

**Công cụ AI đã gọi:** 5 lần — `Bash`

**Output AI:**

```text
Backend đang **không chạy** — nên bước chuẩn bị bắt buộc. Dưới đây là phần cơ học: gõ gì, lúc nào, và nói gì trong lúc chờ.

## Dựng khung hình (làm 1 lần, trước khi bấm ghi)

```bash
cd ~/projects/hw05
./scripts/reset-db.sh          # vừa khởi động backend vừa seed 147 sp + 210 tk
```

Mở 2 terminal cạnh nhau, **trái = htop, phải = gõ lệnh**:

```bash
# Cửa sổ TRÁI
htop -F 'node server.js'
```

Dùng `-F` chứ **đừng** dùng `-p $(pgrep -x node)` như kịch bản đang ghi. Lý do: ở Phần 4 bạn sẽ chạy `reset-db.sh`, nó `pkill` rồi khởi động lại backend → PID đổi → pane htop ghim theo PID sẽ trắng trơn đúng lúc cần quay. `-F` lọc theo tên lệnh nên tự bắt lại tiến trình mới. Tôi đã kiểm: htop trên máy này là 3.4.1, có hỗ trợ `-F`.

Rồi mới bật OBS ghi **toàn màn hình** (không phải window capture), bật mic, bấm ghi.

## Nhịp mỗi scenario: gõ 1 lệnh rồi nói suốt lúc nó chạy

Đây là chỗ dễ lúng túng nhất. JMeter non-GUI in một dòng `summary +` mỗi 30 giây — bạn **không đứng im chờ**, mà nói hết 4 ý trong khoảng trống đó. Thời lượng thật của từng lệnh demo:

| Scenario | Lệnh (đã rút ngắn cho demo) | Chạy khoảng | Nói gì trong lúc chờ |
|---|---|---|---|
| Load | `jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 -l /tmp/demo-load.jtl` | ~2:10 | ý ①② ngay khi vừa gõ Enter → ③ khi htop bắt đầu nhích → ④ khi thấy dòng `Err:` |
| Stress | `node ../scripts/reset-lockout.js` rồi `jmeter ... -Jthreads=400 -Jrampup=60 -Jduration=150 ...` | ~2:40 | nói về reset **trước** khi gõ jmeter → rồi ①② → ③④ |
| Spike | `cd .. && ./scripts/reset-db.sh && cd plans` rồi `jmeter ... -Jbase=20 -Jbaseduration=120 -Jspike=300 -Jspikeduration=30 -Jspikedelay=30 ...` | ~2:15 | ①② lúc setUp đang login 50 tài khoản → ③④ đúng giây thứ 30 khi vọt |

Tôi đã đối chiếu: cả 9 tham số `-J` trên đều tồn tại thật trong 3 file `.jmx` (`__P(threads,…)`, `__P(spikedelay,…)`, …), không có tham số nào bị bỏ qua thầm lặng.

**Thứ tự nói cố định cho cả ba** — học thuộc 4 ô này thay vì học thuộc cả bài:

1. **Ghép** — "Em ghép *[scenario]* với nhóm *[group]* vì…" (1 câu, lý do đã có sẵn ở [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md))
2. **Tham số** — mỗi số một câu *vì sao*: think-time 800±200ms vì người thật đọc trang rồi mới bấm; ramp-up 1 luồng/giây ở Stress vì nó biến trục thời gian thành trục tải, giây thứ N = N user đồng thời
3. **htop** — xem dưới
4. **Phát hiện** — `O'Neill` / khoá sau 2 lần / RES không nhả

## "Chỉ tay sang htop" — thực tế làm thế nào

Trong screen recording không có ngón tay. C

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 48 — 17/08/2026 16:16:52

**Prompt (nguyên văn):**

```text
là giờ tôi gõ 1 lệnh là htop sẽ có thay đổi gì đó à
```

**Công cụ AI đã gọi:** 12 lần — `Bash`

**Output AI:**

```text
Câu hỏi đúng chỗ. Để tôi đo thật thay vì trả lời chung chung — chạy một lượt ngắn rồi lấy đúng con số htop sẽ hiển thị.

Đo thật rồi. Có thay đổi, nhưng ít hơn bạn tưởng — và mức thay đổi khác nhau hẳn giữa 3 scenario.

## Số đo thật, backend PID 82786, lượt Load 120 luồng

| Thời điểm | Cột RES | Cột CPU% (của 1 nhân) |
|---|---|---|
| Trước khi chạy | 85 MB | 0% |
| Giây 6 (đang ramp-up) | 88 MB | 7% |
| Giây 14 | 98 MB | 17% |
| Giây 20–40 (ổn định) | 114 → 118 MB | 14–18% |
| Sau khi JMeter dừng | 117 MB | 0% |

Vậy trên video bạn sẽ thấy: **cột CPU của dòng `node server.js` nhảy từ `0.0` lên khoảng `14–18`, và cột RES bò từ `85M` lên `118M` rồi chững**. Thanh CPU meter tổng ở đầu htop cũng có một lõi nhích lên. Đủ nhìn thấy, nhưng không phải cảnh CPU đỏ rực.

Lượt đo này ra `103 req/s`, `Err 3.51%` — đúng con số lỗi `O'Neill` bạn sẽ nói trong Phần 2.

## Vì sao Load nhẹ vậy, và điều đó lại là ý hay để nói

Load có think-time 800ms nên 120 luồng chỉ đẩy được ~103 req/s — **nút cổ chai là kịch bản, không phải server**. Đây chính là ý bạn đã định nói ở Phần 5 (45 req/s so với 997 req/s). Nên khi quay Load, đừng cố bán cảnh "máy sắp cháy"; nói thẳng:

> "CPU chỉ khoảng mười lăm phần trăm thôi. Đó là vì kịch bản Load có think-time, nó mô phỏng người dùng thật chứ không cố ép server. Ngưỡng thật của phần cứng em sẽ đo ở phần soak."

Ngược lại **Stress mới là chỗ htop diễn**: 400 luồng, không think-time, Node đơn luồng → cột CPU sẽ vượt `100` (htop tính theo 1 nhân, nên >100% là bình thường). Ở lượt chính thức 2000 luồng bạn đã đo được 132%. Và **Spike là chỗ cột RES diễn**: 75 → 119,7 → chỉ về 94 MB.

Nên phân vai: Load → nói về throughput và lỗi; Stress → chỉ vào cột CPU; Spike → chỉ vào cột RES.

## Hai chỉnh nhỏ để htop lên hình rõ hơn

```bash
htop -d 10 -F 'node server.js'
```

`-d 10` = làm mới mỗi 1 giây (mặc định 1,5s), số nhảy mượt hơn trên video. Trong htop bấm `F6` chọn sort theo `PERCENT_MEM` hoặc để mặc định `PERCENT_CPU` đều được, miễn dòng `node server.js` nằm trên cùng và không bị trôi khỏi khung.

Backend hiện **đang chạy** (PID 82786, DB đã seed 152 sản phẩm + 210 tài khoản) nếu bạn muốn thử ngay.
```

---

## Lượt 49 — 17/08/2026 16:23:16

**Prompt (nguyên văn):**

```text
mục đích của 3 script này là gì
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Ba script xuất hiện trong kịch bản quay — mỗi cái gắn với một mục chấm riêng, không phải tiện ích vặt.

## `scripts/reset-lockout.js` — mở khoá, giữ nguyên dữ liệu

Chạy đúng một câu SQL: `UPDATE users SET login_attempts = 0, locked_until = NULL`, mở file `database.sqlite` trực tiếp bằng driver `sqlite3`.

Dùng khi lượt Stress vừa bắn `POST /api/login` làm khoá hàng loạt tài khoản. Không chạy nó thì lượt sau toàn 403 — mà 403 trả về **rất nhanh** vì backend kiểm trạng thái khoá *trước* bước so mật khẩu, nên throughput trông đẹp một cách giả tạo và số đo mất nghĩa.

Lý do phải viết script riêng thay vì dùng `node backend/database.js` như tài liệu SUT hướng dẫn: file đó gọi `initDatabase()` ngay khi được import, mà hàm này mở đầu bằng 6 lệnh `DROP TABLE` → mất sạch 210 tài khoản và 152 sản phẩm. Đây là đoạn bạn phải nói ra miệng ở Phần 3, vì mục 6:93 chấm riêng *quy trình reset*, không chấm việc "đã reset".

## `scripts/reset-db.sh` — xoá sạch rồi seed lại

Bốn bước: `pkill` backend → khởi động lại → chờ `/api/products` phản hồi → chạy `seed-data.js` → in số sản phẩm và số đơn hàng để xác nhận đã sạch.

Nó lợi dụng chính cái bug `DROP TABLE` ở trên làm cơ chế reset: chỉ cần restart backend là DB tự xoá và seed lại. Hệ quả ngược lại cũng đúng — **mọi lần restart backend đều phải chạy lại seed**, nếu không CSV 200 tài khoản sẽ trỏ vào tài khoản không tồn tại.

Dùng trước Spike vì `POST /api/checkout` không kiểm giỏ hàng, không kiểm tồn kho, insert thẳng vào bảng `orders` — một lượt để lại hàng chục nghìn đơn rác. Nó cũng dọn luôn `userCarts` trong RAM (biến toàn cục không bao giờ được xoá), nên tiến trình mới không mang theo bộ nhớ phình từ lượt trước — điều kiện cần để đo được đúng đường RES ở Phần 4.

Khác biệt so với cái trên: `reset-lockout.js` **giữ** dữ liệu, `reset-db.sh` **xoá** dữ liệu. Đừng dùng lẫn.

## `scripts/jtl-stats.py` — đọc số từ log thô

Tính p50/p90/p95/p99, tỉ lệ lỗi, throughput **trực tiếp từ file `.jtl`**, cố tình không đọc `statistics.json` do JMeter sinh ra. Có 5 lệnh con: `summary`, `errors`, `timeline`, `threads`, `steady`.

Đây là script quan trọng nhất về mặt điểm số. Mục 6:103 bắt mỗi chỗ AI đọc sai phải kèm *"the correct value from your raw .jtl log"* — nghĩa là con số phản bác phải tự tính được, không được lấy lại từ dashboard. Và chính vì tự tính mà bạn phát hiện được dashboard JMeter báo p95 = 1671ms trong khi log thô cho 237ms: dashboard mặc định `statistic_window = 20000` nên chỉ tính trên 20 nghìn mẫu cuối của lượt 770 ngh

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 50 — 17/08/2026 16:24:32

**Prompt (nguyên văn):**

```text
mấy cái lệnh mà chạy load stress spike đồ á
```

**Công cụ AI đã gọi:** 5 lần — `Bash`

**Output AI:**

```text
Chia làm hai loại: **lệnh chạy chính thức** (đã chạy xong, sinh ra `.jtl` trong [results/raw/](results/raw/)) và **lệnh chạy khi quay video** (rút ngắn, ghi ra `/tmp`). Cấu trúc giống nhau, chỉ khác tham số.

## Bộ khung chung

```bash
source env.sh                      # nạp Java + JMeter portable trong tools/ vào PATH
cd plans
jmeter -n -t 23127262_Load_20260811.jmx \
       -l ../results/raw/load-<ISO>.jtl \
       -e -o ../results/html/load-<ISO>/
```

| Cờ | Nghĩa |
|---|---|
| `-n` | non-GUI, chạy trong terminal — đề mục 8:119 yêu cầu |
| `-t` | file test plan `.jmx` đầu vào |
| `-l` | ghi **log thô** ra `.jtl`, mỗi request một dòng CSV — đây là thứ mục 11:149 bắt nộp nguyên vẹn |
| `-e -o` | sau khi chạy xong, sinh thư mục HTML dashboard. Thư mục `-o` **phải chưa tồn tại**, nên không lượt nào ghi đè lượt nào |
| `-J<tên>=<giá trị>` | ghi đè một tham số của plan từ dòng lệnh, không phải sửa file `.jmx` |

`source env.sh` bắt buộc vì JMeter và JDK nằm trong [tools/](tools/) chứ không cài hệ thống (máy không có sudo). Quên bước này thì báo `jmeter: command not found`.

## Tham số `-J` của từng plan

Mỗi `.jmx` khai `__P(tên, giá-trị-mặc-định)` nên chạy trần cũng được, `-J` chỉ để đổi mức tải mà không đụng vào file plan:

| Plan | Tham số | Mặc định | Nghĩa |
|---|---|---|---|
| Load | `threads` / `rampup` / `duration` | 50 / 60 / 300 | số luồng, thời gian tăng dần, thời gian giữ tải (giây) |
| Stress | `threads` / `rampup` / `duration` | 250 / 250 / 330 | ramp-up = threads nên đúng 1 luồng/giây → giây thứ N = N user đồng thời |
| Spike | `base` / `baseduration` | 20 / 300 | nhóm nền chạy suốt |
| Spike | `spike` / `spikeduration` / `spikedelay` | 400 / 45 / 120 | nhóm vọt: 400 luồng, giữ 45s, khởi động ở giây thứ 120 |

Cả ba plan còn có `host` / `port` (mặc định `localhost:3000`) và `listenerfile`.

## Lượt chính thức đã chạy bằng gì

Tôi đọc cột `allThreads` trong chính các file `.jtl` để xác nhận, thay vì tin ghi chép:

| Lượt | Luồng thật trong log | Lệnh |
|---|---|---|
| Load chính thức | 50 | chạy trần, đúng mặc định của plan |
| Spike chính thức | 420 (= nền 20 + vọt 400) | chạy trần, đúng mặc định |
| Stress chính thức | **2000** | phải có `-Jthreads=2000 -Jrampup=2000` |
| Soak 11 phút | **1000** | plan Load + `-Jthreads=1000 -Jduration=660` |

Stress có 4 file `.jtl` vì mức 250 và 800 luồng **không làm gãy được SUT** — phải leo thang từng nấc mới tới điểm gãy 1800–2000. Giữ cả 4 lượt là bằng chứng bạn đi tìm ngưỡng chứ không chọn sẵn số đẹp;

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 51 — 17/08/2026 16:25:48

**Prompt (nguyên văn):**

```text
ta có cần chạy trước eshop không, cái phần chính của video là demo cái gì
```

**Output AI:**

```text
## Có, bắt buộc phải chạy EShop trước

JMeter bắn thẳng vào `localhost:3000`. Backend không chạy thì mọi request trả `Connection refused`, `.jtl` toàn lỗi, và video thành bằng chứng ngược.

Chuẩn bị **trước khi bấm ghi**:

```bash
cd ~/projects/hw05
./scripts/reset-db.sh                       # khởi động backend + seed lại dữ liệu nền
curl -s localhost:3000/api/products | head -c 100    # xác nhận có JSON trả về
```

Nhớ: `reset-db.sh` khởi động lại backend, mà **mỗi lần restart là DB tự bị `DROP TABLE` rồi seed lại từ đầu**. Nên không bao giờ được restart backend mà quên chạy `seed-data.js` — script này đã gộp sẵn cả hai bước, dùng nó là an toàn.

Backend hiện đang chạy sẵn (PID 82786, 152 sản phẩm + 210 tài khoản) từ lúc tôi đo htop ở trên.

## Phần chính của video demo cái gì

Nói thẳng cho khỏi lệch hướng: **video không phải để demo web EShop, cũng không phải để demo cách dựng test plan trong JMeter GUI.**

Nó tồn tại để chứng minh đúng ba điều — mục 6:95 và 11:150 chỉ chấm ba điều này:

| Cần chứng minh | Thể hiện bằng |
|---|---|
| Bạn **thật sự chạy** các lượt tải này trên máy của mình | gõ lệnh `jmeter -n -t ...` và để nó chạy hết trên camera, không cắt |
| Công cụ đo và tài nguyên backend **cùng một khung hình** | JMeter phải bên phải, htop bên trái, thấy đồng thời |
| Bạn **hiểu con số mình báo cáo** | thuyết minh: vì sao chọn tham số đó, con số trên màn hình nghĩa là gì |

Điều thứ ba là chỗ tách điểm cao với điểm trung bình. Ai cũng quay được cảnh JMeter chạy; thứ TA tìm là bạn có giải thích được **vì sao** think-time 800ms, **vì sao** ramp-up 1 luồng/giây, **vì sao** tỉ lệ lỗi 3,5% là bug chức năng chứ không phải quá tải.

## Chia thời lượng

| Phần | Thời lượng | Trọng số |
|---|---|---|
| Mở đầu + `hostname` | ~50s | bắt buộc có, không cần dài |
| Load / Stress / Spike chạy thật | ~2 phút mỗi cái | **đây là phần chính**, ~6 trên 8 phút |
| Ngưỡng chịu đựng + phát hiện p95 | ~1,5 phút | phần chốt, ăn mục 6:94 |

Nghĩa là **khoảng ba phần tư video là cảnh JMeter đang chạy trong khi bạn nói**. Không có slide, không có cảnh mở trình duyệt xem giao diện EShop, không có cảnh kéo thả trong JMeter GUI.

## Mẹo: cắt clip đúng chỗ `reset-db.sh`

Đề cho phép chia nhiều clip. Ở Phần 4 bạn phải chạy `reset-db.sh`, nó mất kha khá thời gian để seed 200 tài khoản — dead air không có gì để nói. Cắt clip đúng ở đó: kết thúc clip Stress, chạy `reset-db.sh` khi máy đang không quay, rồi mở clip Spike bằng cách nói *"trước clip này em đã chạy reset-db.sh, và đây 

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 52 — 17/08/2026 16:27:02

**Prompt (nguyên văn):**

```text
oke là chúng ta sẽ test performance của app đó, rồi test bằng cách nào
```

**Công cụ AI đã gọi:** 2 lần — `Bash`

**Output AI:**

```text
Nguyên lý gọn trong một câu: **JMeter giả lập N người dùng ảo, mỗi người là một luồng gửi HTTP request thật vào `localhost:3000`, bấm giờ từng request rồi ghi mỗi request thành một dòng CSV.** Không có mô phỏng, không có ước lượng — request thật, backend thật, số thật.

## Bên trong plan Load thật có gì

Tôi liệt kê đúng các element trong [23127262_Load_20260811.jmx](plans/23127262_Load_20260811.jmx):

| Element | Vai trò |
|---|---|
| **Thread Group** `Nguoi dung duyet san pham` | Quyết định *bao nhiêu người, tới nhanh cỡ nào, chạy bao lâu* → `threads` / `rampup` / `duration` |
| **CSV Data Set Config** `data/products.csv` | Mỗi luồng đọc một dòng khác nhau, nên 120 người tìm 120 từ khoá khác nhau chứ không cùng một truy vấn (nếu cùng, SQLite cache lại và số đo thành vô nghĩa) |
| **HTTP Request** ×2 | `GET /api/products` và `GET /api/products?search=${tukhoa}` — đây là chỗ thật sự gọi API |
| **Assertion** ×6 | Kiểm response **đúng**, không chỉ **nhanh**: mã 200, `Content-Type` là JSON, phần tử đầu có trường `id`, độ trễ dưới 2000ms, số kết quả khớp kỳ vọng ghi trong CSV |
| **Uniform Random Timer** `800ms ± 200` | Think-time — luồng ngủ giữa hai request để giống người thật đọc trang |
| **Summary Report** | Listener, gom kết quả và ghi ra `.jtl` |

## Vòng đời một luồng ảo

```
lấy 1 dòng từ CSV  →  GET /api/products      →  chạy 4 assertion  →  ghi 1 dòng .jtl
                   →  ngủ 800ms ± 200
                   →  GET /api/products?search=...  →  chạy 3 assertion  →  ghi 1 dòng .jtl
                   →  ngủ 800ms ± 200  →  lặp lại cho tới hết duration
```

120 luồng chạy song song vòng lặp này. Ramp-up 60 giây nghĩa là chúng không vào cùng lúc mà rải đều — luồng thứ 1 vào ở giây 0, luồng thứ 120 vào ở giây 60.

## Mỗi request để lại một dòng như thế này

```
1786415538905,14,GET danh sach san pham,200,OK,...,true,,22283,155,1,1,http://localhost:3000/api/products,13,0,9
```

Đọc ra: mốc thời gian, **elapsed = 14ms**, tên sampler, mã 200, `success=true`, số byte, số luồng đang hoạt động, URL, **Latency 13ms**, **Connect 9ms**. Lượt Load chính thức có ~14 nghìn dòng như vậy; lượt Stress có 770 nghìn dòng.

Toàn bộ p95, throughput, error rate trong báo cáo đều là phép tính trên tập dòng này — đó là ý nghĩa của R11: không có con số nào "từ trên trời", cái nào cũng lôi lại được bằng [jtl-stats.py](scripts/jtl-stats.py).

## Ba scenario khác nhau ở đâu

Cơ chế y hệt nhau. Chỉ khác **hình dạng đường tải** và **endpoint bắn vào**:

| | Load | Stress | Spi

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 53 — 17/08/2026 16:31:05

**Prompt (nguyên văn):**

```text
khi chạy từng scenario thì htop có chuyện gì xảy ra, và xem như thế nào để biết
```

**Công cụ AI đã gọi:** 2 lần — `Bash`

**Output AI:**

```text
Để tôi chạy thật Stress và Spike ở mức demo rồi lấy đúng con số htop sẽ hiện — dự đoán không đáng tin bằng đo.

Đo xong cả ba. Dưới đây là con số thật, không phải dự đoán.

## Ba cột cần nhìn, hai cột bỏ qua

Trong dòng `node server.js` của htop:

| Cột | Ý nghĩa | Dùng để nói gì |
|---|---|---|
| **CPU%** | Tính theo **một nhân**, nên >100% là bình thường và có ý nghĩa | Server đang phải làm việc nặng cỡ nào |
| **RES** | RAM vật lý tiến trình đang thật sự chiếm | Bộ nhớ có phình và có nhả lại không |
| **TIME+** | Tổng thời gian CPU tích luỹ | Nhảy liên tục = tiến trình đang làm việc thật, không treo |
| ~~VIRT~~ | Không gian địa chỉ Node đặt trước (vài GB) | Bỏ qua, nói tới là bị hỏi vặn |
| ~~MEM%~~ | RES chia 30 GB RAM máy | Bỏ qua, luôn ~0.4%, vô nghĩa |

Thêm một thứ ở **đầu màn hình htop**: dãy 16 thanh CPU meter. Khi bắn tải, bạn sẽ thấy **chỉ một hai thanh sáng lên, mười bốn thanh còn lại gần như im**. Đó là hình ảnh trực quan nhất cho kết luận quan trọng nhất của bài — nút thắt nằm ở một nhân, do Node chạy đơn luồng, không phải máy yếu.

## Chuyện gì xảy ra ở từng scenario

**Load — 120 luồng, 40 giây** *(đo thật)*

| Giây | RES | CPU% |
|---|---|---|
| 0 | 85 MB | 0% |
| 14 | 98 MB | 17% |
| 20–40 | 114 → 118 MB | 14–18% |

Đường phẳng và hiền. CPU chỉ 17% vì think-time 800ms bóp tốc độ — **kịch bản là nút cổ chai, không phải server**.

**Stress — 400 luồng, ramp-up 60s** *(đo thật)*

| Giây | RES | CPU% |
|---|---|---|
| 6 | 117 MB | 10% |
| 21 | 122 MB | 38% |
| 41 | 123 MB | 60% |
| 56 | 127 MB | 75% |
| 76–90 | 147 → 148 MB | 83–87% |
| sau khi dừng | 83 MB | 0% |

Đây là scenario htop diễn hay nhất: **CPU leo gần như tuyến tính theo số luồng đang vào**. Bạn chỉ vào cột CPU và nói "mỗi luồng thêm vào là một nấc CPU" — nhìn thấy được ngay trên màn hình.

**Spike — nền 20, vọt 300 ở giây 30** *(đo thật)*

| Giây | RES | CPU% | Diễn biến |
|---|---|---|---|
| 1–29 | 83 → 88 MB | 2–3% | nền, gần như đứng yên |
| 33 | 89 MB | 7% | bắt đầu vọt |
| 37–41 | 98 → 116 MB | 23% | **cú vọt, RES nhảy 27 MB trong 4 giây** |
| 45–61 | 119 MB | 23–25% | giữ đỉnh |
| 65–97 | 118 MB | 2–4% | **CPU về nền nhưng RES vẫn đứng ở 118** |

Ở Spike thì **cột RES mới là ngôi sao**, không phải CPU. Cảnh đáng quay nhất là giây 65: CPU sập về 3% trong khi RES vẫn đứng nguyên. Đó là hình ảnh của "hồi phục về tốc độ nhưng không hồi phục về bộ nhớ".

## Cách xem để "biết" — đọc theo cặp

Một cột đơn lẻ không nói lên gì. Kết luận nằm ở **quan hệ giữa hai thứ**:

| Nhìn thấ

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 54 — 17/08/2026 16:39:27

**Prompt (nguyên văn):**

```text
ý tôi là tôi chạy một scenario tôi không biết nhìn vào đâu của htop để biết xảy ra chuyện gì  trình bày trong video
```

**Công cụ AI đã gọi:** 4 lần — `Bash`

**Output AI:**

```text
Đây là gốc rễ vấn đề — tôi vừa chụp thật màn hình htop của máy bạn và thấy **nó đang hiện 12 dòng `node server.js` giống hệt nhau**. Không biết nhìn đâu là đúng, chứ không phải bạn không biết đọc.

## Sửa trước, 1 phím

Máy bạn đang đặt `hide_userland_threads=0` trong `~/.config/htop/htoprc`, nên htop liệt kê từng thread của Node thành từng dòng riêng — 12 dòng, RES giống nhau, TIME+ khác nhau, rối không đọc được.

**Mở htop, bấm phím `H`.** 12 dòng gộp lại còn **đúng 1 dòng**. Cài đặt này tự lưu, không phải làm lại. Làm việc này trước khi bấm ghi.

## Sau khi bấm H, màn hình còn đúng 3 chỗ cần nhìn

```
 ┌─ ① 16 thanh CPU của toàn máy ────────────────────────────────┐
   0[      0.0%]   4[  0.0%]   8[  0.0%]  12[  0.0%]
   1[     85.0%]   5[  0.0%]   9[  0.0%]  13[  0.0%]   ← chỉ 1 thanh sáng
   2[      0.0%]   6[  0.0%]  10[  0.0%]  14[  0.0%]
   3[      0.0%]   7[  0.0%]  11[  0.0%]  15[  0.0%]
 └──────────────────────────────────────────────────────────────┘
   Mem[|||||||####        10.1G/30.6G]   Tasks: 188, 1428 thr
   Swp[                    0K/8.00G]     Load average: 0.32 0.47 0.57   ← ③

   PID USER  PRI NI  VIRT   RES   SHR S  CPU%  MEM%   TIME+  Command
 82786 qt     20  0 1310M 89540 55944 S   0.0   0.3  0:55.38 node server.js
                          └──┬─┘             └─┬┘
                          ② RES            ② CPU%
```

**① Dãy thanh CPU** — nhìn xem *mấy thanh sáng*. Bắn tải mà chỉ 1–2 thanh sáng, 14 thanh còn lại im → chứng minh Node đơn luồng, đây là kết luận đắt nhất của cả bài.

**② Dòng `node server.js`, hai cột CPU% và RES** — đây là 2 con số bạn đọc ra miệng.

Lưu ý: htop trên máy bạn hiện RES **theo kilobyte thô**. `89540` nghĩa là **87 MB**, không phải 89 nghìn MB. Trên video cứ chia 1024 rồi đọc "tám mươi bảy megabyte".

**③ Load average** — chỉ dùng một lần, ở Stress, để đối chiếu: CPU tiến trình 132% mà load average toàn máy chỉ 12% → máy còn rảnh chán, nghẽn là do phần mềm.

## Mỗi scenario nhìn vào chỗ nào

| Scenario | Nhìn chủ yếu vào | Sẽ thấy gì (đã đo thật) | Câu nói mẫu |
|---|---|---|---|
| **Load** | ② cột CPU% | 0% → 17% rồi đứng phẳng | "CPU chỉ mười bảy phần trăm — nút thắt là think-time trong kịch bản, không phải server" |
| **Stress** | ② cột CPU% + ① dãy thanh | CPU leo đều 10 → 38 → 60 → 85%, mà chỉ 1 thanh sáng | "Mỗi luồng thêm vào là một nấc CPU. Và thầy cô thấy chỉ một nhân duy nhất sáng lên" |
| **Spike** | ② cột RES | Nền 88 MB → vọt lên 119 MB trong 4 giây → CPU rơi về 3% mà RES vẫn đứng ở 118 | 

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 55 — 17/08/2026 16:41:44

**Prompt (nguyên văn):**

```text
oke giờ tôi split ra 2 terminal rồi, làm gì nữa
```

**Output AI:**

```text
Còn 4 bước, khoảng 5 phút.

## Bước 1 — Pane TRÁI: dựng htop

```bash
htop -d 10 -F 'node server.js'
```

Rồi bấm ngay **`H`**. Kiểm: còn đúng **1 dòng** `node server.js` (trước khi bấm là 12 dòng). Nếu vẫn nhiều dòng thì bấm lại `H` lần nữa — nó là phím bật/tắt.

Để yên pane này, từ giờ không đụng vào nữa.

## Bước 2 — Pane PHẢI: nạp môi trường và kiểm SUT

```bash
cd ~/projects/hw05
source env.sh
jmeter --version | head -3          # phải in ra 5.6.3
curl -s localhost:3000/api/products | head -c 80    # phải ra JSON
```

Backend đang chạy sẵn (PID 82786, đã seed 152 sản phẩm + 212 tài khoản) từ lúc tôi đo. Nếu `curl` không ra gì thì chạy `./scripts/reset-db.sh`.

Thêm một lệnh nên chạy trước khi quay, vì lượt Stress tôi vừa thử đã làm khoá 10 tài khoản thăm dò:

```bash
node scripts/reset-lockout.js
```

## Bước 3 — Chỉnh cho lên hình đọc được

| Việc | Vì sao |
|---|---|
| Phóng font terminal lên ~14–16pt (`Ctrl` + `+`) | YouTube nén 1080p, font nhỏ thành nhoè, TA không đọc được cột RES |
| Pane trái hẹp hơn pane phải một chút (~40/60) | htop chỉ cần đủ rộng để thấy hết tới cột `Command`; JMeter in dòng `summary` khá dài |
| Xoá màn hình pane phải (`clear`) | Bắt đầu sạch, không lộ lệnh thử nghiệm cũ |
| Tắt thông báo hệ thống, đóng tab riêng tư | Đang ghi toàn màn hình |

## Bước 4 — Chạy nháp một lượt ngắn, KHÔNG ghi

Đây là bước tôi khuyên đừng bỏ:

```bash
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=40 -l /tmp/thu.jtl
```

40 giây. Trong lúc nó chạy, nhìn sang pane trái và **tự kiểm 3 điều**:

- Dòng `node server.js` có nhích cột CPU% lên khoảng 15–18 không
- Cột RES có bò từ ~87 lên ~118 không
- Cả hai pane có nằm gọn trong khung hình mà **không phải cuộn** không

Nếu ba cái đó đúng, khung hình của bạn đạt yêu cầu mục 11:150. Rồi mới bật OBS, chọn **ghi toàn màn hình** (không phải window capture), bật mic, `clear` pane phải, và bắt đầu từ Phần 1: `whoami && hostname`.

---

Muốn tôi sửa `hide_userland_threads=1` trong htoprc luôn không? Làm vậy thì kể cả bạn lỡ đóng htop và mở lại giữa lúc quay, nó vẫn hiện đúng 1 dòng, không phải nhớ bấm `H`.

Không — pane htop **không cần `cd` gì cả**. htop đọc `/proc`, không quan tâm bạn đang đứng ở thư mục nào. Chỉ **pane phải** mới cần `cd ~/projects/hw05` để gọi `source env.sh` và chạy JMeter.

Nhưng ảnh của bạn đang lộ hai vấn đề cần sửa trước khi quay:

## 1. Vẫn còn 12 dòng — chưa bấm `H`

Click vào pane htop rồi bấm **`H`** (Shift+h). 12 dòng `node server.js` sẽ gộp còn 1 dòn

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 56 — 17/08/2026 16:43:22

**Prompt (nguyên văn):**

```text
giờ end hết đi rồi cho tôi command để tôi tự chạy eshop , giờ có nhiều dòng quá
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Đã kill tiến trình `node server.js` tôi khởi động lúc nãy. Máy giờ không còn backend nào chạy — bạn tự dựng lại từ đầu.

## Pane TRÁI — dựng lại htop cho gọn

Bấm `q` để thoát htop hiện tại, rồi:

```bash
htop -d 10
```

Sau khi nó mở, bấm 2 phím theo thứ tự:

1. **`H`** — gộp 12 dòng thread thành 1 dòng
2. **`F4`** → gõ `node server.js` → **Enter** — chỉ hiện tiến trình backend

Còn đúng 1 dòng thì đạt. Lúc này chưa có backend nên bảng sẽ trống — bình thường, chạy bước dưới xong nó tự hiện ra.

## Pane PHẢI — chạy EShop

```bash
cd ~/projects/hw05
./scripts/reset-db.sh
```

Script này làm trọn gói: dừng backend cũ → khởi động lại → chờ nó lên → seed 147 sản phẩm + 210 tài khoản → in ra số liệu xác nhận. Chờ nó in xong dòng `Da reset xong.`

Rồi nạp JMeter vào PATH:

```bash
source env.sh
jmeter --version | head -3
```

## Kiểm nhanh trước khi quay

```bash
curl -s localhost:3000/api/products | head -c 80
```

Ra JSON là được. Cùng lúc nhìn sang pane trái: phải thấy **1 dòng `node server.js`**, RES khoảng `85000`–`90000` (tức 83–88 MB), CPU% gần 0.

---

Nếu muốn thấy backend chạy trực tiếp trong terminal thay vì chạy nền, dùng terminal thứ ba:

```bash
cd ~/projects/hw05/sut/backend && node server.js
```

Nhưng nhớ: **khởi động server.js là DB tự bị xoá và seed lại từ đầu**, nên chạy kiểu này thì phải chạy tiếp `node ~/projects/hw05/scripts/seed-data.js` ở terminal khác, nếu không CSV sẽ trỏ vào 200 tài khoản không tồn tại. Dùng `reset-db.sh` là đã gộp sẵn cả hai bước.
```

---

## Lượt 57 — 17/08/2026 16:44:21

**Prompt (nguyên văn):**

```text
<ide_opened_file>The user opened the file Untitled-1 in the IDE. This may or may not be related to the current task.</ide_opened_file>
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Máy đã sẵn sàng: [sut/backend/](sut/backend/) đủ file, `node_modules` đã cài, Node v22.22.1, cổng 3000 đang trống. Không có gì chặn.

## Cách 1 — một lệnh, chạy nền (khuyên dùng)

```bash
cd ~/projects/hw05
./scripts/reset-db.sh
```

Chờ tới khi in ra:

```
[4/4] Kiem chung trang thai sach:
  - San pham: 152
  - Don hang: 0
Da reset xong.
```

Terminal được trả lại cho bạn ngay, backend chạy nền.

## Cách 2 — thủ công, thấy log server trực tiếp

Cần **2 terminal**:

Terminal A (để yên, đây là server):
```bash
cd ~/projects/hw05/sut/backend
node server.js
```
Phải in ra `Server is running on http://localhost:3000`.

Terminal B (seed lại dữ liệu — bắt buộc, vì lệnh trên vừa `DROP TABLE` toàn bộ):
```bash
cd ~/projects/hw05
node scripts/seed-data.js
```

## Kiểm

```bash
curl -s localhost:3000/api/products | head -c 80
```

Ra JSON bắt đầu bằng `[{"id":1,...` là xong. Pane htop sẽ hiện dòng `node server.js` với RES khoảng 85000.

---

Nếu vẫn không lên, dán cho tôi **dòng lỗi nó in ra**, hoặc chạy:

```bash
tail -20 ~/projects/hw05/sut/backend/server-run.log
```

Không đoán mò được nếu không biết nó báo gì.
```

---

## Lượt 58 — 17/08/2026 16:45:38

**Prompt (nguyên văn):**

```text
làm sao gộp 10 dòng vô
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Bấm **`Shift` + `H`** khi con trỏ đang ở cửa sổ htop. Một lần bấm là 11 dòng thread biến mất, còn đúng 1 dòng.

Dấu hiệu nhận biết trong ảnh của bạn: 11 dòng chữ **màu xanh lá** là thread, dòng chữ **màu trắng** (PID 82786) mới là tiến trình thật. Bấm `H` là ẩn hết mấy dòng xanh.

## Nếu bấm `H` không ăn

Làm bằng menu, chắc chắn hơn:

1. Bấm **`F2`** (Setup)
2. Chọn cột trái **`Display options`** — dùng phím mũi tên
3. Tìm dòng **`Hide userland process threads`**
4. Bấm **`Space`** để đánh dấu `[x]`
5. Bấm **`F10`** để lưu và thoát

Cách này ghi thẳng vào `~/.config/htop/htoprc` nên giữ vĩnh viễn, mở htop lần sau không phải làm lại.

## Muốn tôi sửa thẳng file cấu hình?

Máy bạn hiện đang đặt `hide_userland_threads=0`. Tôi sửa thành `1` là xong, bạn khỏi mò menu — nhưng phải **thoát htop trước** (bấm `q`), vì htop ghi đè lại file này khi thoát.

Nói một tiếng là tôi sửa.

Backend đã lên: `HTTP 200`, phản hồi 2ms, DB sạch (0 đơn hàng). Pane trái cũng đã lọc đúng — không còn dòng `htop` tự khớp nữa. Còn đúng một việc rồi tới quay.

## Việc còn lại ở pane trái

Click vào cửa sổ htop, bấm **`Shift` + `H`**.

11 dòng xanh biến mất, còn lại **1 dòng trắng: PID 88567, RES 77244, TIME+ 0:00.35**. Đó là backend thật.

Nếu bấm không ăn thì `F2` → `Display options` → `Hide userland process threads` → `Space` → `F10`.

## Chạy nháp 40 giây — chưa bật OBS

Pane phải:

```bash
source env.sh
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=40 -l /tmp/thu.jtl
```

Trong lúc nó chạy, nhìn pane trái kiểm 3 điều:

| Kiểm | Kỳ vọng (tôi đã đo trên chính máy này) |
|---|---|
| Cột **CPU%** dòng node | 0 → khoảng **14–18** |
| Cột **RES** | `77244` bò lên khoảng `115000–120000` |
| Dòng `summary +` bên phải | `Err: ...` khoảng **3,5%** — đúng lỗi `O'Neill` |

Ba cái đúng là khung hình đạt chuẩn mục 11:150.

## Rồi bắt đầu quay

1. `clear` pane phải cho sạch
2. Bật OBS → **ghi toàn màn hình** (không phải window capture) → bật mic
3. Mở [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md) trên điện thoại hoặc màn hình phụ để đọc
4. Bấm ghi, mở đầu bằng:

```bash
whoami && hostname
```

Từ đây cứ bám kịch bản. Lệnh đầu tiên của Phần 2 là:

```bash
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 -l /tmp/demo-load.jtl
```

Lưu ý nhỏ: lượt nháp vừa rồi **không** làm bẩn dữ liệu (Load chỉ đọc), nên không cần reset lại trước khi quay. Chỉ Stress và Spike mới cần reset, và kịch bản đã có sẵn hai lệnh đó đúng chỗ.
```

---

## Lượt 59 — 17/08/2026 16:46:56

**Prompt (nguyên văn):**

```text
~$ source env.sh
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=40 -l /tmp/thu.jtl
bash: env.sh: No such file or directory
bash: cd: plans: No such file or directory
Command 'jmeter' not found, but can be installed with:
sudo apt install jmeter
~$
```

**Output AI:**

```text
Bạn đang đứng ở `~` chứ không phải trong thư mục bài. Dấu nhắc `~$` cho thấy điều đó — pane phải này là cửa sổ mới, chưa `cd` vào project.

```bash
cd ~/projects/hw05
source env.sh
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=40 -l /tmp/thu.jtl
```

Hai điều cần nhớ:

- **`source env.sh` phải chạy từ `~/projects/hw05`** — nó là file nằm trong thư mục đó, và nó nạp JMeter portable trong [tools/](tools/) vào `PATH`
- **Đừng `sudo apt install jmeter`** như gợi ý của shell. Bản apt là 2.x cũ, khác bản 5.6.3 bạn đã dùng cho toàn bộ số liệu trong báo cáo. Máy cũng không có sudo không mật khẩu — đây chính là lý do bài này dùng bản portable.

Kiểm nhanh trước khi chạy:

```bash
jmeter --version | head -3
```

Ra `5.6.3` là đúng. Nếu vẫn báo not found thì `source env.sh` chưa chạy được — dán lại lỗi cho tôi.

Mỗi terminal mới mở đều phải `source env.sh` lại, vì nó chỉ sửa `PATH` của phiên shell hiện tại. Lúc quay video, nhớ chạy nó ở Phần 1 — mà như vậy cũng tiện, vì nó cho thấy bạn dùng JMeter portable trong `tools/` chứ không phải bản cài sẵn.
```

---

## Lượt 60 — 17/08/2026 16:48:24

**Prompt (nguyên văn):**

```text
~$ cd ~/projects/hw05
source env.sh
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=40 -l /tmp/thu.jtl
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
Creating summariser <summary>
Created the tree successfully using 23127262_Load_20260811.jmx
Starting standalone test @ 2026 Aug 17 16:47:08 ICT (1786960028649)
Waiting for possible Shutdown/StopTestNow/HeapDump/ThreadDump message on port 4445
summary +    439 in 00:00:21 =   20.7/s Avg:     1 Min:     0 Max:    21 Err:    15 (3.42%) Active: 43 Started: 43 Finished: 0
summary +   1135 in 00:00:38 =   29.7/s Avg:     1 Min:     0 Max:     4 Err:    38 (3.35%) Active: 0 Started: 120 Finished: 120
summary =   1574 in 00:01:00 =   26.4/s Avg:     1 Min:     0 Max:    21 Err:    53 (3.37%)
Tidying up ...    @ 2026 Aug 17 16:48:08 ICT (1786960088308)
... end of run
~/projects/hw05/plans$
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Chạy thành công. Và lượt nháp này vừa tự chứng minh luôn phần thuyết minh của bạn — tôi phân tích file `/tmp/thu.jtl` vừa sinh ra:

```
Tổng mẫu 1574 · lỗi 53 (3.37%)
  53 (100.0% số lỗi)  HTTP 500
  URL: http://localhost:3000/api/products?search=O%27Neill
```

**100% lỗi đến từ đúng một từ khoá `O'Neill`**, không phải do quá tải. Đúng câu bạn sẽ nói ở Phần 2.

## Một điều chỉnh cho lúc quay

Lượt nháp này `Active` chỉ lên tới **43** rồi tụt về 0, vì `duration=40` mà `rampup` mặc định là 60 — luồng chưa vào hết thì bài test đã hết giờ. Nên CPU trên htop lúc nãy chắc chỉ khoảng 5–8%, thấp hơn mức 14–18% tôi báo trước đó.

Lệnh quay thật dùng `-Jduration=120` nên không dính vấn đề này: ramp 60 giây rồi giữ đủ 120 luồng thêm 60 giây nữa — CPU sẽ lên đúng 14–18% và đứng phẳng, dễ chỉ vào hơn nhiều.

## Sẵn sàng quay

Trạng thái hiện tại: backend chạy PID 88567, DB sạch 0 đơn hàng, JMeter 5.6.3 đã trong PATH, pane trái lọc đúng.

```bash
clear
```

Rồi bật OBS (ghi toàn màn hình + mic), và mở đầu bằng:

```bash
whoami && hostname
```

Kịch bản đọc nguyên văn ở [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md). Nhớ khi sang Phần 2 phải `cd plans` trước, và lệnh là `-Jduration=120` chứ không phải 40 như lúc nháp.

Một điều duy nhất còn thiếu: bạn đã bấm `Shift+H` để gộp 11 dòng thread chưa? Nếu pane trái vẫn còn 11 dòng xanh thì xử lý nốt trước khi bấm ghi — trên video sẽ rất rối mắt khi bạn chỉ vào cột RES.
```

---

## Lượt 61 — 17/08/2026 16:49:01

**Prompt (nguyên văn):**

```text
~/projects/hw05/plans$ jmeter --version | head -3
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
~/projects/hw05/plans$
```

**Output AI:**

```text
`head -3` cắt mất phần cần xem — 3 dòng đầu là cảnh báo (in ra stderr), còn banner phiên bản nằm sau đó. Bỏ `head` đi, hoặc lọc stderr:

```bash
jmeter --version 2>/dev/null
```

Sẽ ra khối ASCII art kèm dòng `5.6.3`.

Thực ra bạn **không cần kiểm nữa** — lượt nháp vừa rồi chạy được và sinh ra `/tmp/thu.jtl` 1574 mẫu, đó là bằng chứng mạnh hơn nhiều so với `--version`. JMeter đã hoạt động đúng.

## Về mấy dòng WARN đó

Chúng vô hại — chỉ là cảnh báo nội bộ của thư viện log4j trong JMeter 5.6.3, không ảnh hưởng kết quả đo. Nhưng chúng **sẽ xuất hiện trên video** mỗi lần bạn chạy JMeter, nên tốt nhất là chủ động nói một câu ngắn khi nó hiện ra:

> "Mấy dòng cảnh báo này là của thư viện log nội bộ JMeter, không liên quan tới phép đo."

Nói trước một câu thì người xem không thắc mắc, mà cũng cho thấy bạn biết mình đang nhìn gì. Đừng cố giấu hay cắt đi.

Nếu muốn ẩn hẳn cho màn hình sạch:

```bash
jmeter -n -t ... -l ... 2>/dev/null
```

Nhưng tôi khuyên **đừng** dùng khi quay — chuyển hướng stderr cũng nuốt luôn thông báo lỗi thật nếu có sự cố giữa chừng, và người xem sẽ không thấy được lúc nào có vấn đề.

Giờ `clear` rồi bật OBS thôi.
```

---

## Lượt 62 — 17/08/2026 16:49:34

**Prompt (nguyên văn):**

```text
<ide_opened_file>The user opened the file Untitled-2 in the IDE. This may or may not be related to the current task.</ide_opened_file>
```

**Công cụ AI đã gọi:** 3 lần — `Bash`

**Output AI:**

```text
Trước hết một chỗ phải sửa trong lời thoại — tôi vừa kiểm bằng chính file log thô.

## ⚠️ Câu "một luồng mỗi giây" đang sai với lượt chính thức

[VIDEO-SCRIPT.md](VIDEO-SCRIPT.md) Phần 3 viết *"em đặt tăng đúng một luồng mỗi giây… tại giây thứ N thì có đúng N người dùng đồng thời"*. Tôi rút hồ sơ ramp thật từ `stress-20260813T003655Z.jtl`:

```
t=  0s → 12 luồng      t=150s → 1013 luồng
t= 60s → 413 luồng     t=270s → 1862 luồng
t=120s → 813 luồng     t=300s → 2000 luồng (giữ tới hết 380s)
```

Tức **6,7 luồng/giây**, không phải 1. Con số 1 luồng/giây chỉ đúng với lượt dò đầu tiên (250 luồng / 250 giây). Nói nhầm câu này trên camera thì ở buổi vấn đáp bị hỏi "vậy 1800 luồng là giây thứ 1800 à?" là kẹt — điểm gãy thật rơi vào **giây thứ 262**.

Câu thay thế, vẫn giữ được ý hay:

> "Ramp-up tuyến tính với tốc độ không đổi — lượt chính thức là hai nghìn luồng trong ba trăm giây, tức khoảng sáu phẩy bảy luồng mỗi giây. Nhờ tốc độ không đổi mà trục thời gian ánh xạ thẳng sang trục tải, nên em đọc được điểm gãy một nghìn tám trăm luồng rơi đúng vào giây thứ hai trăm sáu mươi hai."

Tiện là mức demo `400 luồng / 60 giây` cũng ra đúng **6,7 luồng/giây** — cùng tốc độ với lượt chính thức, chỉ ngắn hơn. Nói được câu đó là ăn điểm.

---

# Bảng chạy — 3 scenario

## ① LOAD

```bash
cd ~/projects/hw05/plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 -l /tmp/demo-load.jtl
```

**htop sẽ làm gì:** CPU% từ `0` leo dần trong 60 giây ramp lên **14–18%** rồi đứng phẳng. RES bò từ `77000` lên khoảng `118000` (77 → 115 MB). Chỉ 1–2 thanh CPU sáng.

**Nói:**
- Ghép Load với read-heavy vì endpoint chỉ đọc, chi phí thấp và ổn định → giữ tải đều lâu được, là điều kiện cần để sau này đo ngưỡng phần cứng bằng số
- Think-time 800ms ± 200: người thật đọc trang rồi mới bấm. Bỏ think-time thì req/s chỉ phản ánh tốc độ sinh tải của công cụ
- Ramp-up 60 giây, tránh cú sốc lúc khởi động — cú sốc là việc của Spike
- Chỉ vào CPU 17%: **nút thắt là think-time trong kịch bản, không phải server**
- Chỉ vào `Err: 3.4%`: toàn bộ đến từ đúng một từ khoá `O'Neill`, dấu nháy đơn làm vỡ câu SQL vì endpoint nối chuỗi thẳng vào truy vấn. Lỗi chức năng kèm SQL injection, không phải vấn đề hiệu năng. Đã log GitHub Issue #1
- Plan có 5 assertion thuộc 4 loại, trong đó có kiểm `Content-Type` vì khi lỗi hệ thống trả HTML chứ không phải JSON — chỉ kiểm mã 200 là bỏ sót hoàn toàn

## ② STRESS

```bash
node ../scripts/reset-lockout.js
jmeter -n -t 23127262_Stress_20260813.jmx -Jthrea

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 63 — 17/08/2026 16:52:51

**Prompt (nguyên văn):**

```text
xuất câu trả lời của lần gần nhất ra file đi tôi cần hỏi vài thông tin
```

**Công cụ AI đã gọi:** 2 lần — `Write`, `Bash`

**Output AI:**

```text
Đã xuất ra [VIDEO-CHEATSHEET.md](VIDEO-CHEATSHEET.md), commit `769fc9b`.

Nội dung y như câu trả lời vừa rồi, thêm hai thứ:

- **Hồ sơ ramp đầy đủ** của lượt Stress chính thức (12 mốc thời gian → số luồng), để bạn tự đối chiếu con số 6,7 luồng/giây thay vì tin lời tôi
- **Phụ lục trạng thái máy trước khi quay** — 4 lệnh chuẩn bị kèm dấu hiệu đạt, và ghi chú cách đọc RES theo kilobyte thô

Một việc còn treo: **hai file khác vẫn đang mang con số "1 luồng/giây" sai**:

| File | Chỗ sai |
|---|---|
| [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md) Phần 3 | *"Về ramp-up, em đặt tăng đúng một luồng mỗi giây"* |
| [Main-Report.md:259](submission/report/Main-Report.md#L259) | *"Tăng đều 1 luồng/giây… tại giây thứ N có đúng N người dùng đồng thời"* |

File báo cáo chính mới là chỗ đáng lo — nó là tài liệu nộp, và R11 bắt mọi con số phải truy ngược được về `.jtl`. Nói một tiếng là tôi sửa cả hai cho khớp.

Hỏi tiếp đi.
```

---

## Lượt 64 — 17/08/2026 17:00:14

**Prompt (nguyên văn):**

```text
Think-time 800ms ± 200: người thật đọc trang rồi mới bấm. Bỏ think-time thì req/s chỉ phản ánh tốc độ sinh tải của công cụ
Ramp-up 60 giây, tránh cú sốc lúc khởi động — cú sốc là việc của Spike

này là gì
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Hai khái niệm nền của kiểm thử hiệu năng. Giải thích bằng đúng số trong plan của bạn.

## Think-time — quãng nghỉ giữa hai request của một người dùng ảo

Người thật vào trang sản phẩm thì **đọc vài giây rồi mới bấm tiếp**. Think-time là mô phỏng quãng nghỉ đó: sau khi nhận xong response, luồng ảo **ngủ** một lúc rồi mới gửi request kế.

Trong plan Load nó là element `UniformRandomTimer`:

```xml
<UniformRandomTimer testname="Think time 800ms +/- 200ms">
  <stringProp name="ConstantTimer.delay">800</stringProp>
  <stringProp name="RandomTimer.range">400.0</stringProp>
```

Ngẫu nhiên chứ không cố định, vì 120 người cùng nghỉ đúng 800ms sẽ tạo ra sóng đồng bộ — tất cả bắn cùng lúc, nghỉ cùng lúc — không giống người thật chút nào.

**Vì sao bỏ nó thì số đo vô nghĩa.** Không có think-time, mỗi luồng nhận response xong là bắn request tiếp ngay lập tức. Mỗi request chỉ mất ~1ms, nên một luồng đẩy được ~1000 req/s, 120 luồng thành ~120 nghìn req/s. Con số đó không mô tả 120 người dùng — nó mô tả **tốc độ tối đa của JMeter**. Có think-time thì:

```
120 luồng ÷ 1 giây nghỉ  ≈  120 req/s      ← đo được 103 req/s, khớp
```

Đó là lý do CPU chỉ 17%: server rảnh, vì kịch bản cố tình giữ nhịp người dùng.

## ⚠️ Tên element đang ghi sai, đừng đọc nguyên văn lên video

JMeter tính `UniformRandomTimer` theo công thức **delay = 800 + ngẫu nhiên(0 … 400)**, tức khoảng nghỉ thật là **800–1200 ms, trung bình 1000 ms** — không phải "800 ± 200" (nghĩa là 600–1000) như tên element gợi ý.

Câu nên nói: *"think-time trung bình một giây, dao động đều từ tám trăm đến một nghìn hai trăm mili giây"*.

Cả ba plan đều bị cách đặt tên này:

| Plan | Cấu hình | Khoảng thật | Trung bình |
|---|---|---|---|
| Load | 800 + range 400 | 800–1200 ms | **1000 ms** |
| Stress | 300 + range 200 | 300–500 ms | **400 ms** |
| Spike | 1000 + range 600 | 1000–1600 ms | **1300 ms** |

Phần tính toán trong báo cáo chính thì **đã dùng đúng** giá trị trung bình — chỗ giải thích throughput Stress ghi `250 ÷ 0,4s = 622/s`, tức đã lấy 400ms chứ không lấy 300ms. Chỉ có tên element và lời thoại là lỏng.

## Ramp-up — thời gian để thả hết luồng vào cuộc

`-Jrampup=60` với 120 luồng nghĩa là: JMeter **không** thả cả 120 luồng cùng lúc, mà rải đều trong 60 giây — cứ nửa giây thêm một luồng. Giây 0 có 1 người, giây 30 có 60 người, giây 60 mới đủ 120 người.

**Vì sao cần.** Thả 120 luồng cùng lúc tại giây 0 tạo ra ba thứ nhiễu cùng lúc:

1. **JMeter tự nghẽn** — khởi tạo 120 thread Java đồng thời tốn CPU của chính 

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 65 — 17/08/2026 17:05:32

**Prompt (nguyên văn):**

```text
Đề ghi khoá sau 3 lần sai, hệ thống thật khoá sau 2 lần: mã nguồn cộng 2 vào bộ đếm mỗi lần sai trong khi ngưỡng là 3. Kiểm chứng bằng 10 tài khoản thăm dò riêng, mỗi tài khoản nhận đúng 2 lần 401 rồi chuyển 403

giải thích
```

**Công cụ AI đã gọi:** 3 lần — `Bash`

**Output AI:**

```text
Vừa chạy lại thật trên backend đang chạy để bạn có bằng chứng tươi:

```
Lần 1 (mật khẩu SAI):  HTTP 401
Lần 2 (mật khẩu SAI):  HTTP 401
Lần 3 (mật khẩu SAI):  HTTP 403   ← đã khoá
Lần 4 (mật khẩu SAI):  HTTP 403
Lần 5 (mật khẩu ĐÚNG): HTTP 403   ← đúng mật khẩu vẫn bị chặn
```

## Nguyên nhân nằm ở một dòng cộng

[server.js:54](sut/backend/server.js#L54) trong nhánh xử lý sai mật khẩu:

```js
const newAttempts = user.login_attempts + 2;   // ← cộng 2, không phải 1
let lockedUntil = null;
if (newAttempts >= 3) {
  lockedUntil = new Date(Date.now() + 180000).toISOString();  // khoá 180 giây
}
```

Bộ đếm nhảy **2 đơn vị mỗi lần sai**, trong khi ngưỡng khoá là **3**. Diễn biến:

| Lần sai | `login_attempts` trước | Sau khi `+2` | `>= 3`? | Kết quả |
|---|---|---|---|---|
| 1 | 0 | **2** | không | 401, chưa khoá |
| 2 | 2 | **4** | **có** | 401, **nhưng đã ghi `locked_until`** |
| 3 | — | — | — | **403** |

Bộ đếm đi `0 → 2 → 4`, **không bao giờ bằng đúng 3**, nên điều kiện `>= 3` được kích hoạt sớm hơn một nhịp so với thiết kế. Nếu dòng đó là `+ 1` thì sẽ đúng là "khoá sau 3 lần sai" như đề mô tả.

## Vì sao lần thứ 2 vẫn trả 401 chứ không phải 403

Đây là chỗ dễ đọc nhầm. Lần sai thứ 2 **ghi khoá vào DB rồi mới trả về 401** — vì nhánh sai mật khẩu luôn kết thúc bằng `res.status(401)`. Cái khoá chỉ *biểu hiện ra ngoài* ở request kế tiếp, khi hàm chạy tới đoạn kiểm ở [server.js:40](sut/backend/server.js#L40):

```js
if (user.locked_until && new Date() < new Date(user.locked_until)) {
  return res.status(403).json({ error: "Tài khoản đã bị khóa..." });
}
if (user.password === password) {   // ← dòng 46, nằm SAU đoạn kiểm khoá
```

Nên mô tả chính xác là: **hai lần sai là đủ khoá, và từ request thứ ba trở đi trả 403.**

## Hai hệ quả kéo theo, quan trọng cho bài

**1. Đang khoá thì mật khẩu đúng cũng bị chặn.** Đoạn kiểm khoá (dòng 40) nằm **trước** đoạn so mật khẩu (dòng 46) — chính là dòng "Lần 5" trong kết quả trên. Nghĩa là sau mỗi lượt Stress, tài khoản đó chết 180 giây, không đăng nhập được bằng bất kỳ cách nào.

**2. Phản hồi 403 nhanh bất thường.** Nó return ngay ở dòng 40, bỏ qua toàn bộ phần so mật khẩu và tạo JWT. Nếu CSV trộn lẫn tài khoản hợp lệ với tài khoản đã khoá, hàng loạt 403 siêu nhanh sẽ **kéo throughput trung bình đẹp lên một cách giả tạo** — số đo trông tốt trong khi thực chất server chẳng làm gì cả. Đó là lý do plan Stress tách hai nhánh bằng If Controller, và [data/credentials.csv](data/credentials.csv) đánh dấu riêng nhóm `lockout-prob

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 66 — 17/08/2026 17:06:46

**Prompt (nguyên văn):**

```text
ủa ramp up ở load và stress nó khác nhau à
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Đúng, khác — và khác **có chủ đích**, vì ramp-up đóng vai trò hoàn toàn khác nhau ở ba plan.

| Plan | Nhóm luồng | Số luồng | Ramp | Tốc độ | Ramp để làm gì |
|---|---|---|---|---|---|
| **Load** | 1 nhóm | 50 (mặc định) | 60s | 0,8 luồng/s | Chỉ là **khởi động êm**. Phần đo nằm ở đoạn phẳng *sau* ramp |
| **Stress** | 1 nhóm | 2000 (chính thức) | 300s | 6,7 luồng/s | Ramp **chính là phép đo** |
| **Spike** | nền | 20 | 20s | 1 luồng/s | Dựng đường cơ sở để so sánh |
| **Spike** | vọt | 400 | **5s** | **80 luồng/s** | Cú sốc **là mục đích** |

## Ba triết lý khác nhau

**Load — ramp là thứ bỏ đi.** Bạn muốn biết hệ thống cư xử ra sao khi tải **giữ đều**. Giai đoạn ramp là lúc tải chưa ổn định, số liệu trong đó là nhiễu. Bằng chứng: lệnh phân tích của bạn cắt hẳn nó đi —

```bash
python3 scripts/jtl-stats.py steady results/raw/soak-...jtl 60
```

Số `60` cuối chính là **bỏ 60 giây đầu** rồi mới tính throughput ổn định. Ramp chỉ tồn tại để tránh cú sốc lúc khởi động, xong việc là vứt.

**Stress — ramp là toàn bộ thí nghiệm.** Ở đây không có đoạn phẳng nào đáng quan tâm. Bạn tăng tải liên tục cho tới khi hệ thống gãy, và **thời điểm gãy chính là câu trả lời**. Tốc độ tăng phải đều để trục thời gian ánh xạ tuyến tính sang trục tải: giây 262 → 1800 luồng. Ramp mà không đều thì không đọc ngược ra được con số nào.

**Spike — ramp cố tình cực dốc.** 400 luồng trong 5 giây = 80 luồng/giây, gấp **12 lần** tốc độ của Stress và **100 lần** của Load. Ở Load thì tốc độ này là lỗi thiết kế; ở Spike nó là bản chất của flash-sale. Cùng một tham số, ý nghĩa ngược nhau hoàn toàn.

## Câu nói ngắn khi lên video

> "Ramp-up ở ba kịch bản khác nhau vì vai trò của nó khác nhau. Ở Load, ramp chỉ để khởi động êm, phần em đo là đoạn tải giữ đều phía sau. Ở Stress, ramp chính là phép đo — tăng đều để đọc ra điểm gãy. Còn ở Spike, ramp cố tình dốc đứng, tám mươi luồng mỗi giây, vì đó chính là thứ cần mô phỏng."

Nói được đoạn này là trả lời trọn ý *"realistic parameters (think-time, ramp-up, thread counts)"* mà đề mục 6:88 đòi — và nó cũng là câu hỏi vấn đáp gần như chắc chắn sẽ bị hỏi.
```

---

## Lượt 67 — 17/08/2026 17:07:57

**Prompt (nguyên văn):**

```text
oke ở stress tôi nói gì, tôi hiểu chỗ vì sao ghép tress, rồi sao nữa
```

**Output AI:**

```text
Đây là trình tự nói ở Phần 3, theo đúng thứ tự thời gian. Hai chỗ đầu nói **trước khi** gõ lệnh jmeter, phần còn lại nói trong lúc nó chạy 150 giây.

## Trước khi gõ jmeter — gõ lệnh reset trước

```bash
node ../scripts/reset-lockout.js
```

**① Quy trình reset** *(mục 6:93 chấm riêng ô này)*

> "Trước khi chạy em phải mở khoá tài khoản từ lượt trước, bằng lệnh `reset-lockout.js`. Script này mở thẳng file `database.sqlite` và chỉ đặt lại hai cột `login_attempts` và `locked_until`, giữ nguyên toàn bộ dữ liệu khác.
>
> Em xin lưu ý: **tuyệt đối không được dùng** `node backend/database.js` như tài liệu của hệ thống hướng dẫn. File đó gọi hàm khởi tạo ngay khi được import, mà hàm này mở đầu bằng sáu lệnh `DROP TABLE` — chỉ cần chạy nó là mất sạch hai trăm mười tài khoản và một trăm bốn mươi bảy sản phẩm em đã tạo. Trong quá trình làm bài em đã dính bẫy này hai lần, đã log thành Issue số 4."

## Gõ lệnh chạy

```bash
jmeter -n -t 23127262_Stress_20260813.jmx -Jthreads=400 -Jrampup=60 -Jduration=90 -l /tmp/demo-stress.jtl
```

**② Dữ liệu riêng** *(mục 6:89 — mỗi nhóm endpoint một CSV riêng)*

> "Kịch bản này nạp `data/credentials.csv`, file riêng của nhóm auth, không dùng chung với hai kịch bản kia. Hai tài khoản seed sẵn của hệ thống không đủ để bắn tải, nên em đã sinh thêm hai trăm tài khoản hợp lệ qua `POST /api/register`, cộng mười tài khoản riêng để thăm dò khoá."

**③ Phát hiện: khoá sau 2 lần, không phải 3**

> "Đề bài ghi hệ thống khoá sau ba lần đăng nhập sai. Hệ thống thật khoá sau **hai** lần. Nguyên nhân ở dòng năm mươi tư của `server.js`: bộ đếm cộng **hai** đơn vị mỗi lần sai, trong khi ngưỡng khoá là ba — nên nó đi từ không lên hai lên bốn, không bao giờ bằng đúng ba, và vượt ngưỡng sớm hơn một nhịp.
>
> Em kiểm chứng bằng mười tài khoản thăm dò riêng: mỗi tài khoản nhận đúng hai lần 401 rồi từ request thứ ba trở đi là 403, lặp lại mười lần không có ngoại lệ. Đây là sai lệch giữa đặc tả và hiện thực, em đã log thành Issue."

**④ Vì sao phải tách hai nhánh**

> "Vì phát hiện đó, plan tách hai nhánh riêng bằng If Controller: nhánh tài khoản hợp lệ và nhánh thăm dò khoá. Lý do là phản hồi 403 trả về rất nhanh — hệ thống kiểm trạng thái khoá ở dòng bốn mươi, **trước cả** bước so mật khẩu ở dòng bốn mươi sáu, nên nó return ngay mà không làm gì cả. Trộn chung hai nhánh thì hàng loạt 403 siêu nhanh sẽ kéo throughput trung bình đẹp lên một cách giả tạo, số đo mất ý nghĩa."

**⑤ Tham số**

> "Think-time ở kịch bản này em rút xuống trung bình bốn trăm mili

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 68 — 17/08/2026 17:10:09

**Prompt (nguyên văn):**

```text
400 luồng là sao, là cái script stress nó thật sự làm gì hệ thống này vậy
```

**Công cụ AI đã gọi:** 2 lần — `Bash`

**Output AI:**

```text
**400 luồng = 400 người dùng ảo chạy độc lập song song.** Mỗi luồng là một thread Java thật trong JMeter, có bộ đếm riêng, dòng CSV riêng, không chờ nhau.

## Mỗi luồng làm gì

Loop Controller đặt `loops = -1` (vô hạn), scheduler đặt `duration = 90` giây. Nên mỗi luồng cứ lặp mãi vòng này cho tới khi hết 90 giây:

```
đọc 1 dòng từ credentials.csv
   ↓
If Controller chọn nhánh theo cột `label`:
   ├─ "valid"          → POST /api/login với mật khẩu ĐÚNG   → kiểm 200 + có token
   └─ "lockout-probe"  → POST /api/login với mật khẩu SAI    → kiểm 401 hoặc 403
   ↓
ngủ 300–500ms (think-time)
   ↓
quay lại đầu vòng
```

## Ra bao nhiêu request?

Mỗi vòng lặp tốn ≈ 1ms xử lý + 400ms nghỉ ≈ 0,4 giây → mỗi luồng đẩy **2,5 request/giây**.

```
400 luồng × 2,5 = 1000 login/giây
```

Tôi đã đo thật lượt demo này, JMeter báo:

```
summary + 29769 in 00:00:30 = 992.3/s ... Active: 400
```

**992 req/s** — khớp gần như tuyệt đối với phép tính. Đây là ý nghĩa thật của "400 luồng": ép backend xử lý **gần một nghìn lượt đăng nhập mỗi giây**.

## Server phải làm gì cho từng lượt đó

Mỗi request chạy qua [server.js:32–65](sut/backend/server.js#L32):

1. `SELECT * FROM users WHERE email = ?` — truy vấn SQLite
2. Kiểm `locked_until` xem tài khoản có đang bị khoá
3. So mật khẩu — **dạng plaintext, không bcrypt**
4. Nếu đúng: `UPDATE login_attempts = 0` + `jwt.sign()` ký token HMAC
5. Trả JSON

Nhân lên 1000 lần mỗi giây, **tất cả trên một nhân CPU duy nhất** vì Node đơn luồng. Đó chính xác là thứ bạn thấy trên htop: CPU leo tới 85% trong khi 15 nhân còn lại ngồi chơi.

## Chỗ dễ hiểu nhầm: 400 luồng ≠ 400 request cùng lúc

Mỗi luồng chỉ gửi một request rồi **nghỉ 400ms**. Mỗi request lại chỉ mất ~1ms. Nên tại một khoảnh khắc bất kỳ, số request thật sự đang bay chỉ khoảng:

```
400 × (1ms ÷ 400ms) ≈ 1 request
```

Nghĩa là backend gần như không bao giờ phải giữ nhiều kết nối cùng lúc — nó xử lý xong quá nhanh. Đây là lý do 400 luồng cho `Err: 0%`: áp lực nằm ở **tần suất** (1000 lượt/giây), không nằm ở **đồng thời**.

Hệ thống chỉ gãy khi tần suất vượt quá khả năng của một nhân. Lượt chính thức 2000 luồng:

```
770 065 request  ·  2029 req/s trung bình  ·  1,29% lỗi  ·  p95 = 237ms
```

Ở mức đó thời gian xử lý mỗi request kéo dài ra (trung bình 199ms thay vì 1ms), nên request bắt đầu **chồng lên nhau** — hàng đợi kết nối socket tràn, và Connect Time nhảy từ 1ms lên 1020ms. Đó mới là lúc "đồng thời" trở thành vấn đề thật.
```

---

## Lượt 69 — 17/08/2026 17:11:37

**Prompt (nguyên văn):**

```text
là cái người ảo nào vô rồi là họ sẽ ở đó luôn, hệ quả là hệ thống ngày càng nhiều người đúng không
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Đúng chính xác. Luồng nào đã vào là **ở lại tới hết bài test**, không rời đi. Nên số người dùng đồng thời chỉ có tăng, không giảm.

Cơ chế nằm ở hai thuộc tính của Thread Group:

```xml
<stringProp name="LoopController.loops">-1</stringProp>      ← lặp vô hạn
<boolProp name="ThreadGroup.scheduler">true</boolProp>
<stringProp name="ThreadGroup.duration">90</stringProp>       ← tất cả dừng cùng lúc ở giây 90
```

`loops = -1` nghĩa là luồng không tự kết thúc sau N vòng. Nó chỉ dừng khi đồng hồ chung điểm giây 90 — và lúc đó **toàn bộ 400 luồng dừng cùng một khoảnh khắc**.

## Hình dạng thật của lượt Stress demo

Đây là số `Active` do chính JMeter in ra ở lượt tôi chạy thử:

```
số người
đồng thời
   400 ┤                    ┌────────┐
       │              ┌─────┘        │
   200 ┤        ┌─────┘              │
       │  ┌─────┘                    │
     0 ┼──┴─────────────────────────┴──────
       0        30
```

---

## Lượt 70 — 18/08/2026 08:22:43

**Prompt (nguyên văn):**

```text
Continue from where you left off.
```

**Output AI:**

```text
No response requested.
```

---

## Lượt 71 — 18/08/2026 08:22:59

**Prompt (nguyên văn):**

```text
cho tôi command ở các bước trong video nhé
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Đã thêm vào [VIDEO-CHEATSHEET.md](VIDEO-CHEATSHEET.md), commit `1130160`. Toàn bộ lệnh theo thứ tự:

## Chuẩn bị — chưa bật OBS

Pane TRÁI:
```bash
htop -d 10
```
rồi `F4` → gõ `node server.js` → `Enter` → `Shift+H`

Pane PHẢI:
```bash
cd ~/projects/hw05
./scripts/reset-db.sh
source env.sh
clear
```

## Phần 1 — mở đầu (~50s)

```bash
whoami && hostname
ls plans/ data/
```

## Phần 2 — Load (~2:10)

```bash
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 -l /tmp/demo-load.jtl
```

## Phần 3 — Stress (~2:40)

```bash
node ../scripts/reset-lockout.js
jmeter -n -t 23127262_Stress_20260813.jmx -Jthreads=400 -Jrampup=60 -Jduration=90 -l /tmp/demo-stress.jtl
```

## Phần 4 — Spike (~2:15)

```bash
cd .. && ./scripts/reset-db.sh && cd plans
jmeter -n -t 23127262_Spike_20260813.jmx -Jbase=20 -Jbaseduration=120 -Jspike=300 -Jspikeduration=30 -Jspikedelay=30 -l /tmp/demo-spike.jtl
```

Nên **cắt clip ngay trước lệnh này** — `reset-db.sh` mất khá lâu để seed 200 tài khoản, quay vào là dead air. Chạy khi không ghi, rồi mở clip mới bằng cách cuộn lên cho thấy `Don hang: 0`.

## Phần 5 — ngưỡng chịu đựng (~1:30, chạy tức thì)

```bash
cd ..
python3 scripts/jtl-stats.py steady results/raw/soak-20260813T010601Z.jtl 60
python3 scripts/jtl-stats.py summary results/raw/stress-20260813T003655Z.jtl
```

## Ba lưu ý xuyên suốt

- Terminal mới mở phải `source env.sh` lại từ `~/projects/hw05`, nếu không báo `jmeter: command not found`
- Sau `reset-db.sh` thì PID backend đổi — bộ lọc `F4` của htop tự bắt tiến trình mới, không phải làm lại
- Lượt demo ghi ra `/tmp/` và **không có `-e -o`**, nên không đụng gì tới bộ bằng chứng đã nộp trong [results/](results/)

Tổng thời gian chạy lệnh khoảng 7 phút, cộng phần nói ở Phần 1 và 5 là vượt mức tối thiểu 6 phút.
```

---

## Lượt 72 — 18/08/2026 08:36:18

**Prompt (nguyên văn):**

```text
ủa stress là test bơm càng ngày càng nhiều user hả
```

**Output AI:**

```text
Đúng. Stress = **bơm người dùng vào liên tục cho tới khi hệ thống gãy**, và người đã vào thì ở lại luôn.

Cơ chế nằm ở hai dòng trong plan:

```xml
<stringProp name="LoopController.loops">-1</stringProp>   ← luồng lặp vô hạn, không tự thoát
<stringProp name="ThreadGroup.duration">90</stringProp>    ← tất cả cùng dừng ở giây 90
```

Nên số
```

---

## Lượt 73 — 18/08/2026 08:47:41

**Prompt (nguyên văn):**

```text
phần @.claude/skills/perf-test-endpoint/SKILL.md   Failed to parse frontmatter
Nested mappings are not allowed in compact mappings at line 2, column 14:

description: Thiết kế, chạy và phân tích một kịch bản kiểm thử hiệu năng JMeter…
             ^


làm tiếng anh giúp tôi
```

**Công cụ AI đã gọi:** 3 lần — `Bash`

**Output AI:**

```text
Skill đã load được — nó vừa xuất hiện trong danh sách skill khả dụng. Commit `eaa6108`.

## Nguyên nhân không phải tiếng Việt

Lỗi nằm ở dấu hai chấm trong chính phần mô tả:

```yaml
description: ... Bao trọn quy trình: khảo sát endpoint → sinh dữ liệu → ...
                                   ↑ chỗ này
```

YAML thấy `: ` (hai chấm + khoảng trắng) giữa một scalar không có dấu nháy thì hiểu là bạn đang mở một mapping lồng nhau — nên báo *"Nested mappings are not allowed in compact mappings"*. Viết bằng tiếng Anh mà vẫn để dấu hai chấm không nháy thì vẫn lỗi y hệt.

Cách sửa: **bọc toàn bộ description trong dấu nháy kép**. Tôi đã kiểm lại bằng `yaml.safe_load`, parse sạch, ra đúng 2 key `name` và `description`.

## Đã dịch toàn bộ SKILL.md sang tiếng Anh

Giữ nguyên cấu trúc 7 bước, 5 bất biến, 3 bẫy, 2 lỗi đo lường và checklist cuối. Có **một chỗ tôi sửa nội dung** chứ không chỉ dịch:

| Trước | Sau |
|---|---|
| *Ramp 1/giây biến trục thời gian thành trục tải — giây thứ N có đúng N người dùng* | *Constant rate; ramp-up seconds = thread count gives exactly 1 user/second… a constant ramp rate turns the time axis into a load axis* |

Vì như đã phát hiện hôm nay, lượt Stress chính thức chạy ở 6,7 luồng/giây chứ không phải 1 — điều đúng về mặt kỹ thuật là **tốc độ không đổi**, còn 1 luồng/giây chỉ là trường hợp đặc biệt khi đặt ramp-up bằng số luồng. Skill giờ nói đúng cả hai.

## Còn lại

Hai file tham chiếu vẫn đang tiếng Việt, tổng 413 dòng:

- [references/jmx-template.md](.claude/skills/perf-test-endpoint/references/jmx-template.md) — 258 dòng
- [references/analysis-playbook.md](.claude/skills/perf-test-endpoint/references/analysis-playbook.md) — 155 dòng

Chúng không gây lỗi parse (không có frontmatter), nhưng để lẫn hai ngôn ngữ trong cùng một skill thì hơi kỳ, nhất là khi bạn quay video demo skill (mục 7:113). Muốn tôi dịch nốt không?
```

---

## Lượt 74 — 18/08/2026 08:50:20

**Prompt (nguyên văn):**

```text
ở trong submission nữa nhé
```

**Công cụ AI đã gọi:** 2 lần — `Bash`

**Output AI:**

```text
Đã đồng bộ, commit `9f123c2`. Bản trong [submission/skills/perf-test-endpoint/SKILL.md](submission/skills/perf-test-endpoint/SKILL.md) giờ giống hệt bản gốc.

Thực ra bản submission là **bản sao tự sinh** — [scripts/assemble-submission.sh:43](scripts/assemble-submission.sh#L43) làm việc này:

```bash
rm -rf "$S/skills"
mkdir -p "$S/skills"
cp -r .claude/skills/* "$S/skills/"
```

Nên lần tới chỉ cần sửa bản trong `.claude/skills/` rồi chạy `./scripts/assemble-submission.sh` là nó tự đồng bộ lại toàn bộ. Tôi copy tay lần này để repo sạch ngay, khỏi phải chạy lại cả script đóng gói.

Hai file `references/` thì đang giống nhau ở cả hai nơi (vẫn tiếng Việt) — nếu dịch nốt thì tôi sẽ sửa bản gốc rồi copy sang submission cùng lúc. Nói một tiếng.
```

---

## Lượt 75 — 18/08/2026 08:54:59

**Prompt (nguyên văn):**

```text
set up cho tôi một thư mục cùng cấp với project natf chỉ có eshop và cái skill để tôi vào quay video demo
```

**Công cụ AI đã gọi:** 8 lần — `Bash`

**Output AI:**

```text
Phát hiện một vấn đề khi kiểm tra bản sao: **file skill trên đĩa đã quay về bản tiếng Việt cũ**, và vẫn còn nguyên lỗi YAML.

```
LOI -> ScannerError: mapping values are not allowed here, line 3, column 260
```

Bản tiếng Anh tôi sửa vẫn nằm trong git (commit `eaa6108`) nhưng working tree bị ghi đè — nhiều khả năng editor còn giữ buffer cũ rồi lưu đè lên. Nên bản tôi vừa copy sang thư mục demo cũng là bản hỏng.

Khôi phục và đồng bộ lại cả ba nơi:

Cả ba bản giờ parse sạch, working tree không còn thay đổi treo.

## Thư mục demo đã dựng: `~/projects/hw05-skill-demo`

Cùng cấp với `hw05`, tổng **23 MB**.

```
hw05-skill-demo/
├── sut/                    # EShop, bản sao độc lập, node_modules đã cài
├── tools/ → ../hw05/tools  # symlink JMeter 5.6.3 + JDK 21 (khỏi nhân đôi 309 MB)
├── env.sh                  # nạp tools/ vào PATH
├── scripts/                # 6 script phụ trợ skill gọi tới
├── .claude/skills/perf-test-endpoint/
├── plans/  data/  results/  evidence/     ← RỖNG
└── README.md
```

Bốn thư mục cuối để **rỗng có chủ đích** — toàn bộ artifact phải do skill sinh ra trong lúc quay, đó chính là thứ mục 7:113 đòi chứng minh. Tôi cũng xoá `database.sqlite` để backend tự tạo DB mới khi khởi động lần đầu.

Đã kiểm: `jmeter` và `java` phân giải được qua symlink từ trong thư mục demo.

## Trước khi quay

```bash
cd ~/projects/hw05-skill-demo
pkill -f '^node server\.js$'
cd sut/backend && node server.js &
cd ~/projects/hw05-skill-demo && source env.sh
```

⚠️ Cổng 3000 hardcode ở [server.js:8](sut/backend/server.js#L8), nên **chỉ một backend chạy được tại một thời điểm**. Hiện backend của `hw05` đang chạy (PID 17212) — lệnh `pkill` ở trên sẽ tắt nó.

## Endpoint nên chọn

Ba nhóm của Task 1 đã dùng rồi. Chọn nhóm khác để video cho thấy skill tổng quát hoá được — README trong thư mục đó gợi ý 3 lựa chọn, đáng chú ý nhất là `GET /api/products/:id` vì nó có sẵn bug thật (id chẵn trả `price` kiểu string, id không tồn tại trả 200 `{}`), nên video sẽ có cao trào chứ không chỉ là chạy cho xong.

Còn hai file `references/` vẫn tiếng Việt trong khi `SKILL.md` đã tiếng Anh — nếu bạn định quay video có mở chúng ra thì nên dịch nốt cho đồng bộ.
```

---

## Lượt 76 — 18/08/2026 08:59:07

**Prompt (nguyên văn):**

```text
thôi xài endpoint nào nhẹ nhàng chạy nhanh gọn cho biết cái skill thôi
```

**Công cụ AI đã gọi:** 2 lần — `Bash`

**Output AI:**

```text
Chốt **`GET /api/products/:id`**. Vừa gọi thật để xác nhận:

```
/api/products/1     → "price":30000000      ← số
/api/products/2     → "price":"28000000"    ← chuỗi, cùng một field
/api/products/9999  → HTTP 200 {}           ← lẽ ra phải 404
```

Lý do nó hợp nhất cho video demo:

| Tiêu chí | `GET /api/products/:id` |
|---|---|
| Cần token? | Không |
| Ghi dữ liệu? | Không — chạy bao nhiêu lượt cũng không bẩn DB |
| Cần reset giữa lượt? | **Không** — bỏ được hẳn `reset-db.sh`, thứ tốn thời gian nhất |
| Có khoá tài khoản? | Không |
| Sinh CSV mất bao lâu? | Vài giây, chỉ 2 cột `id,expect_code` |
| Có gì đáng kể để kết luận? | **Hai bug thật**, phát hiện được ngay trong lượt chạy |

Bug thứ hai đặc biệt hợp với skill: `expect_code` trong CSV ghi `404` cho id không tồn tại, assertion trượt, và skill lôi ra được **đúng chỗ đặc tả sai lệch với hiện thực** — chứ không phải chỉ chạy cho có số.

Đã cập nhật [README.md](../hw05-skill-demo/README.md) trong thư mục demo.

## Quy trình quay

**Trước khi bấm ghi:**

```bash
cd ~/projects/hw05-skill-demo
pkill -f '^node server\.js$'
cd sut/backend && node server.js &
cd ~/projects/hw05-skill-demo && source env.sh
```

**Trong video**, mở Claude Code tại thư mục đó rồi gõ đúng một câu:

> Dùng skill perf-test-endpoint chạy kịch bản Load cho `GET /api/products/:id`, khoảng 60 giây.

Skill sẽ tự đi hết 7 bước: `curl` khảo sát → sinh dữ liệu → sinh CSV → dựng `.jmx` → smoke 15 giây → chạy thật 60 giây kèm `monitor.sh` → phân tích `.jtl` bằng `jtl-stats.py`.

Tổng thời gian máy chạy khoảng 2–3 phút. Phần còn lại là skill làm việc, bạn thuyết minh chồng lên.

## Ba điểm nên nói khi quay

1. **Thư mục rỗng lúc bắt đầu** — mở `ls plans/ data/ results/` cho thấy chưa có gì, để chứng minh mọi artifact đều do skill sinh ra tại chỗ
2. **Bước smoke** — đây là thứ phân biệt skill với một prompt đơn lẻ: nó tự chạy thử 6 luồng trong 15 giây trước khi chạy thật, đúng nguyên tắc "một plan sai cấu hình mà chạy thẳng 10 phút là mất 10 phút"
3. **Lúc assertion trượt ở id không tồn tại** — chốt lại rằng skill không chỉ đo tốc độ mà bắt được sai lệch giữa đặc tả và hiện thực

Nếu muốn chắc chắn hơn, bạn có thể chạy thử một lượt trước khi quay để biết skill mất bao lâu và ra kết quả gì — chạy xong thì `rm -rf plans/* data/* results/raw/* results/html/*` là thư mục lại sạch như cũ.
```

---

# Phiên `7f74d421` — 23 lượt

## Lượt 77 — 17/08/2026 16:13:36

**Prompt (nguyên văn):**

```text
đọc đề @2026.HW05.Performance Testing_En.md yêu cầu tôi quay video demotask 1, trong video tôi sẽ phải làm gì
```

**Công cụ AI đã gọi:** 3 lần — `Bash`, `Read`

**Output AI:**

```text
Đề chỉ ra 3 điều kiện cứng cho video Task 1, còn nội dung thì suy ra từ các mục chấm. Kịch bản đọc nguyên văn đã có sẵn ở [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md) — dưới đây là bản tóm tắt.

## Ba điều kiện bắt buộc (mục 6:95 + 11:150)

| Điều kiện | Ghi chú |
|---|---|
| Tổng **≥ 6 phút** | được cắt thành nhiều clip, mỗi scenario một clip |
| JMeter và resource monitor (htop) **chung một khung hình** | ghi toàn màn hình, không cắt cảnh qua lại — TA kiểm trực tiếp |
| Giọng **tiếng Việt của chính mình** | không dùng TTS |

Upload YouTube **unlisted** (không phải private), rồi dán link vào [submission/README.md](submission/README.md) và bảng biến trong [CLAUDE.md](CLAUDE.md).

## Trong video phải làm gì

**Phần 1 — Mở đầu (~50s).** Giới thiệu tên + MSSV. Gõ `whoami && hostname` cho thấy `qt-ThinkBook-14-G5-IRH` — mục 11:151 bắt hostname khớp HW04, đây là chỗ TA đối chiếu chéo. Gõ `ls plans/ data/` để chứng minh có 3 plan đúng tên và 3 CSV riêng biệt.

**Phần 2-4 — Chạy thật từng scenario (Load → Stress → Spike).** Mỗi scenario cần nói được 4 thứ:
- Vì sao ghép scenario này với nhóm endpoint này (mục 6:88 bắt giải thích)
- Lý do của từng tham số: think-time, ramp-up, thread count (R8 — không được nói "AI đề xuất")
- Chỉ tay sang htop lúc tải đang chạy, đọc CPU/RES
- Phát hiện đáng chú ý của scenario đó (SQL injection ở `O'Neill`, khoá sau 2 lần chứ không phải 3, memory không nhả sau spike)

Riêng Stress: **phải quay đoạn reset lockout** (`node ../scripts/reset-lockout.js`) và nói rõ vì sao không được dùng `node backend/database.js` — mục 6:93 chấm riêng quy trình reset.

**Phần 5 — Ngưỡng chịu đựng (~1.5 phút).** Mục 6:94 đòi kết luận bằng số cụ thể: 997 req/s ổn định, trần bộ nhớ 161 MB. Nên chốt bằng phát hiện p95 dashboard 1671ms vs log thô 237ms.

## Bốn thứ tuyệt đối không cắt

Nếu muốn rút xuống ~7 phút, file kịch bản đã đánh dấu sẵn 4 đoạn bổ trợ có thể bỏ. Nhưng phải giữ: đoạn `hostname`, đoạn reset lockout, lý do ghép scenario↔endpoint, và con số ngưỡng chịu đựng — mỗi thứ là một mục đề chấm riêng.
```

---

## Lượt 78 — 17/08/2026 16:15:05

**Prompt (nguyên văn):**

```text
phần này tôi thực hiện như nào 
Phần 2-4 — Chạy thật từng scenario (Load → Stress → Spike). Mỗi scenario cần nói được 4 thứ:

Vì sao ghép scenario này với nhóm endpoint này (mục 6:88 bắt giải thích)
Lý do của từng tham số: think-time, ramp-up, thread count (R8 — không được nói "AI đề xuất")
Chỉ tay sang htop lúc tải đang chạy, đọc CPU/RES
Phát hiện đáng chú ý của scenario đó (SQL injection ở O'Neill, khoá sau 2 lần chứ không phải 3, memory không nhả sau spike)
Riêng Stress: phải quay đoạn reset lockout (node ../scripts/reset-lockout.js) và nói rõ vì sao không được dùng node backend/database.js — mục 6:93 chấm riêng quy trình reset.

Phần 5 — Ngưỡng chịu đựng (~1.5 phút). Mục 6:94 đòi kết luận bằng số cụ thể: 997 req/s ổn định, trần bộ nhớ 161 MB. Nên chốt bằng phát hiện p95 dashboard 1671ms vs log thô 237ms.
```

**Công cụ AI đã gọi:** 5 lần — `Bash`

**Output AI:**

```text
Backend đang **không chạy** — nên bước chuẩn bị bắt buộc. Dưới đây là phần cơ học: gõ gì, lúc nào, và nói gì trong lúc chờ.

## Dựng khung hình (làm 1 lần, trước khi bấm ghi)

```bash
cd ~/projects/hw05
./scripts/reset-db.sh          # vừa khởi động backend vừa seed 147 sp + 210 tk
```

Mở 2 terminal cạnh nhau, **trái = htop, phải = gõ lệnh**:

```bash
# Cửa sổ TRÁI
htop -F 'node server.js'
```

Dùng `-F` chứ **đừng** dùng `-p $(pgrep -x node)` như kịch bản đang ghi. Lý do: ở Phần 4 bạn sẽ chạy `reset-db.sh`, nó `pkill` rồi khởi động lại backend → PID đổi → pane htop ghim theo PID sẽ trắng trơn đúng lúc cần quay. `-F` lọc theo tên lệnh nên tự bắt lại tiến trình mới. Tôi đã kiểm: htop trên máy này là 3.4.1, có hỗ trợ `-F`.

Rồi mới bật OBS ghi **toàn màn hình** (không phải window capture), bật mic, bấm ghi.

## Nhịp mỗi scenario: gõ 1 lệnh rồi nói suốt lúc nó chạy

Đây là chỗ dễ lúng túng nhất. JMeter non-GUI in một dòng `summary +` mỗi 30 giây — bạn **không đứng im chờ**, mà nói hết 4 ý trong khoảng trống đó. Thời lượng thật của từng lệnh demo:

| Scenario | Lệnh (đã rút ngắn cho demo) | Chạy khoảng | Nói gì trong lúc chờ |
|---|---|---|---|
| Load | `jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 -l /tmp/demo-load.jtl` | ~2:10 | ý ①② ngay khi vừa gõ Enter → ③ khi htop bắt đầu nhích → ④ khi thấy dòng `Err:` |
| Stress | `node ../scripts/reset-lockout.js` rồi `jmeter ... -Jthreads=400 -Jrampup=60 -Jduration=150 ...` | ~2:40 | nói về reset **trước** khi gõ jmeter → rồi ①② → ③④ |
| Spike | `cd .. && ./scripts/reset-db.sh && cd plans` rồi `jmeter ... -Jbase=20 -Jbaseduration=120 -Jspike=300 -Jspikeduration=30 -Jspikedelay=30 ...` | ~2:15 | ①② lúc setUp đang login 50 tài khoản → ③④ đúng giây thứ 30 khi vọt |

Tôi đã đối chiếu: cả 9 tham số `-J` trên đều tồn tại thật trong 3 file `.jmx` (`__P(threads,…)`, `__P(spikedelay,…)`, …), không có tham số nào bị bỏ qua thầm lặng.

**Thứ tự nói cố định cho cả ba** — học thuộc 4 ô này thay vì học thuộc cả bài:

1. **Ghép** — "Em ghép *[scenario]* với nhóm *[group]* vì…" (1 câu, lý do đã có sẵn ở [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md))
2. **Tham số** — mỗi số một câu *vì sao*: think-time 800±200ms vì người thật đọc trang rồi mới bấm; ramp-up 1 luồng/giây ở Stress vì nó biến trục thời gian thành trục tải, giây thứ N = N user đồng thời
3. **htop** — xem dưới
4. **Phát hiện** — `O'Neill` / khoá sau 2 lần / RES không nhả

## "Chỉ tay sang htop" — thực tế làm thế nào

Trong screen recording không có ngón tay. C

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 79 — 17/08/2026 16:16:52

**Prompt (nguyên văn):**

```text
là giờ tôi gõ 1 lệnh là htop sẽ có thay đổi gì đó à
```

**Công cụ AI đã gọi:** 12 lần — `Bash`

**Output AI:**

```text
Câu hỏi đúng chỗ. Để tôi đo thật thay vì trả lời chung chung — chạy một lượt ngắn rồi lấy đúng con số htop sẽ hiển thị.

Đo thật rồi. Có thay đổi, nhưng ít hơn bạn tưởng — và mức thay đổi khác nhau hẳn giữa 3 scenario.

## Số đo thật, backend PID 82786, lượt Load 120 luồng

| Thời điểm | Cột RES | Cột CPU% (của 1 nhân) |
|---|---|---|
| Trước khi chạy | 85 MB | 0% |
| Giây 6 (đang ramp-up) | 88 MB | 7% |
| Giây 14 | 98 MB | 17% |
| Giây 20–40 (ổn định) | 114 → 118 MB | 14–18% |
| Sau khi JMeter dừng | 117 MB | 0% |

Vậy trên video bạn sẽ thấy: **cột CPU của dòng `node server.js` nhảy từ `0.0` lên khoảng `14–18`, và cột RES bò từ `85M` lên `118M` rồi chững**. Thanh CPU meter tổng ở đầu htop cũng có một lõi nhích lên. Đủ nhìn thấy, nhưng không phải cảnh CPU đỏ rực.

Lượt đo này ra `103 req/s`, `Err 3.51%` — đúng con số lỗi `O'Neill` bạn sẽ nói trong Phần 2.

## Vì sao Load nhẹ vậy, và điều đó lại là ý hay để nói

Load có think-time 800ms nên 120 luồng chỉ đẩy được ~103 req/s — **nút cổ chai là kịch bản, không phải server**. Đây chính là ý bạn đã định nói ở Phần 5 (45 req/s so với 997 req/s). Nên khi quay Load, đừng cố bán cảnh "máy sắp cháy"; nói thẳng:

> "CPU chỉ khoảng mười lăm phần trăm thôi. Đó là vì kịch bản Load có think-time, nó mô phỏng người dùng thật chứ không cố ép server. Ngưỡng thật của phần cứng em sẽ đo ở phần soak."

Ngược lại **Stress mới là chỗ htop diễn**: 400 luồng, không think-time, Node đơn luồng → cột CPU sẽ vượt `100` (htop tính theo 1 nhân, nên >100% là bình thường). Ở lượt chính thức 2000 luồng bạn đã đo được 132%. Và **Spike là chỗ cột RES diễn**: 75 → 119,7 → chỉ về 94 MB.

Nên phân vai: Load → nói về throughput và lỗi; Stress → chỉ vào cột CPU; Spike → chỉ vào cột RES.

## Hai chỉnh nhỏ để htop lên hình rõ hơn

```bash
htop -d 10 -F 'node server.js'
```

`-d 10` = làm mới mỗi 1 giây (mặc định 1,5s), số nhảy mượt hơn trên video. Trong htop bấm `F6` chọn sort theo `PERCENT_MEM` hoặc để mặc định `PERCENT_CPU` đều được, miễn dòng `node server.js` nằm trên cùng và không bị trôi khỏi khung.

Backend hiện **đang chạy** (PID 82786, DB đã seed 152 sản phẩm + 210 tài khoản) nếu bạn muốn thử ngay.
```

---

## Lượt 80 — 17/08/2026 16:23:16

**Prompt (nguyên văn):**

```text
mục đích của 3 script này là gì
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Ba script xuất hiện trong kịch bản quay — mỗi cái gắn với một mục chấm riêng, không phải tiện ích vặt.

## `scripts/reset-lockout.js` — mở khoá, giữ nguyên dữ liệu

Chạy đúng một câu SQL: `UPDATE users SET login_attempts = 0, locked_until = NULL`, mở file `database.sqlite` trực tiếp bằng driver `sqlite3`.

Dùng khi lượt Stress vừa bắn `POST /api/login` làm khoá hàng loạt tài khoản. Không chạy nó thì lượt sau toàn 403 — mà 403 trả về **rất nhanh** vì backend kiểm trạng thái khoá *trước* bước so mật khẩu, nên throughput trông đẹp một cách giả tạo và số đo mất nghĩa.

Lý do phải viết script riêng thay vì dùng `node backend/database.js` như tài liệu SUT hướng dẫn: file đó gọi `initDatabase()` ngay khi được import, mà hàm này mở đầu bằng 6 lệnh `DROP TABLE` → mất sạch 210 tài khoản và 152 sản phẩm. Đây là đoạn bạn phải nói ra miệng ở Phần 3, vì mục 6:93 chấm riêng *quy trình reset*, không chấm việc "đã reset".

## `scripts/reset-db.sh` — xoá sạch rồi seed lại

Bốn bước: `pkill` backend → khởi động lại → chờ `/api/products` phản hồi → chạy `seed-data.js` → in số sản phẩm và số đơn hàng để xác nhận đã sạch.

Nó lợi dụng chính cái bug `DROP TABLE` ở trên làm cơ chế reset: chỉ cần restart backend là DB tự xoá và seed lại. Hệ quả ngược lại cũng đúng — **mọi lần restart backend đều phải chạy lại seed**, nếu không CSV 200 tài khoản sẽ trỏ vào tài khoản không tồn tại.

Dùng trước Spike vì `POST /api/checkout` không kiểm giỏ hàng, không kiểm tồn kho, insert thẳng vào bảng `orders` — một lượt để lại hàng chục nghìn đơn rác. Nó cũng dọn luôn `userCarts` trong RAM (biến toàn cục không bao giờ được xoá), nên tiến trình mới không mang theo bộ nhớ phình từ lượt trước — điều kiện cần để đo được đúng đường RES ở Phần 4.

Khác biệt so với cái trên: `reset-lockout.js` **giữ** dữ liệu, `reset-db.sh` **xoá** dữ liệu. Đừng dùng lẫn.

## `scripts/jtl-stats.py` — đọc số từ log thô

Tính p50/p90/p95/p99, tỉ lệ lỗi, throughput **trực tiếp từ file `.jtl`**, cố tình không đọc `statistics.json` do JMeter sinh ra. Có 5 lệnh con: `summary`, `errors`, `timeline`, `threads`, `steady`.

Đây là script quan trọng nhất về mặt điểm số. Mục 6:103 bắt mỗi chỗ AI đọc sai phải kèm *"the correct value from your raw .jtl log"* — nghĩa là con số phản bác phải tự tính được, không được lấy lại từ dashboard. Và chính vì tự tính mà bạn phát hiện được dashboard JMeter báo p95 = 1671ms trong khi log thô cho 237ms: dashboard mặc định `statistic_window = 20000` nên chỉ tính trên 20 nghìn mẫu cuối của lượt 770 ngh

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 81 — 17/08/2026 16:24:32

**Prompt (nguyên văn):**

```text
mấy cái lệnh mà chạy load stress spike đồ á
```

**Công cụ AI đã gọi:** 5 lần — `Bash`

**Output AI:**

```text
Chia làm hai loại: **lệnh chạy chính thức** (đã chạy xong, sinh ra `.jtl` trong [results/raw/](results/raw/)) và **lệnh chạy khi quay video** (rút ngắn, ghi ra `/tmp`). Cấu trúc giống nhau, chỉ khác tham số.

## Bộ khung chung

```bash
source env.sh                      # nạp Java + JMeter portable trong tools/ vào PATH
cd plans
jmeter -n -t 23127262_Load_20260811.jmx \
       -l ../results/raw/load-<ISO>.jtl \
       -e -o ../results/html/load-<ISO>/
```

| Cờ | Nghĩa |
|---|---|
| `-n` | non-GUI, chạy trong terminal — đề mục 8:119 yêu cầu |
| `-t` | file test plan `.jmx` đầu vào |
| `-l` | ghi **log thô** ra `.jtl`, mỗi request một dòng CSV — đây là thứ mục 11:149 bắt nộp nguyên vẹn |
| `-e -o` | sau khi chạy xong, sinh thư mục HTML dashboard. Thư mục `-o` **phải chưa tồn tại**, nên không lượt nào ghi đè lượt nào |
| `-J<tên>=<giá trị>` | ghi đè một tham số của plan từ dòng lệnh, không phải sửa file `.jmx` |

`source env.sh` bắt buộc vì JMeter và JDK nằm trong [tools/](tools/) chứ không cài hệ thống (máy không có sudo). Quên bước này thì báo `jmeter: command not found`.

## Tham số `-J` của từng plan

Mỗi `.jmx` khai `__P(tên, giá-trị-mặc-định)` nên chạy trần cũng được, `-J` chỉ để đổi mức tải mà không đụng vào file plan:

| Plan | Tham số | Mặc định | Nghĩa |
|---|---|---|---|
| Load | `threads` / `rampup` / `duration` | 50 / 60 / 300 | số luồng, thời gian tăng dần, thời gian giữ tải (giây) |
| Stress | `threads` / `rampup` / `duration` | 250 / 250 / 330 | ramp-up = threads nên đúng 1 luồng/giây → giây thứ N = N user đồng thời |
| Spike | `base` / `baseduration` | 20 / 300 | nhóm nền chạy suốt |
| Spike | `spike` / `spikeduration` / `spikedelay` | 400 / 45 / 120 | nhóm vọt: 400 luồng, giữ 45s, khởi động ở giây thứ 120 |

Cả ba plan còn có `host` / `port` (mặc định `localhost:3000`) và `listenerfile`.

## Lượt chính thức đã chạy bằng gì

Tôi đọc cột `allThreads` trong chính các file `.jtl` để xác nhận, thay vì tin ghi chép:

| Lượt | Luồng thật trong log | Lệnh |
|---|---|---|
| Load chính thức | 50 | chạy trần, đúng mặc định của plan |
| Spike chính thức | 420 (= nền 20 + vọt 400) | chạy trần, đúng mặc định |
| Stress chính thức | **2000** | phải có `-Jthreads=2000 -Jrampup=2000` |
| Soak 11 phút | **1000** | plan Load + `-Jthreads=1000 -Jduration=660` |

Stress có 4 file `.jtl` vì mức 250 và 800 luồng **không làm gãy được SUT** — phải leo thang từng nấc mới tới điểm gãy 1800–2000. Giữ cả 4 lượt là bằng chứng bạn đi tìm ngưỡng chứ không chọn sẵn số đẹp;

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 82 — 17/08/2026 16:25:48

**Prompt (nguyên văn):**

```text
ta có cần chạy trước eshop không, cái phần chính của video là demo cái gì
```

**Output AI:**

```text
## Có, bắt buộc phải chạy EShop trước

JMeter bắn thẳng vào `localhost:3000`. Backend không chạy thì mọi request trả `Connection refused`, `.jtl` toàn lỗi, và video thành bằng chứng ngược.

Chuẩn bị **trước khi bấm ghi**:

```bash
cd ~/projects/hw05
./scripts/reset-db.sh                       # khởi động backend + seed lại dữ liệu nền
curl -s localhost:3000/api/products | head -c 100    # xác nhận có JSON trả về
```

Nhớ: `reset-db.sh` khởi động lại backend, mà **mỗi lần restart là DB tự bị `DROP TABLE` rồi seed lại từ đầu**. Nên không bao giờ được restart backend mà quên chạy `seed-data.js` — script này đã gộp sẵn cả hai bước, dùng nó là an toàn.

Backend hiện đang chạy sẵn (PID 82786, 152 sản phẩm + 210 tài khoản) từ lúc tôi đo htop ở trên.

## Phần chính của video demo cái gì

Nói thẳng cho khỏi lệch hướng: **video không phải để demo web EShop, cũng không phải để demo cách dựng test plan trong JMeter GUI.**

Nó tồn tại để chứng minh đúng ba điều — mục 6:95 và 11:150 chỉ chấm ba điều này:

| Cần chứng minh | Thể hiện bằng |
|---|---|
| Bạn **thật sự chạy** các lượt tải này trên máy của mình | gõ lệnh `jmeter -n -t ...` và để nó chạy hết trên camera, không cắt |
| Công cụ đo và tài nguyên backend **cùng một khung hình** | JMeter phải bên phải, htop bên trái, thấy đồng thời |
| Bạn **hiểu con số mình báo cáo** | thuyết minh: vì sao chọn tham số đó, con số trên màn hình nghĩa là gì |

Điều thứ ba là chỗ tách điểm cao với điểm trung bình. Ai cũng quay được cảnh JMeter chạy; thứ TA tìm là bạn có giải thích được **vì sao** think-time 800ms, **vì sao** ramp-up 1 luồng/giây, **vì sao** tỉ lệ lỗi 3,5% là bug chức năng chứ không phải quá tải.

## Chia thời lượng

| Phần | Thời lượng | Trọng số |
|---|---|---|
| Mở đầu + `hostname` | ~50s | bắt buộc có, không cần dài |
| Load / Stress / Spike chạy thật | ~2 phút mỗi cái | **đây là phần chính**, ~6 trên 8 phút |
| Ngưỡng chịu đựng + phát hiện p95 | ~1,5 phút | phần chốt, ăn mục 6:94 |

Nghĩa là **khoảng ba phần tư video là cảnh JMeter đang chạy trong khi bạn nói**. Không có slide, không có cảnh mở trình duyệt xem giao diện EShop, không có cảnh kéo thả trong JMeter GUI.

## Mẹo: cắt clip đúng chỗ `reset-db.sh`

Đề cho phép chia nhiều clip. Ở Phần 4 bạn phải chạy `reset-db.sh`, nó mất kha khá thời gian để seed 200 tài khoản — dead air không có gì để nói. Cắt clip đúng ở đó: kết thúc clip Stress, chạy `reset-db.sh` khi máy đang không quay, rồi mở clip Spike bằng cách nói *"trước clip này em đã chạy reset-db.sh, và đây 

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 83 — 17/08/2026 16:27:02

**Prompt (nguyên văn):**

```text
oke là chúng ta sẽ test performance của app đó, rồi test bằng cách nào
```

**Công cụ AI đã gọi:** 2 lần — `Bash`

**Output AI:**

```text
Nguyên lý gọn trong một câu: **JMeter giả lập N người dùng ảo, mỗi người là một luồng gửi HTTP request thật vào `localhost:3000`, bấm giờ từng request rồi ghi mỗi request thành một dòng CSV.** Không có mô phỏng, không có ước lượng — request thật, backend thật, số thật.

## Bên trong plan Load thật có gì

Tôi liệt kê đúng các element trong [23127262_Load_20260811.jmx](plans/23127262_Load_20260811.jmx):

| Element | Vai trò |
|---|---|
| **Thread Group** `Nguoi dung duyet san pham` | Quyết định *bao nhiêu người, tới nhanh cỡ nào, chạy bao lâu* → `threads` / `rampup` / `duration` |
| **CSV Data Set Config** `data/products.csv` | Mỗi luồng đọc một dòng khác nhau, nên 120 người tìm 120 từ khoá khác nhau chứ không cùng một truy vấn (nếu cùng, SQLite cache lại và số đo thành vô nghĩa) |
| **HTTP Request** ×2 | `GET /api/products` và `GET /api/products?search=${tukhoa}` — đây là chỗ thật sự gọi API |
| **Assertion** ×6 | Kiểm response **đúng**, không chỉ **nhanh**: mã 200, `Content-Type` là JSON, phần tử đầu có trường `id`, độ trễ dưới 2000ms, số kết quả khớp kỳ vọng ghi trong CSV |
| **Uniform Random Timer** `800ms ± 200` | Think-time — luồng ngủ giữa hai request để giống người thật đọc trang |
| **Summary Report** | Listener, gom kết quả và ghi ra `.jtl` |

## Vòng đời một luồng ảo

```
lấy 1 dòng từ CSV  →  GET /api/products      →  chạy 4 assertion  →  ghi 1 dòng .jtl
                   →  ngủ 800ms ± 200
                   →  GET /api/products?search=...  →  chạy 3 assertion  →  ghi 1 dòng .jtl
                   →  ngủ 800ms ± 200  →  lặp lại cho tới hết duration
```

120 luồng chạy song song vòng lặp này. Ramp-up 60 giây nghĩa là chúng không vào cùng lúc mà rải đều — luồng thứ 1 vào ở giây 0, luồng thứ 120 vào ở giây 60.

## Mỗi request để lại một dòng như thế này

```
1786415538905,14,GET danh sach san pham,200,OK,...,true,,22283,155,1,1,http://localhost:3000/api/products,13,0,9
```

Đọc ra: mốc thời gian, **elapsed = 14ms**, tên sampler, mã 200, `success=true`, số byte, số luồng đang hoạt động, URL, **Latency 13ms**, **Connect 9ms**. Lượt Load chính thức có ~14 nghìn dòng như vậy; lượt Stress có 770 nghìn dòng.

Toàn bộ p95, throughput, error rate trong báo cáo đều là phép tính trên tập dòng này — đó là ý nghĩa của R11: không có con số nào "từ trên trời", cái nào cũng lôi lại được bằng [jtl-stats.py](scripts/jtl-stats.py).

## Ba scenario khác nhau ở đâu

Cơ chế y hệt nhau. Chỉ khác **hình dạng đường tải** và **endpoint bắn vào**:

| | Load | Stress | Spi

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 84 — 17/08/2026 16:31:05

**Prompt (nguyên văn):**

```text
khi chạy từng scenario thì htop có chuyện gì xảy ra, và xem như thế nào để biết
```

**Công cụ AI đã gọi:** 2 lần — `Bash`

**Output AI:**

```text
Để tôi chạy thật Stress và Spike ở mức demo rồi lấy đúng con số htop sẽ hiện — dự đoán không đáng tin bằng đo.

Đo xong cả ba. Dưới đây là con số thật, không phải dự đoán.

## Ba cột cần nhìn, hai cột bỏ qua

Trong dòng `node server.js` của htop:

| Cột | Ý nghĩa | Dùng để nói gì |
|---|---|---|
| **CPU%** | Tính theo **một nhân**, nên >100% là bình thường và có ý nghĩa | Server đang phải làm việc nặng cỡ nào |
| **RES** | RAM vật lý tiến trình đang thật sự chiếm | Bộ nhớ có phình và có nhả lại không |
| **TIME+** | Tổng thời gian CPU tích luỹ | Nhảy liên tục = tiến trình đang làm việc thật, không treo |
| ~~VIRT~~ | Không gian địa chỉ Node đặt trước (vài GB) | Bỏ qua, nói tới là bị hỏi vặn |
| ~~MEM%~~ | RES chia 30 GB RAM máy | Bỏ qua, luôn ~0.4%, vô nghĩa |

Thêm một thứ ở **đầu màn hình htop**: dãy 16 thanh CPU meter. Khi bắn tải, bạn sẽ thấy **chỉ một hai thanh sáng lên, mười bốn thanh còn lại gần như im**. Đó là hình ảnh trực quan nhất cho kết luận quan trọng nhất của bài — nút thắt nằm ở một nhân, do Node chạy đơn luồng, không phải máy yếu.

## Chuyện gì xảy ra ở từng scenario

**Load — 120 luồng, 40 giây** *(đo thật)*

| Giây | RES | CPU% |
|---|---|---|
| 0 | 85 MB | 0% |
| 14 | 98 MB | 17% |
| 20–40 | 114 → 118 MB | 14–18% |

Đường phẳng và hiền. CPU chỉ 17% vì think-time 800ms bóp tốc độ — **kịch bản là nút cổ chai, không phải server**.

**Stress — 400 luồng, ramp-up 60s** *(đo thật)*

| Giây | RES | CPU% |
|---|---|---|
| 6 | 117 MB | 10% |
| 21 | 122 MB | 38% |
| 41 | 123 MB | 60% |
| 56 | 127 MB | 75% |
| 76–90 | 147 → 148 MB | 83–87% |
| sau khi dừng | 83 MB | 0% |

Đây là scenario htop diễn hay nhất: **CPU leo gần như tuyến tính theo số luồng đang vào**. Bạn chỉ vào cột CPU và nói "mỗi luồng thêm vào là một nấc CPU" — nhìn thấy được ngay trên màn hình.

**Spike — nền 20, vọt 300 ở giây 30** *(đo thật)*

| Giây | RES | CPU% | Diễn biến |
|---|---|---|---|
| 1–29 | 83 → 88 MB | 2–3% | nền, gần như đứng yên |
| 33 | 89 MB | 7% | bắt đầu vọt |
| 37–41 | 98 → 116 MB | 23% | **cú vọt, RES nhảy 27 MB trong 4 giây** |
| 45–61 | 119 MB | 23–25% | giữ đỉnh |
| 65–97 | 118 MB | 2–4% | **CPU về nền nhưng RES vẫn đứng ở 118** |

Ở Spike thì **cột RES mới là ngôi sao**, không phải CPU. Cảnh đáng quay nhất là giây 65: CPU sập về 3% trong khi RES vẫn đứng nguyên. Đó là hình ảnh của "hồi phục về tốc độ nhưng không hồi phục về bộ nhớ".

## Cách xem để "biết" — đọc theo cặp

Một cột đơn lẻ không nói lên gì. Kết luận nằm ở **quan hệ giữa hai thứ**:

| Nhìn thấ

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 85 — 17/08/2026 16:39:27

**Prompt (nguyên văn):**

```text
ý tôi là tôi chạy một scenario tôi không biết nhìn vào đâu của htop để biết xảy ra chuyện gì  trình bày trong video
```

**Công cụ AI đã gọi:** 4 lần — `Bash`

**Output AI:**

```text
Đây là gốc rễ vấn đề — tôi vừa chụp thật màn hình htop của máy bạn và thấy **nó đang hiện 12 dòng `node server.js` giống hệt nhau**. Không biết nhìn đâu là đúng, chứ không phải bạn không biết đọc.

## Sửa trước, 1 phím

Máy bạn đang đặt `hide_userland_threads=0` trong `~/.config/htop/htoprc`, nên htop liệt kê từng thread của Node thành từng dòng riêng — 12 dòng, RES giống nhau, TIME+ khác nhau, rối không đọc được.

**Mở htop, bấm phím `H`.** 12 dòng gộp lại còn **đúng 1 dòng**. Cài đặt này tự lưu, không phải làm lại. Làm việc này trước khi bấm ghi.

## Sau khi bấm H, màn hình còn đúng 3 chỗ cần nhìn

```
 ┌─ ① 16 thanh CPU của toàn máy ────────────────────────────────┐
   0[      0.0%]   4[  0.0%]   8[  0.0%]  12[  0.0%]
   1[     85.0%]   5[  0.0%]   9[  0.0%]  13[  0.0%]   ← chỉ 1 thanh sáng
   2[      0.0%]   6[  0.0%]  10[  0.0%]  14[  0.0%]
   3[      0.0%]   7[  0.0%]  11[  0.0%]  15[  0.0%]
 └──────────────────────────────────────────────────────────────┘
   Mem[|||||||####        10.1G/30.6G]   Tasks: 188, 1428 thr
   Swp[                    0K/8.00G]     Load average: 0.32 0.47 0.57   ← ③

   PID USER  PRI NI  VIRT   RES   SHR S  CPU%  MEM%   TIME+  Command
 82786 qt     20  0 1310M 89540 55944 S   0.0   0.3  0:55.38 node server.js
                          └──┬─┘             └─┬┘
                          ② RES            ② CPU%
```

**① Dãy thanh CPU** — nhìn xem *mấy thanh sáng*. Bắn tải mà chỉ 1–2 thanh sáng, 14 thanh còn lại im → chứng minh Node đơn luồng, đây là kết luận đắt nhất của cả bài.

**② Dòng `node server.js`, hai cột CPU% và RES** — đây là 2 con số bạn đọc ra miệng.

Lưu ý: htop trên máy bạn hiện RES **theo kilobyte thô**. `89540` nghĩa là **87 MB**, không phải 89 nghìn MB. Trên video cứ chia 1024 rồi đọc "tám mươi bảy megabyte".

**③ Load average** — chỉ dùng một lần, ở Stress, để đối chiếu: CPU tiến trình 132% mà load average toàn máy chỉ 12% → máy còn rảnh chán, nghẽn là do phần mềm.

## Mỗi scenario nhìn vào chỗ nào

| Scenario | Nhìn chủ yếu vào | Sẽ thấy gì (đã đo thật) | Câu nói mẫu |
|---|---|---|---|
| **Load** | ② cột CPU% | 0% → 17% rồi đứng phẳng | "CPU chỉ mười bảy phần trăm — nút thắt là think-time trong kịch bản, không phải server" |
| **Stress** | ② cột CPU% + ① dãy thanh | CPU leo đều 10 → 38 → 60 → 85%, mà chỉ 1 thanh sáng | "Mỗi luồng thêm vào là một nấc CPU. Và thầy cô thấy chỉ một nhân duy nhất sáng lên" |
| **Spike** | ② cột RES | Nền 88 MB → vọt lên 119 MB trong 4 giây → CPU rơi về 3% mà RES vẫn đứng ở 118 | 

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 86 — 17/08/2026 16:41:44

**Prompt (nguyên văn):**

```text
oke giờ tôi split ra 2 terminal rồi, làm gì nữa
```

**Output AI:**

```text
Còn 4 bước, khoảng 5 phút.

## Bước 1 — Pane TRÁI: dựng htop

```bash
htop -d 10 -F 'node server.js'
```

Rồi bấm ngay **`H`**. Kiểm: còn đúng **1 dòng** `node server.js` (trước khi bấm là 12 dòng). Nếu vẫn nhiều dòng thì bấm lại `H` lần nữa — nó là phím bật/tắt.

Để yên pane này, từ giờ không đụng vào nữa.

## Bước 2 — Pane PHẢI: nạp môi trường và kiểm SUT

```bash
cd ~/projects/hw05
source env.sh
jmeter --version | head -3          # phải in ra 5.6.3
curl -s localhost:3000/api/products | head -c 80    # phải ra JSON
```

Backend đang chạy sẵn (PID 82786, đã seed 152 sản phẩm + 212 tài khoản) từ lúc tôi đo. Nếu `curl` không ra gì thì chạy `./scripts/reset-db.sh`.

Thêm một lệnh nên chạy trước khi quay, vì lượt Stress tôi vừa thử đã làm khoá 10 tài khoản thăm dò:

```bash
node scripts/reset-lockout.js
```

## Bước 3 — Chỉnh cho lên hình đọc được

| Việc | Vì sao |
|---|---|
| Phóng font terminal lên ~14–16pt (`Ctrl` + `+`) | YouTube nén 1080p, font nhỏ thành nhoè, TA không đọc được cột RES |
| Pane trái hẹp hơn pane phải một chút (~40/60) | htop chỉ cần đủ rộng để thấy hết tới cột `Command`; JMeter in dòng `summary` khá dài |
| Xoá màn hình pane phải (`clear`) | Bắt đầu sạch, không lộ lệnh thử nghiệm cũ |
| Tắt thông báo hệ thống, đóng tab riêng tư | Đang ghi toàn màn hình |

## Bước 4 — Chạy nháp một lượt ngắn, KHÔNG ghi

Đây là bước tôi khuyên đừng bỏ:

```bash
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=40 -l /tmp/thu.jtl
```

40 giây. Trong lúc nó chạy, nhìn sang pane trái và **tự kiểm 3 điều**:

- Dòng `node server.js` có nhích cột CPU% lên khoảng 15–18 không
- Cột RES có bò từ ~87 lên ~118 không
- Cả hai pane có nằm gọn trong khung hình mà **không phải cuộn** không

Nếu ba cái đó đúng, khung hình của bạn đạt yêu cầu mục 11:150. Rồi mới bật OBS, chọn **ghi toàn màn hình** (không phải window capture), bật mic, `clear` pane phải, và bắt đầu từ Phần 1: `whoami && hostname`.

---

Muốn tôi sửa `hide_userland_threads=1` trong htoprc luôn không? Làm vậy thì kể cả bạn lỡ đóng htop và mở lại giữa lúc quay, nó vẫn hiện đúng 1 dòng, không phải nhớ bấm `H`.

Không — pane htop **không cần `cd` gì cả**. htop đọc `/proc`, không quan tâm bạn đang đứng ở thư mục nào. Chỉ **pane phải** mới cần `cd ~/projects/hw05` để gọi `source env.sh` và chạy JMeter.

Nhưng ảnh của bạn đang lộ hai vấn đề cần sửa trước khi quay:

## 1. Vẫn còn 12 dòng — chưa bấm `H`

Click vào pane htop rồi bấm **`H`** (Shift+h). 12 dòng `node server.js` sẽ gộp còn 1 dòn

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 87 — 17/08/2026 16:43:22

**Prompt (nguyên văn):**

```text
giờ end hết đi rồi cho tôi command để tôi tự chạy eshop , giờ có nhiều dòng quá
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Đã kill tiến trình `node server.js` tôi khởi động lúc nãy. Máy giờ không còn backend nào chạy — bạn tự dựng lại từ đầu.

## Pane TRÁI — dựng lại htop cho gọn

Bấm `q` để thoát htop hiện tại, rồi:

```bash
htop -d 10
```

Sau khi nó mở, bấm 2 phím theo thứ tự:

1. **`H`** — gộp 12 dòng thread thành 1 dòng
2. **`F4`** → gõ `node server.js` → **Enter** — chỉ hiện tiến trình backend

Còn đúng 1 dòng thì đạt. Lúc này chưa có backend nên bảng sẽ trống — bình thường, chạy bước dưới xong nó tự hiện ra.

## Pane PHẢI — chạy EShop

```bash
cd ~/projects/hw05
./scripts/reset-db.sh
```

Script này làm trọn gói: dừng backend cũ → khởi động lại → chờ nó lên → seed 147 sản phẩm + 210 tài khoản → in ra số liệu xác nhận. Chờ nó in xong dòng `Da reset xong.`

Rồi nạp JMeter vào PATH:

```bash
source env.sh
jmeter --version | head -3
```

## Kiểm nhanh trước khi quay

```bash
curl -s localhost:3000/api/products | head -c 80
```

Ra JSON là được. Cùng lúc nhìn sang pane trái: phải thấy **1 dòng `node server.js`**, RES khoảng `85000`–`90000` (tức 83–88 MB), CPU% gần 0.

---

Nếu muốn thấy backend chạy trực tiếp trong terminal thay vì chạy nền, dùng terminal thứ ba:

```bash
cd ~/projects/hw05/sut/backend && node server.js
```

Nhưng nhớ: **khởi động server.js là DB tự bị xoá và seed lại từ đầu**, nên chạy kiểu này thì phải chạy tiếp `node ~/projects/hw05/scripts/seed-data.js` ở terminal khác, nếu không CSV sẽ trỏ vào 200 tài khoản không tồn tại. Dùng `reset-db.sh` là đã gộp sẵn cả hai bước.
```

---

## Lượt 88 — 17/08/2026 16:44:21

**Prompt (nguyên văn):**

```text
<ide_opened_file>The user opened the file Untitled-1 in the IDE. This may or may not be related to the current task.</ide_opened_file>
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Máy đã sẵn sàng: [sut/backend/](sut/backend/) đủ file, `node_modules` đã cài, Node v22.22.1, cổng 3000 đang trống. Không có gì chặn.

## Cách 1 — một lệnh, chạy nền (khuyên dùng)

```bash
cd ~/projects/hw05
./scripts/reset-db.sh
```

Chờ tới khi in ra:

```
[4/4] Kiem chung trang thai sach:
  - San pham: 152
  - Don hang: 0
Da reset xong.
```

Terminal được trả lại cho bạn ngay, backend chạy nền.

## Cách 2 — thủ công, thấy log server trực tiếp

Cần **2 terminal**:

Terminal A (để yên, đây là server):
```bash
cd ~/projects/hw05/sut/backend
node server.js
```
Phải in ra `Server is running on http://localhost:3000`.

Terminal B (seed lại dữ liệu — bắt buộc, vì lệnh trên vừa `DROP TABLE` toàn bộ):
```bash
cd ~/projects/hw05
node scripts/seed-data.js
```

## Kiểm

```bash
curl -s localhost:3000/api/products | head -c 80
```

Ra JSON bắt đầu bằng `[{"id":1,...` là xong. Pane htop sẽ hiện dòng `node server.js` với RES khoảng 85000.

---

Nếu vẫn không lên, dán cho tôi **dòng lỗi nó in ra**, hoặc chạy:

```bash
tail -20 ~/projects/hw05/sut/backend/server-run.log
```

Không đoán mò được nếu không biết nó báo gì.
```

---

## Lượt 89 — 17/08/2026 16:45:38

**Prompt (nguyên văn):**

```text
làm sao gộp 10 dòng vô
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Bấm **`Shift` + `H`** khi con trỏ đang ở cửa sổ htop. Một lần bấm là 11 dòng thread biến mất, còn đúng 1 dòng.

Dấu hiệu nhận biết trong ảnh của bạn: 11 dòng chữ **màu xanh lá** là thread, dòng chữ **màu trắng** (PID 82786) mới là tiến trình thật. Bấm `H` là ẩn hết mấy dòng xanh.

## Nếu bấm `H` không ăn

Làm bằng menu, chắc chắn hơn:

1. Bấm **`F2`** (Setup)
2. Chọn cột trái **`Display options`** — dùng phím mũi tên
3. Tìm dòng **`Hide userland process threads`**
4. Bấm **`Space`** để đánh dấu `[x]`
5. Bấm **`F10`** để lưu và thoát

Cách này ghi thẳng vào `~/.config/htop/htoprc` nên giữ vĩnh viễn, mở htop lần sau không phải làm lại.

## Muốn tôi sửa thẳng file cấu hình?

Máy bạn hiện đang đặt `hide_userland_threads=0`. Tôi sửa thành `1` là xong, bạn khỏi mò menu — nhưng phải **thoát htop trước** (bấm `q`), vì htop ghi đè lại file này khi thoát.

Nói một tiếng là tôi sửa.

Backend đã lên: `HTTP 200`, phản hồi 2ms, DB sạch (0 đơn hàng). Pane trái cũng đã lọc đúng — không còn dòng `htop` tự khớp nữa. Còn đúng một việc rồi tới quay.

## Việc còn lại ở pane trái

Click vào cửa sổ htop, bấm **`Shift` + `H`**.

11 dòng xanh biến mất, còn lại **1 dòng trắng: PID 88567, RES 77244, TIME+ 0:00.35**. Đó là backend thật.

Nếu bấm không ăn thì `F2` → `Display options` → `Hide userland process threads` → `Space` → `F10`.

## Chạy nháp 40 giây — chưa bật OBS

Pane phải:

```bash
source env.sh
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=40 -l /tmp/thu.jtl
```

Trong lúc nó chạy, nhìn pane trái kiểm 3 điều:

| Kiểm | Kỳ vọng (tôi đã đo trên chính máy này) |
|---|---|
| Cột **CPU%** dòng node | 0 → khoảng **14–18** |
| Cột **RES** | `77244` bò lên khoảng `115000–120000` |
| Dòng `summary +` bên phải | `Err: ...` khoảng **3,5%** — đúng lỗi `O'Neill` |

Ba cái đúng là khung hình đạt chuẩn mục 11:150.

## Rồi bắt đầu quay

1. `clear` pane phải cho sạch
2. Bật OBS → **ghi toàn màn hình** (không phải window capture) → bật mic
3. Mở [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md) trên điện thoại hoặc màn hình phụ để đọc
4. Bấm ghi, mở đầu bằng:

```bash
whoami && hostname
```

Từ đây cứ bám kịch bản. Lệnh đầu tiên của Phần 2 là:

```bash
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 -l /tmp/demo-load.jtl
```

Lưu ý nhỏ: lượt nháp vừa rồi **không** làm bẩn dữ liệu (Load chỉ đọc), nên không cần reset lại trước khi quay. Chỉ Stress và Spike mới cần reset, và kịch bản đã có sẵn hai lệnh đó đúng chỗ.
```

---

## Lượt 90 — 17/08/2026 16:46:56

**Prompt (nguyên văn):**

```text
~$ source env.sh
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=40 -l /tmp/thu.jtl
bash: env.sh: No such file or directory
bash: cd: plans: No such file or directory
Command 'jmeter' not found, but can be installed with:
sudo apt install jmeter
~$
```

**Output AI:**

```text
Bạn đang đứng ở `~` chứ không phải trong thư mục bài. Dấu nhắc `~$` cho thấy điều đó — pane phải này là cửa sổ mới, chưa `cd` vào project.

```bash
cd ~/projects/hw05
source env.sh
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=40 -l /tmp/thu.jtl
```

Hai điều cần nhớ:

- **`source env.sh` phải chạy từ `~/projects/hw05`** — nó là file nằm trong thư mục đó, và nó nạp JMeter portable trong [tools/](tools/) vào `PATH`
- **Đừng `sudo apt install jmeter`** như gợi ý của shell. Bản apt là 2.x cũ, khác bản 5.6.3 bạn đã dùng cho toàn bộ số liệu trong báo cáo. Máy cũng không có sudo không mật khẩu — đây chính là lý do bài này dùng bản portable.

Kiểm nhanh trước khi chạy:

```bash
jmeter --version | head -3
```

Ra `5.6.3` là đúng. Nếu vẫn báo not found thì `source env.sh` chưa chạy được — dán lại lỗi cho tôi.

Mỗi terminal mới mở đều phải `source env.sh` lại, vì nó chỉ sửa `PATH` của phiên shell hiện tại. Lúc quay video, nhớ chạy nó ở Phần 1 — mà như vậy cũng tiện, vì nó cho thấy bạn dùng JMeter portable trong `tools/` chứ không phải bản cài sẵn.
```

---

## Lượt 91 — 17/08/2026 16:48:24

**Prompt (nguyên văn):**

```text
~$ cd ~/projects/hw05
source env.sh
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=40 -l /tmp/thu.jtl
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
Creating summariser <summary>
Created the tree successfully using 23127262_Load_20260811.jmx
Starting standalone test @ 2026 Aug 17 16:47:08 ICT (1786960028649)
Waiting for possible Shutdown/StopTestNow/HeapDump/ThreadDump message on port 4445
summary +    439 in 00:00:21 =   20.7/s Avg:     1 Min:     0 Max:    21 Err:    15 (3.42%) Active: 43 Started: 43 Finished: 0
summary +   1135 in 00:00:38 =   29.7/s Avg:     1 Min:     0 Max:     4 Err:    38 (3.35%) Active: 0 Started: 120 Finished: 120
summary =   1574 in 00:01:00 =   26.4/s Avg:     1 Min:     0 Max:    21 Err:    53 (3.37%)
Tidying up ...    @ 2026 Aug 17 16:48:08 ICT (1786960088308)
... end of run
~/projects/hw05/plans$
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Chạy thành công. Và lượt nháp này vừa tự chứng minh luôn phần thuyết minh của bạn — tôi phân tích file `/tmp/thu.jtl` vừa sinh ra:

```
Tổng mẫu 1574 · lỗi 53 (3.37%)
  53 (100.0% số lỗi)  HTTP 500
  URL: http://localhost:3000/api/products?search=O%27Neill
```

**100% lỗi đến từ đúng một từ khoá `O'Neill`**, không phải do quá tải. Đúng câu bạn sẽ nói ở Phần 2.

## Một điều chỉnh cho lúc quay

Lượt nháp này `Active` chỉ lên tới **43** rồi tụt về 0, vì `duration=40` mà `rampup` mặc định là 60 — luồng chưa vào hết thì bài test đã hết giờ. Nên CPU trên htop lúc nãy chắc chỉ khoảng 5–8%, thấp hơn mức 14–18% tôi báo trước đó.

Lệnh quay thật dùng `-Jduration=120` nên không dính vấn đề này: ramp 60 giây rồi giữ đủ 120 luồng thêm 60 giây nữa — CPU sẽ lên đúng 14–18% và đứng phẳng, dễ chỉ vào hơn nhiều.

## Sẵn sàng quay

Trạng thái hiện tại: backend chạy PID 88567, DB sạch 0 đơn hàng, JMeter 5.6.3 đã trong PATH, pane trái lọc đúng.

```bash
clear
```

Rồi bật OBS (ghi toàn màn hình + mic), và mở đầu bằng:

```bash
whoami && hostname
```

Kịch bản đọc nguyên văn ở [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md). Nhớ khi sang Phần 2 phải `cd plans` trước, và lệnh là `-Jduration=120` chứ không phải 40 như lúc nháp.

Một điều duy nhất còn thiếu: bạn đã bấm `Shift+H` để gộp 11 dòng thread chưa? Nếu pane trái vẫn còn 11 dòng xanh thì xử lý nốt trước khi bấm ghi — trên video sẽ rất rối mắt khi bạn chỉ vào cột RES.
```

---

## Lượt 92 — 17/08/2026 16:49:01

**Prompt (nguyên văn):**

```text
~/projects/hw05/plans$ jmeter --version | head -3
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
WARN StatusConsoleListener The use of package scanning to locate plugins is deprecated and will be removed in a future release
~/projects/hw05/plans$
```

**Output AI:**

```text
`head -3` cắt mất phần cần xem — 3 dòng đầu là cảnh báo (in ra stderr), còn banner phiên bản nằm sau đó. Bỏ `head` đi, hoặc lọc stderr:

```bash
jmeter --version 2>/dev/null
```

Sẽ ra khối ASCII art kèm dòng `5.6.3`.

Thực ra bạn **không cần kiểm nữa** — lượt nháp vừa rồi chạy được và sinh ra `/tmp/thu.jtl` 1574 mẫu, đó là bằng chứng mạnh hơn nhiều so với `--version`. JMeter đã hoạt động đúng.

## Về mấy dòng WARN đó

Chúng vô hại — chỉ là cảnh báo nội bộ của thư viện log4j trong JMeter 5.6.3, không ảnh hưởng kết quả đo. Nhưng chúng **sẽ xuất hiện trên video** mỗi lần bạn chạy JMeter, nên tốt nhất là chủ động nói một câu ngắn khi nó hiện ra:

> "Mấy dòng cảnh báo này là của thư viện log nội bộ JMeter, không liên quan tới phép đo."

Nói trước một câu thì người xem không thắc mắc, mà cũng cho thấy bạn biết mình đang nhìn gì. Đừng cố giấu hay cắt đi.

Nếu muốn ẩn hẳn cho màn hình sạch:

```bash
jmeter -n -t ... -l ... 2>/dev/null
```

Nhưng tôi khuyên **đừng** dùng khi quay — chuyển hướng stderr cũng nuốt luôn thông báo lỗi thật nếu có sự cố giữa chừng, và người xem sẽ không thấy được lúc nào có vấn đề.

Giờ `clear` rồi bật OBS thôi.
```

---

## Lượt 93 — 17/08/2026 16:49:34

**Prompt (nguyên văn):**

```text
<ide_opened_file>The user opened the file Untitled-2 in the IDE. This may or may not be related to the current task.</ide_opened_file>
```

**Công cụ AI đã gọi:** 3 lần — `Bash`

**Output AI:**

```text
Trước hết một chỗ phải sửa trong lời thoại — tôi vừa kiểm bằng chính file log thô.

## ⚠️ Câu "một luồng mỗi giây" đang sai với lượt chính thức

[VIDEO-SCRIPT.md](VIDEO-SCRIPT.md) Phần 3 viết *"em đặt tăng đúng một luồng mỗi giây… tại giây thứ N thì có đúng N người dùng đồng thời"*. Tôi rút hồ sơ ramp thật từ `stress-20260813T003655Z.jtl`:

```
t=  0s → 12 luồng      t=150s → 1013 luồng
t= 60s → 413 luồng     t=270s → 1862 luồng
t=120s → 813 luồng     t=300s → 2000 luồng (giữ tới hết 380s)
```

Tức **6,7 luồng/giây**, không phải 1. Con số 1 luồng/giây chỉ đúng với lượt dò đầu tiên (250 luồng / 250 giây). Nói nhầm câu này trên camera thì ở buổi vấn đáp bị hỏi "vậy 1800 luồng là giây thứ 1800 à?" là kẹt — điểm gãy thật rơi vào **giây thứ 262**.

Câu thay thế, vẫn giữ được ý hay:

> "Ramp-up tuyến tính với tốc độ không đổi — lượt chính thức là hai nghìn luồng trong ba trăm giây, tức khoảng sáu phẩy bảy luồng mỗi giây. Nhờ tốc độ không đổi mà trục thời gian ánh xạ thẳng sang trục tải, nên em đọc được điểm gãy một nghìn tám trăm luồng rơi đúng vào giây thứ hai trăm sáu mươi hai."

Tiện là mức demo `400 luồng / 60 giây` cũng ra đúng **6,7 luồng/giây** — cùng tốc độ với lượt chính thức, chỉ ngắn hơn. Nói được câu đó là ăn điểm.

---

# Bảng chạy — 3 scenario

## ① LOAD

```bash
cd ~/projects/hw05/plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 -l /tmp/demo-load.jtl
```

**htop sẽ làm gì:** CPU% từ `0` leo dần trong 60 giây ramp lên **14–18%** rồi đứng phẳng. RES bò từ `77000` lên khoảng `118000` (77 → 115 MB). Chỉ 1–2 thanh CPU sáng.

**Nói:**
- Ghép Load với read-heavy vì endpoint chỉ đọc, chi phí thấp và ổn định → giữ tải đều lâu được, là điều kiện cần để sau này đo ngưỡng phần cứng bằng số
- Think-time 800ms ± 200: người thật đọc trang rồi mới bấm. Bỏ think-time thì req/s chỉ phản ánh tốc độ sinh tải của công cụ
- Ramp-up 60 giây, tránh cú sốc lúc khởi động — cú sốc là việc của Spike
- Chỉ vào CPU 17%: **nút thắt là think-time trong kịch bản, không phải server**
- Chỉ vào `Err: 3.4%`: toàn bộ đến từ đúng một từ khoá `O'Neill`, dấu nháy đơn làm vỡ câu SQL vì endpoint nối chuỗi thẳng vào truy vấn. Lỗi chức năng kèm SQL injection, không phải vấn đề hiệu năng. Đã log GitHub Issue #1
- Plan có 5 assertion thuộc 4 loại, trong đó có kiểm `Content-Type` vì khi lỗi hệ thống trả HTML chứ không phải JSON — chỉ kiểm mã 200 là bỏ sót hoàn toàn

## ② STRESS

```bash
node ../scripts/reset-lockout.js
jmeter -n -t 23127262_Stress_20260813.jmx -Jthrea

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 94 — 17/08/2026 16:52:51

**Prompt (nguyên văn):**

```text
xuất câu trả lời của lần gần nhất ra file đi tôi cần hỏi vài thông tin
```

**Công cụ AI đã gọi:** 2 lần — `Write`, `Bash`

**Output AI:**

```text
Đã xuất ra [VIDEO-CHEATSHEET.md](VIDEO-CHEATSHEET.md), commit `769fc9b`.

Nội dung y như câu trả lời vừa rồi, thêm hai thứ:

- **Hồ sơ ramp đầy đủ** của lượt Stress chính thức (12 mốc thời gian → số luồng), để bạn tự đối chiếu con số 6,7 luồng/giây thay vì tin lời tôi
- **Phụ lục trạng thái máy trước khi quay** — 4 lệnh chuẩn bị kèm dấu hiệu đạt, và ghi chú cách đọc RES theo kilobyte thô

Một việc còn treo: **hai file khác vẫn đang mang con số "1 luồng/giây" sai**:

| File | Chỗ sai |
|---|---|
| [VIDEO-SCRIPT.md](VIDEO-SCRIPT.md) Phần 3 | *"Về ramp-up, em đặt tăng đúng một luồng mỗi giây"* |
| [Main-Report.md:259](submission/report/Main-Report.md#L259) | *"Tăng đều 1 luồng/giây… tại giây thứ N có đúng N người dùng đồng thời"* |

File báo cáo chính mới là chỗ đáng lo — nó là tài liệu nộp, và R11 bắt mọi con số phải truy ngược được về `.jtl`. Nói một tiếng là tôi sửa cả hai cho khớp.

Hỏi tiếp đi.
```

---

## Lượt 95 — 17/08/2026 17:00:14

**Prompt (nguyên văn):**

```text
Think-time 800ms ± 200: người thật đọc trang rồi mới bấm. Bỏ think-time thì req/s chỉ phản ánh tốc độ sinh tải của công cụ
Ramp-up 60 giây, tránh cú sốc lúc khởi động — cú sốc là việc của Spike

này là gì
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Hai khái niệm nền của kiểm thử hiệu năng. Giải thích bằng đúng số trong plan của bạn.

## Think-time — quãng nghỉ giữa hai request của một người dùng ảo

Người thật vào trang sản phẩm thì **đọc vài giây rồi mới bấm tiếp**. Think-time là mô phỏng quãng nghỉ đó: sau khi nhận xong response, luồng ảo **ngủ** một lúc rồi mới gửi request kế.

Trong plan Load nó là element `UniformRandomTimer`:

```xml
<UniformRandomTimer testname="Think time 800ms +/- 200ms">
  <stringProp name="ConstantTimer.delay">800</stringProp>
  <stringProp name="RandomTimer.range">400.0</stringProp>
```

Ngẫu nhiên chứ không cố định, vì 120 người cùng nghỉ đúng 800ms sẽ tạo ra sóng đồng bộ — tất cả bắn cùng lúc, nghỉ cùng lúc — không giống người thật chút nào.

**Vì sao bỏ nó thì số đo vô nghĩa.** Không có think-time, mỗi luồng nhận response xong là bắn request tiếp ngay lập tức. Mỗi request chỉ mất ~1ms, nên một luồng đẩy được ~1000 req/s, 120 luồng thành ~120 nghìn req/s. Con số đó không mô tả 120 người dùng — nó mô tả **tốc độ tối đa của JMeter**. Có think-time thì:

```
120 luồng ÷ 1 giây nghỉ  ≈  120 req/s      ← đo được 103 req/s, khớp
```

Đó là lý do CPU chỉ 17%: server rảnh, vì kịch bản cố tình giữ nhịp người dùng.

## ⚠️ Tên element đang ghi sai, đừng đọc nguyên văn lên video

JMeter tính `UniformRandomTimer` theo công thức **delay = 800 + ngẫu nhiên(0 … 400)**, tức khoảng nghỉ thật là **800–1200 ms, trung bình 1000 ms** — không phải "800 ± 200" (nghĩa là 600–1000) như tên element gợi ý.

Câu nên nói: *"think-time trung bình một giây, dao động đều từ tám trăm đến một nghìn hai trăm mili giây"*.

Cả ba plan đều bị cách đặt tên này:

| Plan | Cấu hình | Khoảng thật | Trung bình |
|---|---|---|---|
| Load | 800 + range 400 | 800–1200 ms | **1000 ms** |
| Stress | 300 + range 200 | 300–500 ms | **400 ms** |
| Spike | 1000 + range 600 | 1000–1600 ms | **1300 ms** |

Phần tính toán trong báo cáo chính thì **đã dùng đúng** giá trị trung bình — chỗ giải thích throughput Stress ghi `250 ÷ 0,4s = 622/s`, tức đã lấy 400ms chứ không lấy 300ms. Chỉ có tên element và lời thoại là lỏng.

## Ramp-up — thời gian để thả hết luồng vào cuộc

`-Jrampup=60` với 120 luồng nghĩa là: JMeter **không** thả cả 120 luồng cùng lúc, mà rải đều trong 60 giây — cứ nửa giây thêm một luồng. Giây 0 có 1 người, giây 30 có 60 người, giây 60 mới đủ 120 người.

**Vì sao cần.** Thả 120 luồng cùng lúc tại giây 0 tạo ra ba thứ nhiễu cùng lúc:

1. **JMeter tự nghẽn** — khởi tạo 120 thread Java đồng thời tốn CPU của chính 

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 96 — 17/08/2026 17:05:32

**Prompt (nguyên văn):**

```text
Đề ghi khoá sau 3 lần sai, hệ thống thật khoá sau 2 lần: mã nguồn cộng 2 vào bộ đếm mỗi lần sai trong khi ngưỡng là 3. Kiểm chứng bằng 10 tài khoản thăm dò riêng, mỗi tài khoản nhận đúng 2 lần 401 rồi chuyển 403

giải thích
```

**Công cụ AI đã gọi:** 3 lần — `Bash`

**Output AI:**

```text
Vừa chạy lại thật trên backend đang chạy để bạn có bằng chứng tươi:

```
Lần 1 (mật khẩu SAI):  HTTP 401
Lần 2 (mật khẩu SAI):  HTTP 401
Lần 3 (mật khẩu SAI):  HTTP 403   ← đã khoá
Lần 4 (mật khẩu SAI):  HTTP 403
Lần 5 (mật khẩu ĐÚNG): HTTP 403   ← đúng mật khẩu vẫn bị chặn
```

## Nguyên nhân nằm ở một dòng cộng

[server.js:54](sut/backend/server.js#L54) trong nhánh xử lý sai mật khẩu:

```js
const newAttempts = user.login_attempts + 2;   // ← cộng 2, không phải 1
let lockedUntil = null;
if (newAttempts >= 3) {
  lockedUntil = new Date(Date.now() + 180000).toISOString();  // khoá 180 giây
}
```

Bộ đếm nhảy **2 đơn vị mỗi lần sai**, trong khi ngưỡng khoá là **3**. Diễn biến:

| Lần sai | `login_attempts` trước | Sau khi `+2` | `>= 3`? | Kết quả |
|---|---|---|---|---|
| 1 | 0 | **2** | không | 401, chưa khoá |
| 2 | 2 | **4** | **có** | 401, **nhưng đã ghi `locked_until`** |
| 3 | — | — | — | **403** |

Bộ đếm đi `0 → 2 → 4`, **không bao giờ bằng đúng 3**, nên điều kiện `>= 3` được kích hoạt sớm hơn một nhịp so với thiết kế. Nếu dòng đó là `+ 1` thì sẽ đúng là "khoá sau 3 lần sai" như đề mô tả.

## Vì sao lần thứ 2 vẫn trả 401 chứ không phải 403

Đây là chỗ dễ đọc nhầm. Lần sai thứ 2 **ghi khoá vào DB rồi mới trả về 401** — vì nhánh sai mật khẩu luôn kết thúc bằng `res.status(401)`. Cái khoá chỉ *biểu hiện ra ngoài* ở request kế tiếp, khi hàm chạy tới đoạn kiểm ở [server.js:40](sut/backend/server.js#L40):

```js
if (user.locked_until && new Date() < new Date(user.locked_until)) {
  return res.status(403).json({ error: "Tài khoản đã bị khóa..." });
}
if (user.password === password) {   // ← dòng 46, nằm SAU đoạn kiểm khoá
```

Nên mô tả chính xác là: **hai lần sai là đủ khoá, và từ request thứ ba trở đi trả 403.**

## Hai hệ quả kéo theo, quan trọng cho bài

**1. Đang khoá thì mật khẩu đúng cũng bị chặn.** Đoạn kiểm khoá (dòng 40) nằm **trước** đoạn so mật khẩu (dòng 46) — chính là dòng "Lần 5" trong kết quả trên. Nghĩa là sau mỗi lượt Stress, tài khoản đó chết 180 giây, không đăng nhập được bằng bất kỳ cách nào.

**2. Phản hồi 403 nhanh bất thường.** Nó return ngay ở dòng 40, bỏ qua toàn bộ phần so mật khẩu và tạo JWT. Nếu CSV trộn lẫn tài khoản hợp lệ với tài khoản đã khoá, hàng loạt 403 siêu nhanh sẽ **kéo throughput trung bình đẹp lên một cách giả tạo** — số đo trông tốt trong khi thực chất server chẳng làm gì cả. Đó là lý do plan Stress tách hai nhánh bằng If Controller, và [data/credentials.csv](data/credentials.csv) đánh dấu riêng nhóm `lockout-prob

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 97 — 17/08/2026 17:06:46

**Prompt (nguyên văn):**

```text
ủa ramp up ở load và stress nó khác nhau à
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
Đúng, khác — và khác **có chủ đích**, vì ramp-up đóng vai trò hoàn toàn khác nhau ở ba plan.

| Plan | Nhóm luồng | Số luồng | Ramp | Tốc độ | Ramp để làm gì |
|---|---|---|---|---|---|
| **Load** | 1 nhóm | 50 (mặc định) | 60s | 0,8 luồng/s | Chỉ là **khởi động êm**. Phần đo nằm ở đoạn phẳng *sau* ramp |
| **Stress** | 1 nhóm | 2000 (chính thức) | 300s | 6,7 luồng/s | Ramp **chính là phép đo** |
| **Spike** | nền | 20 | 20s | 1 luồng/s | Dựng đường cơ sở để so sánh |
| **Spike** | vọt | 400 | **5s** | **80 luồng/s** | Cú sốc **là mục đích** |

## Ba triết lý khác nhau

**Load — ramp là thứ bỏ đi.** Bạn muốn biết hệ thống cư xử ra sao khi tải **giữ đều**. Giai đoạn ramp là lúc tải chưa ổn định, số liệu trong đó là nhiễu. Bằng chứng: lệnh phân tích của bạn cắt hẳn nó đi —

```bash
python3 scripts/jtl-stats.py steady results/raw/soak-...jtl 60
```

Số `60` cuối chính là **bỏ 60 giây đầu** rồi mới tính throughput ổn định. Ramp chỉ tồn tại để tránh cú sốc lúc khởi động, xong việc là vứt.

**Stress — ramp là toàn bộ thí nghiệm.** Ở đây không có đoạn phẳng nào đáng quan tâm. Bạn tăng tải liên tục cho tới khi hệ thống gãy, và **thời điểm gãy chính là câu trả lời**. Tốc độ tăng phải đều để trục thời gian ánh xạ tuyến tính sang trục tải: giây 262 → 1800 luồng. Ramp mà không đều thì không đọc ngược ra được con số nào.

**Spike — ramp cố tình cực dốc.** 400 luồng trong 5 giây = 80 luồng/giây, gấp **12 lần** tốc độ của Stress và **100 lần** của Load. Ở Load thì tốc độ này là lỗi thiết kế; ở Spike nó là bản chất của flash-sale. Cùng một tham số, ý nghĩa ngược nhau hoàn toàn.

## Câu nói ngắn khi lên video

> "Ramp-up ở ba kịch bản khác nhau vì vai trò của nó khác nhau. Ở Load, ramp chỉ để khởi động êm, phần em đo là đoạn tải giữ đều phía sau. Ở Stress, ramp chính là phép đo — tăng đều để đọc ra điểm gãy. Còn ở Spike, ramp cố tình dốc đứng, tám mươi luồng mỗi giây, vì đó chính là thứ cần mô phỏng."

Nói được đoạn này là trả lời trọn ý *"realistic parameters (think-time, ramp-up, thread counts)"* mà đề mục 6:88 đòi — và nó cũng là câu hỏi vấn đáp gần như chắc chắn sẽ bị hỏi.
```

---

## Lượt 98 — 17/08/2026 17:07:57

**Prompt (nguyên văn):**

```text
oke ở stress tôi nói gì, tôi hiểu chỗ vì sao ghép tress, rồi sao nữa
```

**Output AI:**

```text
Đây là trình tự nói ở Phần 3, theo đúng thứ tự thời gian. Hai chỗ đầu nói **trước khi** gõ lệnh jmeter, phần còn lại nói trong lúc nó chạy 150 giây.

## Trước khi gõ jmeter — gõ lệnh reset trước

```bash
node ../scripts/reset-lockout.js
```

**① Quy trình reset** *(mục 6:93 chấm riêng ô này)*

> "Trước khi chạy em phải mở khoá tài khoản từ lượt trước, bằng lệnh `reset-lockout.js`. Script này mở thẳng file `database.sqlite` và chỉ đặt lại hai cột `login_attempts` và `locked_until`, giữ nguyên toàn bộ dữ liệu khác.
>
> Em xin lưu ý: **tuyệt đối không được dùng** `node backend/database.js` như tài liệu của hệ thống hướng dẫn. File đó gọi hàm khởi tạo ngay khi được import, mà hàm này mở đầu bằng sáu lệnh `DROP TABLE` — chỉ cần chạy nó là mất sạch hai trăm mười tài khoản và một trăm bốn mươi bảy sản phẩm em đã tạo. Trong quá trình làm bài em đã dính bẫy này hai lần, đã log thành Issue số 4."

## Gõ lệnh chạy

```bash
jmeter -n -t 23127262_Stress_20260813.jmx -Jthreads=400 -Jrampup=60 -Jduration=90 -l /tmp/demo-stress.jtl
```

**② Dữ liệu riêng** *(mục 6:89 — mỗi nhóm endpoint một CSV riêng)*

> "Kịch bản này nạp `data/credentials.csv`, file riêng của nhóm auth, không dùng chung với hai kịch bản kia. Hai tài khoản seed sẵn của hệ thống không đủ để bắn tải, nên em đã sinh thêm hai trăm tài khoản hợp lệ qua `POST /api/register`, cộng mười tài khoản riêng để thăm dò khoá."

**③ Phát hiện: khoá sau 2 lần, không phải 3**

> "Đề bài ghi hệ thống khoá sau ba lần đăng nhập sai. Hệ thống thật khoá sau **hai** lần. Nguyên nhân ở dòng năm mươi tư của `server.js`: bộ đếm cộng **hai** đơn vị mỗi lần sai, trong khi ngưỡng khoá là ba — nên nó đi từ không lên hai lên bốn, không bao giờ bằng đúng ba, và vượt ngưỡng sớm hơn một nhịp.
>
> Em kiểm chứng bằng mười tài khoản thăm dò riêng: mỗi tài khoản nhận đúng hai lần 401 rồi từ request thứ ba trở đi là 403, lặp lại mười lần không có ngoại lệ. Đây là sai lệch giữa đặc tả và hiện thực, em đã log thành Issue."

**④ Vì sao phải tách hai nhánh**

> "Vì phát hiện đó, plan tách hai nhánh riêng bằng If Controller: nhánh tài khoản hợp lệ và nhánh thăm dò khoá. Lý do là phản hồi 403 trả về rất nhanh — hệ thống kiểm trạng thái khoá ở dòng bốn mươi, **trước cả** bước so mật khẩu ở dòng bốn mươi sáu, nên nó return ngay mà không làm gì cả. Trộn chung hai nhánh thì hàng loạt 403 siêu nhanh sẽ kéo throughput trung bình đẹp lên một cách giả tạo, số đo mất ý nghĩa."

**⑤ Tham số**

> "Think-time ở kịch bản này em rút xuống trung bình bốn trăm mili

[... cắt bớt, xem transcript gốc ...]
```

---

## Lượt 99 — 17/08/2026 17:09:59

**Prompt (nguyên văn):**

```text
400 luồng là sao, là cái script test nó thật sự làm gì hệ thống này vậy
```

**Công cụ AI đã gọi:** 1 lần — `Bash`

**Output AI:**

```text
"400 luồng" nghĩa là JMeter tạo **400 người dùng ảo chạy song song**, mỗi người là một thread Java riêng, giữ kết nối HTTP riêng của mình.

## Mỗi luồng lặp đi lặp lại đúng 4 bước

```
đọc 1 dòng từ data/credentials.csv   →  email + password + expect_code
gửi POST /api/login                  →  kèm JSON {"email":..., "password":...}
chạy assertion                       →  mã trả về có khớp cột expect_code không
ngủ ~400ms (think-time)              →  rồi quay lại bước 1
```

400 luồng làm việc này đồng thời, liên tục trong suốt 90 giây. Không có gì phức tạp hơn thế — chỉ là **lặp lại rất nhiều lần, rất nhiều luồng cùng lúc**.

## Số học

```
400 luồng ÷ 0,4 giây nghỉ  =  1000 request/giây (lý thuyết)
```

Lượt tôi vừa chạy đo được **992 req/s** ở đoạn đầy tải — khớp gần như tuyệt đối. Trung bình toàn lượt là 667/s vì có tính cả 60 giây ramp lúc chưa đủ luồng.

Tổng cộng trong 89 giây: **59.649 request đăng nhập**, trong đó 56.815 dùng tài khoản hợp lệ và 2.834 cố tình sai mật khẩu để thăm dò khoá.

## Mỗi request đó bắt backend làm gì

Đọc từ [server.js:32-65](sut/backend/server.js#L32), một lần `POST /api/login` chạy đúng chuỗi này:

| Bước | Việc | Chi phí |
|---|---|---|
| 1 | `SELECT * FROM users WHERE email = ?` | truy vấn SQLite |
| 2 | Kiểm `locked_until` còn hiệu lực không | so sánh ngày |
| 3 | `user.password === password` | **so chuỗi trần, không bcrypt** |
| 4 | `jwt.sign(...)` | ký HMAC-SHA256 — đây mới là phần tốn CPU nhất |
| 5 | `UPDATE users SET login_attempts = 0, locked_until = NULL` | **ghi DB mỗi lần đăng nhập thành công** |

Nhân lên: trong 89 giây hệ thống đã phải thực hiện khoảng **57 nghìn lượt SELECT, 57 nghìn lượt UPDATE, và 57 nghìn lần ký JWT** — tất cả trên **một luồng duy nhất**, vì Node đơn luồng.

Đó chính là thứ bạn thấy trên htop: CPU leo từ 10% lên 87%. Không phải hệ thống bị "đánh phá", mà là nó đang thật sự xử lý gần một nghìn giao dịch đăng nhập mỗi giây.

Bước 3 đáng chú ý: mật khẩu so sánh dạng **plaintext**, không hash. Đây là mồi cho Task 2 — AI phân tích log sẽ mặc định đổ latency cho bcrypt, trong khi thực tế bcrypt không hề tồn tại ở đây.

## Nó để lại gì cho hệ thống

| Thay đổi | Mức độ |
|---|---|
| 2.834 request sai mật khẩu → cột `login_attempts` tăng, một số tài khoản bị khoá 180 giây | **Phải reset**, nếu không lượt sau đo sai |
| ~57 nghìn lượt `UPDATE` đặt lại `login_attempts = 0` cho tài khoản hợp lệ | Vô hại, chỉ ghi đè giá trị cũ |
| Bảng `products`, `orders` | **Không đụng tới** |

Nên sau Stress ch

[... cắt bớt, xem transcript gốc ...]
```

---

# Phiên `39b69a48` — 1 lượt

## Lượt 100 — 18/08/2026 10:14:03

**Prompt (nguyên văn):**

```text
https://youtu.be/joK1eGwLyxc: demo skill
https://youtu.be/xsII4iS_Y6s: demo task 1 

đọc đề @___2026.Homework.Policies.md , @2026.HW05.Performance Testing_En.md  và check submission nha
```

**Công cụ AI đã gọi:** 25 lần — `Read`, `Bash`, `Edit`, `AskUserQuestion`

**Output AI:**

```text
Good, found the exact spots. Let me fill in both YouTube links.

Now let's tick off the two video items in CHECKLIST.md and update the progress count.

Đã điền xong 2 link YouTube vào `CLAUDE.md` và `submission/README.md`, tick 3 mục checklist tương ứng (39/16 → còn 16). Đối chiếu nhanh với đề:

- Bug-Report (13) khớp GitHub Issues (13) ✓
- Hostname máy hiện tại (`qt-ThinkBook-14-G5-IRH`) khớp README ✓
- AI-Critique: 297 chữ (loại bỏ dấu — đứng riêng), trong khoảng 200–300 ✓

Theo `CHECKLIST.md`, phần còn lại chia hai nhóm:

**Sinh viên tự làm** (CLAUDE.md mục 3, tôi không đụng vào): xuất PDF cho Main-Report/AI-Audit-Report/AI-Critique, và đóng gói zip `23127262_HW05_AI_Performance_100.zip` (xem `submission/PACKAGING.md`).

**Còn lại của tôi** (R1 quy định phải làm **cuối cùng** vì transcript còn dài ra): trích `AI-Prompt-Log.md` và xuất `git-log.txt` sau commit cuối.
```

---
