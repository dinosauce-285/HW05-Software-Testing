# CHECKLIST — HW05 Performance Testing

> **Nguồn sự thật duy nhất về tiến độ.** Xong việc nào tick ngay việc đó.
> Không tick = chưa xong, bất kể đã nói gì trong hội thoại.

**Ký hiệu:** 🔴 thiếu là **0 điểm toàn bài** (mục 17:204) · 🟡 mất điểm ở mục tương ứng · ⚪ hoàn thiện

**Cập nhật:** 17/08/2026 · **34 xong / 20 còn**

```bash
grep -c '^- \[x\]' CHECKLIST.md && grep -c '^- \[ \]' CHECKLIST.md
```

---

# 🔴 CÒN THIẾU

## ① Sinh viên — 6 việc

**Quay video — gộp một buổi được:**

- [ ] **Video Task 1 ≥ 6 phút**, giọng tiếng Việt của mình 🔴 *(mục 6:95)*
      → JMeter và htop phải **chung một khung hình** trên màn hình thật
      → được cắt thành nhiều clip, mỗi kịch bản một clip
- [ ] **Video demo Agent Skill**, quay end-to-end trên một endpoint group 🟡 *(mục 7:113)*
      → skill đã sẵn ở `.claude/skills/perf-test-endpoint/`

**Sau khi Claude xong phần ②:**

- [ ] Điền **bảng tự đánh giá** vào `submission/README.md` 🔴 *(mục 14:177)*
- [ ] Điền **2 link YouTube** vào `submission/README.md` và bảng biến `CLAUDE.md` 🔴
- [ ] **Xuất PDF**: `Main-Report`, `AI-Audit-Report`, `AI-Critique` 🔴 *(mục 2:23)*
- [ ] **Đóng gói** `23127262_HW05_AI_Performance_100.zip` 🔴 *(mục 14:164)*
      → file `.jtl` lớn nhất 106 MB → Policies:41 cho phép split-and-zip

## ② Claude — 2 việc, buộc phải làm cuối cùng

- [ ] **`AI-Prompt-Log.md`** — trích transcript phiên làm việc 🔴 *(mục 9:130-134)*
      → phiên vẫn dài ra mỗi lượt, trích sớm là thiếu
- [ ] **`git-log.txt`** 🔴 *(mục 12:156)*
      → **lệnh cuối cùng**, chạy sau commit cuối

---

# ✅ SOÁT LẦN CUỐI — 12 điều kiện chặn

Mỗi dòng là một điều kiện ở mục 17:204. Chạy hết rồi mới nộp.

- [ ] Báo cáo chính có cả `.md` lẫn `.pdf`
- [ ] AI Audit Report có cả `.md` lẫn `.pdf`, đúng mẫu 6 mục, **đã xoá hàng mẫu in nghiêng**
- [ ] AI Critique đếm được **200–300 chữ** *(hiện 297 — đếm lại nếu sửa)*
- [ ] 3 file `.jtl` thô nộp **nguyên vẹn**, không phải bản tóm tắt
- [ ] 3 thư mục HTML report
- [ ] Screenshot resource monitor + hardware, **hostname khớp HW04**
- [ ] Video Task 1 **tổng ≥ 6 phút**, JMeter và htop **chung khung hình**, giọng mình
- [ ] `git-log.txt` xuất **sau** commit cuối cùng
- [ ] Số bug trong Markdown **khớp** số GitHub Issue *(hiện 13 = 13)*
- [ ] README có bảng tự đánh giá + test summary đủ 5 mục *(mục 14:177)*
- [ ] Tên file zip đúng `23127262_HW05_AI_Performance_100.zip`
- [ ] Mọi con số trong báo cáo **truy ngược được về `.jtl`** bằng lệnh *(R11)*

---

<details>
<summary><b>ĐÃ XONG — 34 mục (bấm để mở)</b></summary>

## Task 1 — Kiểm thử (60đ)

- [x] Khảo sát hành vi thật của SUT bằng `curl`, không suy từ code
- [x] Chốt 3 endpoint group, không trùng thành viên nhóm *(mục 5:78)*
- [x] Sinh dữ liệu nền: 147 sản phẩm + 210 tài khoản qua API
- [x] 3 file CSV riêng cho 3 nhóm *(mục 6:89)*
- [x] `23127262_Load_20260811.jmx` — Summary Report *(mục 6:90-91)*
- [x] `23127262_Stress_20260813.jmx` — Aggregate Report
- [x] `23127262_Spike_20260813.jmx` — View Results Tree
- [x] Chạy 8 lượt, 1 386 000+ request thật
- [x] `.jtl` thô nguyên vẹn + checksum SHA-256 *(mục 11:149)*
- [x] 6 thư mục HTML dashboard *(mục 14:171)*
- [x] Endurance 11 phút → **997 req/s**, trần **161 MB RSS** *(mục 6:94)*
- [x] Quy trình reset lockout ghi lệnh chính xác *(mục 6:93)*
- [x] Nhật ký review-fix AI — ghi tại thời điểm sửa *(mục 6:92)*
- [x] **Screenshot JMeter + htop chung một khung hình** — 3 ảnh *(mục 6:93, 11:150)*
- [x] **Ảnh hardware** — `hostname-whoami.png` + `fastfetch.png` + `spec.md` *(mục 11:151)*

## Task 2 — Phân tích AI (10đ)

- [x] Bước 1: AI phân tích `.jtl` trong phiên cô lập *(mục 6:102)*
- [x] Bước 2: săn lỗi diễn giải — 5 lỗi của AI + 4 lỗi của chính báo cáo mình *(mục 6:103)*
- [x] Bước 3: phân loại 10 đề xuất — 9 feasible, 1 hallucinated *(mục 6:104)*
- [x] Bước 4: tổng kết — AI đúng 80%, đề xuất feasible 90%
- [x] Sửa 4 con số sai trong Main-Report / README / Bug-Report / Issue #12 *(R11)*

## Task 3 — CPT (10đ)

- [x] Đo nhiễu nền: p95 dao động **1,83 lần**, p50 bất biến 2 ms
- [x] Flow chart Mermaid + bản PNG *(mục 6:108)*
- [x] Đủ 3 khâu: theo dõi commit → quyết định chạy → cảnh báo p95
- [x] Bàn trade-off: chi phí (~25 USD/tháng) + báo động giả

## Agent Skill (10đ)

- [x] `.claude/skills/perf-test-endpoint/` — SKILL.md + 2 file tham chiếu, 3 598 từ *(mục 7:112)*

## Tài liệu

- [x] `Main-Report.md` — 7 821 từ, phủ trọn Task 1 + 2 + 3
- [x] `Bug-Report.md` — 10 BUG + 3 PERF
- [x] 13 GitHub Issue kèm ảnh bằng chứng *(mục 6:96)*
- [x] `Not-Run.md` — phần không chạy được kèm lý do
- [x] `Task2-Misinterpretation-Hunt.md`
- [x] `Task3-Continuous-Performance-Testing.md`
- [x] `AI-Analysis-Raw.md` — output AI nguyên văn, 7 715 từ
- [x] **AI Audit Report** — 12 artifact, mẫu 6 mục, kết luận **149 từ** *(mục 9:127)*
- [x] **AI Critique** — **297 từ** *(mục 10:138)*
- [x] Xác nhận không trùng endpoint với nhóm, ghi vào báo cáo chính *(mục 5:78)*

</details>
