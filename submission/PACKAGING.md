# Hướng dẫn đóng gói bài nộp

*(HW05 mục 14:164-178 - Policies:34, 41 - file làm việc, không phải mục chấm)*

**Tên file:** `23127262_HW05_AI_Performance_100.zip`

---

## 1. Đối chiếu danh mục bắt buộc của đề

Mười một dòng dưới đây là đúng danh mục mục 14:167-178. Cột cuối là đường dẫn thật trong repo.

Thư mục `submission/` giờ **tự chứa đủ**, chỉ cần nén đúng nó. Dựng lại bất cứ lúc nào:

```bash
./scripts/assemble-submission.sh
```

| # | Đề yêu cầu | Trạng thái | Nằm ở đâu trong `submission/` |
|---|---|---|---|
| 1 | Báo cáo chính (**Markdown + PDF**) | md [x] - **pdf [ ]** | `report/Main-Report.md` |
| 2 | Link repo GitHub công khai | [x] | trong `README.md` |
| 3 | **Ba test plan** đúng quy ước tên | [x] 3 file | `plans/` |
| 4 | **`.jtl` thô** + **thư mục HTML** | [x] 8 file - 6 thư mục | `results/raw/` - `results/html/` |
| 5 | Screenshot resource monitor + phần cứng | [x] 3 + 2 ảnh | `evidence/monitor/` - `evidence/hardware/` |
| 6 | Link video demo YouTube (unlisted) | **[ ]** | điền vào `README.md` |
| 7 | AI Critique + AI Audit Report (**md + pdf**) | md [x] - **pdf [ ]** | `appendix/` |
| 8 | Git commit log (file text) | **[ ]** Claude chạy cuối | `appendix/git-log.txt` |
| 9 | Bug report + screenshot | [x] + 14 ảnh | `report/Bug-Report.md` - `evidence/bugs/` |
| 10 | `README.md` - bảng tự đánh giá + test summary | [x] | `README.md` |
| 11 | Tài liệu hỗ trợ khác | [x] | `data/` 3 CSV - `scripts/` 16 script - `skills/` |

**Còn thiếu 4 mục:** 3 file PDF + link video (sinh viên) - `git-log.txt` (Claude, chạy cuối cùng).

Nộp nhiều hơn mức tối thiểu ở hai chỗ, đều có lý do: **8 file `.jtl`** thay vì 3 vì kịch bản Stress
phải leo thang 4 lượt mới tìm được điểm gãy, và lượt soak là nguồn của ngưỡng chịu đựng - giữ đủ để
chứng minh quá trình chứ không phải chọn sẵn con số đẹp (giải thích ở `results/raw/MANIFEST.md`).
**6 thư mục HTML** tương ứng 6 lượt có sinh dashboard.

---

## 2. Dung lượng - chỉ là chuyện đóng gói, không bớt file

Policies:41 ghi rõ: *"The submission link accepts a maximum of **20 files**, with each file limited
to **20 MB**. Students should proactively use the split-and-zip feature."*

Dung lượng thật hiện tại:

| Thư mục | Dung lượng | Ghi chú |
|---|---|---|
| `results/raw/` | **360 MB** | 8 file `.jtl`, lớn nhất 106 MB |
| `results/html/` | 20 MB | 6 thư mục dashboard |
| `evidence/` | 3,8 MB | 30 file ảnh + CSV |
| `plans/` `data/` `submission/` | < 1 MB | |

Một file `.jtl` đơn lẻ đã 106 MB, gấp **5 lần** giới hạn 20 MB mỗi file. Đây là lý do Policies:41
khuyên dùng **split-and-zip** - chia nhỏ khi nén, **không phải** bớt file khi nộp.

```bash
cd ~/projects/hw05
zip -r -s 19m 23127262_HW05_AI_Performance_100.zip submission/
```

Lệnh sinh ra `...z01`, `...z02`, ... và file `.zip` cuối. **Nộp tất cả các phần** - thiếu một phần là
không giải nén được.

! **Không cắt nội dung bất kỳ file `.jtl` nào.** Mục 11:149 đòi *"attached in full - not only the
summary"*, và mục 11 ghi rõ TA verify trực tiếp phần này.

