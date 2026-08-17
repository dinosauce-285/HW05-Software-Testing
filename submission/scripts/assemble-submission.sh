#!/usr/bin/env bash
# Gom TOÀN BỘ hạng mục đề yêu cầu vào thư mục submission/ để đóng gói.
#
# Đề mục 14:167-178 liệt kê 11 hạng mục phải có trong file .zip. Trước script này
# chúng nằm rải rác khắp repo (plans/, data/, results/, evidence/...). Script gom
# hết vào submission/ để chỉ cần nén đúng một thư mục.
#
# File .jtl và thư mục HTML dùng HARD LINK thay vì sao chép, nên không tốn thêm
# dung lượng đĩa dù tổng cộng gần 400 MB. Nén thì zip vẫn đóng gói đầy đủ nội dung.
#
# Chạy lại được nhiều lần - luôn dựng lại từ đầu để không sót bản cũ.
#
# Dùng: ./scripts/assemble-submission.sh

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
S="submission"

echo "[1/7] Dọn các thư mục được gom tự động (giữ nguyên report/ appendix/ README.md)"
rm -rf "$S/plans" "$S/data" "$S/results" "$S/evidence" "$S/scripts" "$S/skills"

echo "[2/7] Test plan (đề mục 14:170)"
mkdir -p "$S/plans"
cp plans/*.jmx "$S/plans/"

echo "[3/7] File dữ liệu CSV (đề mục 6:89)"
mkdir -p "$S/data"
cp data/*.csv "$S/data/"

echo "[4/7] Log .jtl thô + thư mục HTML (đề mục 14:171) - dùng hard link"
mkdir -p "$S/results"
cp -al results/raw "$S/results/raw"
cp -al results/html "$S/results/html"

echo "[5/7] Bằng chứng: screenshot, phần cứng, biểu đồ (đề mục 14:172)"
cp -al evidence "$S/evidence"

echo "[6/7] Script tái lập + Agent Skill (đề mục 7:112, 14:178)"
mkdir -p "$S/scripts"
cp scripts/*.js scripts/*.sh scripts/*.py "$S/scripts/" 2>/dev/null || true
mkdir -p "$S/skills"
cp -r .claude/skills/* "$S/skills/"
cp env.sh "$S/scripts/env.sh"

echo "[7/7] Kiểm đếm"
printf "  %-34s %s\n" "test plan (.jmx)"        "$(ls "$S"/plans/*.jmx 2>/dev/null | wc -l)"
printf "  %-34s %s\n" "file CSV"                "$(ls "$S"/data/*.csv 2>/dev/null | wc -l)"
printf "  %-34s %s\n" "log thô (.jtl)"          "$(ls "$S"/results/raw/*.jtl 2>/dev/null | wc -l)"
printf "  %-34s %s\n" "thư mục HTML dashboard"  "$(find "$S/results/html" -maxdepth 1 -mindepth 1 -type d | wc -l)"
printf "  %-34s %s\n" "ảnh bằng chứng (.png)"   "$(find "$S/evidence" -name '*.png' | wc -l)"
printf "  %-34s %s\n" "CSV tài nguyên"          "$(find "$S/evidence/monitor" -name '*.csv' | wc -l)"
printf "  %-34s %s\n" "tài liệu báo cáo (.md)"  "$(ls "$S"/report/*.md 2>/dev/null | wc -l)"
printf "  %-34s %s\n" "phụ lục"                 "$(ls "$S"/appendix/* 2>/dev/null | wc -l)"
printf "  %-34s %s\n" "script tái lập"          "$(ls "$S"/scripts/* 2>/dev/null | wc -l)"
echo
echo "  Dung lượng thật của submission/: $(du -sh "$S" | cut -f1)"
echo "  Dung lượng đĩa tăng thêm:       $(du -sh --exclude=results --exclude=evidence "$S" | cut -f1) (phần còn lại là hard link)"
echo
echo "Đã gom xong. Nén thư mục submission/ là đủ toàn bộ hạng mục."
