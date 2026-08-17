# Hướng dẫn đóng gói bài nộp

*(HW05 mục 14:164-178 · Policies:34, 41 — file làm việc, không phải mục chấm)*

**Tên file:** `23127262_HW05_AI_Performance_100.zip`

---

## 1. Đối chiếu danh mục bắt buộc của đề

Mười một dòng dưới đây là đúng danh mục mục 14:167-178. Cột cuối là đường dẫn thật trong repo.

| # | Đề yêu cầu | Trạng thái | Nằm ở đâu |
|---|---|---|---|
| 1 | Báo cáo chính (**Markdown + PDF**) | md ✅ · pdf ⬜ | `submission/report/Main-Report.md` |
| 2 | Link repo GitHub công khai | ✅ | ghi trong `submission/README.md` |
| 3 | **Ba test plan** đúng quy ước tên | ✅ | `plans/23127262_{Load,Stress,Spike}_*.jmx` |
| 4 | **Ba `.jtl` thô** + **ba thư mục HTML** | ✅ *(8 `.jtl`, 6 thư mục)* | `results/raw/` · `results/html/` |
| 5 | Screenshot resource monitor + phần cứng | ✅ | `evidence/monitor/` · `evidence/hardware/` |
| 6 | Link video demo YouTube (unlisted) | ⬜ | điền vào `submission/README.md` |
| 7 | AI Critique + AI Audit Report (**md + pdf**) | md ✅ · pdf ⬜ | `submission/appendix/` |
| 8 | Git commit log (file text) | ⬜ | `submission/appendix/git-log.txt` |
| 9 | Bug report + screenshot | ✅ | `submission/report/Bug-Report.md` · `evidence/bugs/` |
| 10 | `README.md` — bảng tự đánh giá + test summary | ✅ | `submission/README.md` |
| 11 | Tài liệu hỗ trợ khác | ✅ | `data/` · `scripts/` · `.claude/skills/` |

**Còn thiếu 4 mục** — 3 mục do sinh viên (PDF, link video), 1 mục do Claude (`git-log.txt`, chạy cuối cùng).

---

## 2. Vấn đề dung lượng — phải xử lý, không bỏ qua

Policies:41 ghi rõ: *"The submission link accepts a maximum of **20 files**, with each file limited
to **20 MB**. Students should proactively use the split-and-zip feature."*

Dung lượng thật hiện tại:

| Thư mục | Dung lượng | Ghi chú |
|---|---|---|
| `results/raw/` | **360 MB** | 8 file `.jtl`, lớn nhất 106 MB |
| `results/html/` | 20 MB | 6 thư mục dashboard |
| `evidence/` | 3,8 MB | 30 file ảnh + CSV |
| `plans/` `data/` `submission/` | < 1 MB | |

Một file `.jtl` đơn lẻ đã 106 MB, gấp **5 lần** giới hạn 20 MB mỗi file. Bắt buộc dùng **split-and-zip**.

### Cách làm

Nén toàn bộ rồi chia thành các phần 19 MB:

```bash
cd ~/projects/hw05
zip -r -s 19m 23127262_HW05_AI_Performance_100.zip \
    submission/ plans/ data/ results/ evidence/ scripts/ .claude/ \
    -x "*/jmeter.log" "*/node_modules/*"
```

Lệnh trên sinh ra `...z01`, `...z02`, ..., và file `.zip` cuối. **Nộp tất cả các phần**, thiếu một
phần là không giải nén được.

Nếu tổng số phần vượt 20 file, cách giảm hợp lệ nhất là **chỉ giữ 4 file `.jtl` chính thức** thay
vì cả 8:

| Giữ lại | Vì sao |
|---|---|
| `load-20260811T023204Z.jtl` | Lượt Load chính thức |
| `stress-20260813T003655Z.jtl` | Lượt Stress chính thức — tìm ra điểm gãy |
| `spike-20260813T005423Z.jtl` | Lượt Spike chính thức |
| `soak-20260813T010601Z.jtl` | Lượt endurance — nguồn của ngưỡng 997 req/s |

