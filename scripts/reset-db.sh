#!/usr/bin/env bash
# Reset toan bo du lieu ve trang thai sach truoc moi luot chay - de muc 6:93.
#
# VI SAO CAN: POST /api/checkout khong kiem gio hang, khong kiem ton kho, insert
# thang vao bang orders (server.js:301). Mot luot Spike de lai hang chuc nghin don
# rac. Ngoai ra gio hang nam trong RAM (userCarts, server.js:14) va khong bao gio
# duoc don, nen tien trinh backend cu cung mang theo bo nho phinh tu luot truoc.
#
# CO CHE: sut/backend/database.js goi initDatabase() ngay khi duoc import
# (database.js:117), ma ham nay mo dau bang 6 lenh DROP TABLE (database.js:15-20).
# Nghia la CHI CAN KHOI DONG LAI BACKEND la toan bo DB bi xoa va seed lai tu dau.
# Day khong phai thiet ke tot, nhung o day no dung lam co che reset - va vi the
# sau moi lan restart BAT BUOC phai chay lai seed-data.js de dung du lieu nen.
#
# Dung: ./scripts/reset-db.sh

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="${ROOT}/sut/backend/server-run.log"

echo "[1/4] Dung backend dang chay..."
pkill -f '^node server\.js$' 2>/dev/null || true
sleep 1

echo "[2/4] Khoi dong lai backend (thao tac nay tu xoa va seed lai DB)..."
cd "${ROOT}/sut/backend"
nohup node server.js > "$LOG" 2>&1 &
cd "$ROOT"

for i in $(seq 1 30); do
  if curl -sf -o /dev/null http://localhost:3000/api/products; then break; fi
  sleep 0.5
done

if ! curl -sf -o /dev/null http://localhost:3000/api/products; then
  echo "Backend khong len duoc - xem $LOG" >&2
  exit 1
fi

echo "[3/4] Nap lai du lieu nen (147 san pham + 210 tai khoan)..."
node "${ROOT}/scripts/seed-data.js"

echo "[4/4] Kiem chung trang thai sach:"
PRODUCTS=$(curl -s http://localhost:3000/api/products | grep -o '"id"' | wc -l)
echo "  - San pham: ${PRODUCTS}"
echo "  - Don hang: $(node "${ROOT}/scripts/count-orders.js")"
echo "Da reset xong."
