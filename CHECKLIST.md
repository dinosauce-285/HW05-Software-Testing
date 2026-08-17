# CHECKLIST — HW05 Performance Testing

> **Đây là nguồn sự thật duy nhất về tiến độ.** Xong việc nào tick ngay việc đó.
> Không tick = chưa xong, bất kể đã nói gì trong hội thoại.

**Ký hiệu:** 🔴 thiếu là **0 điểm toàn bài** (mục 17:204) · 🟡 mất điểm ở mục tương ứng · ⚪ hoàn thiện

**Cập nhật lần cuối:** 17/08/2026

---

## Tiến độ

| Nhóm | Xong | Còn |
|---|---|---|
| Đã hoàn thành | **30** | — |
| Nhóm A — làm ngay | Claude ✅ xong | sinh viên còn **2** (video) |
| Nhóm B — làm cuối | Claude **6** | sinh viên **4** |
| Kiểm tra lần cuối trước khi nộp | — | **12** |
| **TỔNG** | **30** | **24** |

```bash
# đếm lại, không tin trí nhớ (R14)
grep -c '^- \[x\]' CHECKLIST.md && grep -c '^- \[ \]' CHECKLIST.md
```

**Điểm còn treo:** Task 2 bước 2-4 (10đ, sinh viên) · video demo Agent Skill (sinh viên).
Phần Claude ở nhóm A đã xong.

---

# ĐÃ XONG

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
- [x] Nhật ký review-fix AI — 5 dòng, ghi tại thời điểm sửa *(mục 6:92)*

## Task 2 — Phân tích AI (10đ)

- [x] Bước 1: AI phân tích `.jtl` trong phiên cô lập *(mục 6:102)*

## Task 3 — CPT (10đ)

- [x] Đo nhiễu nền: p95 dao động **1,83 lần**, p50 bất biến 2 ms
- [x] Flow chart Mermaid + bản PNG *(mục 6:108)*
- [x] Đủ 3 khâu: theo dõi commit → quyết định chạy → cảnh báo p95
- [x] Bàn trade-off: chi phí (~25 USD/tháng) + báo động giả

## Tài liệu

- [x] `Main-Report.md` — phần Task 1
- [x] `Bug-Report.md` — 10 BUG + 3 PERF
- [x] 13 GitHub Issue kèm ảnh bằng chứng *(mục 6:96)*
- [x] `Not-Run.md` — phần không chạy được kèm lý do

---

# NHÓM A — LÀM NGAY

## A1 · Claude làm

- [x] **Agent Skill** — `.claude/skills/perf-test-endpoint/` 🟡 **10đ** *(mục 7:112)*
      → SKILL.md + 2 file tham chiếu, 3 598 từ. Video demo vẫn còn nợ (A2)
- [x] Bảng spec phần cứng `evidence/hardware/spec.md` ⚪
      → hostname `qt-ThinkBook-14-G5-IRH` để đối chiếu HW04

## A2 · Sinh viên làm

- [x] **Task 2 — bước 2**: săn lỗi diễn giải 🟡 *(mục 6:103)*
      → 5 lỗi của AI (bảng A) + 4 lỗi của chính báo cáo mình (bảng B), mỗi lỗi kèm lệnh kiểm chứng
- [x] **Task 2 — bước 3**: phân loại 10 đề xuất — 9 feasible, 1 hallucinated 🟡 *(mục 6:104)*
- [x] **Task 2 — bước 4**: tổng kết — AI đúng 80%, đề xuất feasible 90% 🟡
- [x] Sửa 4 con số sai trong Main-Report / README / Bug-Report / Issue #12 *(R11)*
- [x] **Screenshot JMeter + htop CHUNG MỘT KHUNG HÌNH** 🔴 *(mục 6:93, 11:150)*
      → 3 ảnh trong `evidence/monitor/`, chụp trên màn hình X ảo (Wayland chặn chụp thường)
      → cách chụp ghi rõ ở `Not-Run.md` mục 6; bằng chứng màn hình thật vẫn nằm ở video
- [x] **Ảnh hardware** 🔴 *(mục 6:93, 11:151)*
      → `hostname-whoami.png` + `fastfetch.png` + `spec.md`, hostname `qt-ThinkBook-14-G5-IRH`
- [ ] **Video Task 1 ≥ 6 phút**, giọng tiếng Việt của mình 🔴 *(mục 6:95)*
      → gộp chung buổi với 2 việc trên
- [ ] **Video demo Agent Skill** 🟡 *(mục 7:113)*
      → chờ A1 xong

---

# NHÓM B — LÀM CUỐI

## B1 · Claude làm — đúng thứ tự này, cái sau ăn dữ liệu cái trước

- [ ] 1. **AI-Prompt-Log** — trích transcript phiên làm việc 🔴 *(mục 9:130-134)*
      → phiên còn chạy, trích sớm là thiếu
- [ ] 2. **AI Audit Report** theo mẫu 5 mục 🔴 *(mục 9:127)*
      → 1 hàng/artifact, cần đủ Agent Skill + kết quả Task 2
- [ ] 3. **AI Critique 200–300 chữ** 🔴 *(mục 10:138)*
      → phải dẫn được chỗ AI sai mà **sinh viên** tìm ra
- [ ] 4. Gộp Task 2 + Task 3 vào `Main-Report.md` ⚪
- [ ] 5. Ghi xác nhận không trùng endpoint với nhóm vào báo cáo chính ⚪ *(mục 5:78)*
- [ ] 6. **`git-log.txt`** 🔴 *(mục 12:156)*
      → **lệnh cuối cùng**, mỗi commit mới là file này lỗi thời

## B2 · Sinh viên làm — sau khi B1 xong

- [ ] Điền **bảng tự đánh giá** vào `submission/README.md` 🔴 *(mục 14:177)*
- [ ] Điền **2 link YouTube** vào README và bảng biến trong `CLAUDE.md` 🔴
- [ ] **Xuất PDF**: `Main-Report`, `AI-Audit-Report`, `AI-Critique` 🔴 *(mục 2:23)*
- [ ] **Đóng gói** `23127262_HW05_AI_Performance_100.zip` 🔴 *(mục 14:164)*
      → file `.jtl` lớn nhất 106 MB, Policies:41 cho phép split-and-zip

---

# Kiểm tra lần cuối trước khi nộp

Chạy hết bảng này rồi mới nộp. Mỗi dòng là một điều kiện chặn ở mục 17:204.

- [ ] Báo cáo chính có cả `.md` lẫn `.pdf`
- [ ] AI Audit Report có cả `.md` lẫn `.pdf`, đúng mẫu 5 mục, **đã xoá hàng mẫu in nghiêng**
- [ ] AI Critique đếm được **200–300 chữ** (đếm bằng lệnh, không ước lượng)
- [ ] 3 file `.jtl` thô nộp **nguyên vẹn**, không phải bản tóm tắt
- [ ] 3 thư mục HTML report
- [ ] Screenshot resource monitor + hardware, **hostname khớp HW04**
- [ ] Video Task 1 **tổng ≥ 6 phút**, JMeter và htop **chung khung hình**, giọng mình
- [ ] `git-log.txt` xuất **sau** commit cuối cùng
- [ ] Số bug trong Markdown **khớp** số GitHub Issue (hiện: 13 = 13)
- [ ] README có bảng tự đánh giá + test summary đủ 5 mục *(mục 14:177)*
- [ ] Tên file zip đúng `23127262_HW05_AI_Performance_100.zip`
- [ ] Mọi con số trong báo cáo **truy ngược được về `.jtl`** bằng lệnh *(R11)*