Bốn file còn lại (`stress` mức 250 và 800 luồng, `bottleneck-check`, `load-ramp`) là **quá trình
leo thang tìm ngưỡng**, không bắt buộc nộp. Nếu bỏ thì phải ghi rõ trong `results/raw/MANIFEST.md`
là đã lược bớt và vì sao — bảng checksum SHA-256 vẫn giữ đủ 8 dòng để TA đối chiếu.

⚠️ **Không được cắt ngắn nội dung file `.jtl`.** Mục 11:149 đòi *"attached in full — not only the
summary"*. Bỏ bớt **số lượng file** thì được, cắt **nội dung bên trong** một file thì là gian lận.

---

## 3. Cấu trúc bên trong zip

```
23127262_HW05_AI_Performance_100.zip
├── submission/
│   ├── README.md                     ← bảng tự đánh giá + test summary
│   ├── report/
│   │   ├── Main-Report.md  + .pdf    ⬜ cần xuất PDF
│   │   ├── Bug-Report.md
│   │   ├── AI-Review-Fix-Log.md
│   │   ├── Not-Run.md
│   │   ├── Task2-Misinterpretation-Hunt.md
│   │   └── Task3-Continuous-Performance-Testing.md
│   └── appendix/
│       ├── AI-Audit-Report.md  + .pdf    ⬜ cần xuất PDF
│       ├── AI-Critique.md      + .pdf    ⬜ cần xuất PDF
│       ├── AI-Analysis-Raw.md
│       ├── AI-Prompt-Log.md              ⬜ Claude chạy cuối
│       └── git-log.txt                   ⬜ Claude chạy cuối
├── plans/          3 file .jmx
├── data/           3 file .csv
├── results/
│   ├── raw/        .jtl thô + MANIFEST.md (checksum)
│   └── html/       6 thư mục dashboard
├── evidence/
│   ├── monitor/    3 ảnh JMeter+htop · 8 CSV tài nguyên
│   ├── hardware/   spec.md · hostname-whoami.png · fastfetch.png
│   ├── bugs/       14 ảnh bằng chứng lỗi
│   └── diagrams/   flow chart Task 3
├── scripts/        11 script
└── .claude/skills/ Agent Skill
```

---

## 4. Ba file PDF cần xuất

Policies:16 — *"students must also submit a Save-As-PDF version of those files"*.

| File nguồn | File PDF |
|---|---|
| `submission/report/Main-Report.md` | `Main-Report.pdf` |
| `submission/appendix/AI-Audit-Report.md` | `AI-Audit-Report.pdf` |
| `submission/appendix/AI-Critique.md` | `AI-Critique.pdf` |

⚠️ **Kiểm hai thứ sau khi xuất PDF:**

1. **Flow chart Mermaid trong Task 3** — phần lớn công cụ xuất PDF không render Mermaid. Tài liệu đã
   nhúng sẵn bản PNG ngay dưới khối Mermaid, kiểm xem PDF có hiện ảnh đó không.
2. **Bảng rộng** trong `Main-Report.md` và `AI-Audit-Report.md` — bảng audit có 6 cột, dễ bị tràn
   lề. Nếu tràn thì xuất ở khổ ngang (landscape).

---

## 5. Thứ tự thao tác cuối cùng

Làm đúng thứ tự này, vì mỗi bước phụ thuộc bước trước:

```
1. Quay 2 video, upload YouTube ở chế độ unlisted      [sinh viên]
2. Điền 2 link vào submission/README.md và CLAUDE.md   [sinh viên]
3. Sinh AI-Prompt-Log.md                               [Claude]
4. Commit lần cuối                                     [Claude]
5. Xuất git-log.txt  ← phải sau bước 4                 [Claude]
6. Xuất 3 file PDF                                     [sinh viên]
7. Chạy soát 12 điều kiện chặn ở CHECKLIST.md          [sinh viên]
8. Split-and-zip, đặt tên đúng                         [sinh viên]
```

Bước 5 phải nằm sau bước 4, nếu không `git-log.txt` sẽ thiếu chính commit cuối cùng.
