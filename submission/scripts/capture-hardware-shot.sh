#!/usr/bin/env bash
# Chụp ảnh thông tin phần cứng - đề mục 6:93 ("a dxdiag / screenfetch screenshot")
# và mục 11:151 (hostname phải khớp các bài tập trước).
#
# Máy này không có screenfetch/neofetch; dùng fastfetch - bản thay thế hiện đại,
# cùng công dụng. Chụp trên màn hình X ảo vì phiên desktop chạy Wayland và
# GNOME 45+ chặn chụp màn hình qua D-Bus (xem chú thích ở capture-monitor-shot.sh).
#
# Dùng: ./scripts/capture-hardware-shot.sh

set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DISP=":97"
OUT="evidence/hardware/fastfetch.png"

cleanup() { [ -n "${XVFB_PID:-}" ] && kill "$XVFB_PID" 2>/dev/null; }
trap cleanup EXIT

Xvfb "$DISP" -screen 0 1400x800x24 > /dev/null 2>&1 &
XVFB_PID=$!
sleep 2

gsettings set org.gnome.Terminal.Legacy.Settings always-check-default-terminal false 2>/dev/null || true

DISPLAY="$DISP" GDK_BACKEND=x11 WAYLAND_DISPLAY= dbus-run-session -- \
  gnome-terminal --geometry=165x36+0+0 --hide-menubar --wait -- \
  bash -c 'echo; whoami; hostname; echo; fastfetch; echo; exec sleep 600' > /dev/null 2>&1 &

sleep 18
mkdir -p evidence/hardware
WID=$(DISPLAY="$DISP" xwininfo -root -children 2>/dev/null | grep '"Terminal"' | awk '{print $1}' | head -1)
if [ -n "$WID" ]; then
  DISPLAY="$DISP" import -window "$WID" "$OUT" 2>/dev/null
else
  DISPLAY="$DISP" import -window root "$OUT" 2>/dev/null
fi

[ -s "$OUT" ] || { echo "Chụp thất bại" >&2; exit 1; }
echo "-> $OUT ($(identify -format '%wx%h, độ sáng %[mean]' "$OUT"))"