---

## 3. Cấu trúc `submission/` - nén đúng thư mục này là đủ

```
submission/                            384 MB
|-- README.md                          bảng tự đánh giá 100/100 + test summary
|-- PACKAGING.md                       file này
|-- report/
|   |-- Main-Report.md  + .pdf         [ ] cần xuất PDF
|   |-- Bug-Report.md                  10 BUG + 3 PERF, khớp 13 GitHub Issue
|   |-- AI-Review-Fix-Log.md           nhật ký sửa output AI
|   |-- Not-Run.md                     phần không chạy được + lý do
|   |-- Task2-Misinterpretation-Hunt.md
|   `-- Task3-Continuous-Performance-Testing.md
|-- appendix/
|   |-- AI-Audit-Report.md  + .pdf     [ ] cần xuất PDF
|   |-- AI-Critique.md      + .pdf     [ ] cần xuất PDF
|   |-- AI-Analysis-Raw.md             output AI nguyên văn
|   |-- AI-Prompt-Log.md               [ ] Claude chạy cuối
|   `-- git-log.txt                    [ ] Claude chạy cuối
|-- plans/          3 file .jmx đúng quy ước {MSSV}_{Scenario}_{YYYYMMDD}
|-- data/           3 file .csv - mỗi endpoint group một file
|-- results/
|   |-- raw/        8 file .jtl thô + MANIFEST.md (checksum SHA-256)
|   `-- html/       6 thư mục dashboard JMeter
|-- evidence/
|   |-- monitor/    3 ảnh JMeter+htop chung khung - 8 CSV tài nguyên
|   |-- hardware/   spec.md - hostname-whoami.png - fastfetch.png
|   |-- bugs/       14 ảnh bằng chứng lỗi
|   `-- diagrams/   flow chart Task 3 (PNG)
|-- scripts/        16 script tái lập + env.sh
`-- skills/         Agent Skill perf-test-endpoint
```

`results/` và `evidence/` dùng **hard link** trỏ về bản gốc trong repo, nên không tốn thêm dung
lượng đĩa (chỉ 468 KB tăng thêm), nhưng khi nén thì zip đóng gói đầy đủ nội dung.

---

## 4. Ba file PDF cần xuất

Policies:16 - *"students must also submit a Save-As-PDF version of those files"*.

| File nguồn | File PDF |
|---|---|
| `submission/report/Main-Report.md` | `Main-Report.pdf` |
| `submission/appendix/AI-Audit-Report.md` | `AI-Audit-Report.pdf` |
| `submission/appendix/AI-Critique.md` | `AI-Critique.pdf` |

! **Kiểm hai thứ sau khi xuất PDF:**

1. **Flow chart Mermaid trong Task 3** - phần lớn công cụ xuất PDF không render Mermaid. Tài liệu đã
   nhúng sẵn bản PNG ngay dưới khối Mermaid, kiểm xem PDF có hiện ảnh đó không.
2. **Bảng rộng** trong `Main-Report.md` và `AI-Audit-Report.md` - bảng audit có 6 cột, dễ bị tràn
   lề. Nếu tràn thì xuất ở khổ ngang (landscape).

---

## 5. Thứ tự thao tác cuối cùng

Làm đúng thứ tự này, vì mỗi bước phụ thuộc bước trước:

```
1. Quay 2 video, upload YouTube ở chế độ unlisted      [sinh viên]
2. Điền 2 link vào submission/README.md và CLAUDE.md   [sinh viên]
3. Sinh AI-Prompt-Log.md                               [Claude]
4. Commit lần cuối                                     [Claude]
5. Xuất git-log.txt  <- phải sau bước 4                 [Claude]
6. Xuất 3 file PDF                                     [sinh viên]
7. Chạy soát 12 điều kiện chặn ở CHECKLIST.md          [sinh viên]
8. Split-and-zip, đặt tên đúng                         [sinh viên]
```

Bước 5 phải nằm sau bước 4, nếu không `git-log.txt` sẽ thiếu chính commit cuối cùng.
