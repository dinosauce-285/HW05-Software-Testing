#!/usr/bin/env bash
# Chụp ảnh JMeter và htop TRONG CÙNG MỘT KHUNG HÌNH - đề mục 6:93 và 11:150.
#
# VÌ SAO PHẢI DỰNG MÀN HÌNH ẢO:
# Phiên desktop của máy này chạy Wayland. GNOME 45+ chặn chụp màn hình qua D-Bus
# ("Screenshot is not allowed"), và `import -window root` của ImageMagick không
# truy cập được root window vì trên Wayland không có root window kiểu X.
# Giải pháp: dựng một màn hình X ảo bằng Xvfb, chạy THẬT htop và JMeter trong đó,
# rồi chụp bằng `import` trên chính màn hình ảo ấy.
#
# Tiến trình là thật, tải là thật, số liệu là thật - chỉ có màn hình là ảo.
#
# Dùng: ./scripts/capture-monitor-shot.sh <load|stress|spike>

set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SCENARIO="${1:?Thiếu tên kịch bản: load | stress | spike}"
DISP=":99"
GEO="190x41+0+0"
OUT="evidence/monitor/${SCENARIO}-jmeter-htop.png"

case "$SCENARIO" in
  load)   PLAN="23127262_Load_20260811.jmx";   ARGS="-Jthreads=120 -Jrampup=20 -Jduration=150" ;;
  stress) PLAN="23127262_Stress_20260813.jmx"; ARGS="-Jthreads=400 -Jrampup=40 -Jduration=150" ;;
  spike)  PLAN="23127262_Spike_20260813.jmx";  ARGS="-Jbase=20 -Jbaseduration=150 -Jspike=300 -Jspikeduration=40 -Jspikedelay=45" ;;
  *) echo "Kịch bản không hợp lệ: $SCENARIO" >&2; exit 1 ;;
esac

cleanup() {
  screen -S "perfshot" -X quit 2>/dev/null || true
  [ -n "${XVFB_PID:-}" ] && kill "$XVFB_PID" 2>/dev/null
  rm -f "$SCREENRC"
}
trap cleanup EXIT

echo "[1/6] Bảo đảm backend đang chạy và có dữ liệu nền"
if ! curl -sf -o /dev/null http://localhost:3000/api/products; then
  echo "  backend chưa chạy - khởi động và seed lại"
  ./scripts/reset-db.sh > /dev/null 2>&1
fi
node scripts/reset-lockout.js > /dev/null 2>&1
PRODUCTS=$(curl -s http://localhost:3000/api/products | grep -o '"id"' | wc -l)
echo "  backend OK - $PRODUCTS sản phẩm"

# Neo hai dau mau, khong dung pgrep -f khong neo: mau khong neo se khop trung
# chinh tien trinh shell dang chay script nay (dong lenh cua no chua chuoi do).
BPID=$(pgrep -x node | head -1)
if [ -z "$BPID" ]; then echo "Không tìm thấy tiến trình node" >&2; exit 1; fi
echo "  PID backend = $BPID"

echo "[2/6] Dựng màn hình X ảo $DISP"
Xvfb "$DISP" -screen 0 1600x900x24 > /dev/null 2>&1 &
XVFB_PID=$!
sleep 2
if ! kill -0 "$XVFB_PID" 2>/dev/null; then echo "Xvfb không khởi động được" >&2; exit 1; fi

echo "[3/6] Soạn cấu hình screen: htop ở trên, JMeter ở dưới"
SCREENRC="$(mktemp /tmp/perfshot-screenrc.XXXXXX)"
cat > "$SCREENRC" <<EOF
startup_message off
caption always "%{= kw}%-w%{= BW}%n %t%{-}%+w  |  HW05 Performance Testing - MSSV 23127262"
screen -t htop 0 htop -d 10 -p $BPID
split
focus down
screen -t jmeter 1 bash -c "cd $ROOT/plans && source ../env.sh && jmeter -n -t $PLAN $ARGS -l /tmp/perfshot-$SCENARIO.jtl; exec bash"
focus up
EOF

echo "[4/6] Mở terminal trên màn hình ảo và chạy $SCENARIO"
# Tat banner "Set GNOME Terminal as your default terminal?" de no khong che mat noi dung
gsettings set org.gnome.Terminal.Legacy.Settings always-check-default-terminal false 2>/dev/null || true
# GDK_BACKEND=x11 la BAT BUOC: mac dinh gnome-terminal uu tien Wayland nen khong
# tao cua so nao tren man hinh X ao, va anh chup ra den si.
DISPLAY="$DISP" GDK_BACKEND=x11 WAYLAND_DISPLAY= dbus-run-session -- \
  gnome-terminal --geometry="$GEO" --hide-menubar --wait -- \
  screen -c "$SCREENRC" -S perfshot > /dev/null 2>&1 &

echo "[5/6] Chờ JMeter vào giữa lượt chạy (75 giây)"
sleep 75

echo "[6/6] Ép vẽ lại rồi chụp"
# htop va JMeter cung ghi ra man hinh khi screen chia doi -> de bi chong chu.
# Ep ve lai toan bo roi cho on dinh moi chup.
screen -S perfshot -X redisplay 2>/dev/null || true
sleep 4
mkdir -p evidence/monitor
# Chup dung cua so terminal thay vi root, de khong dinh vien den thua
WID=$(DISPLAY="$DISP" xwininfo -root -children 2>/dev/null | grep '"Terminal"' | awk '{print $1}' | head -1)
if [ -n "$WID" ]; then
  DISPLAY="$DISP" import -window "$WID" "$OUT" 2>/dev/null
else
  DISPLAY="$DISP" import -window root "$OUT" 2>/dev/null
fi
if [ ! -s "$OUT" ]; then echo "Chụp thất bại" >&2; exit 1; fi

MEAN=$(identify -format "%[mean]" "$OUT" 2>/dev/null | cut -d. -f1)
echo "  -> $OUT ($(identify -format '%wx%h' "$OUT"), độ sáng trung bình $MEAN)"
if [ "${MEAN:-0}" -lt 200 ]; then
  echo "  ⚠ Ảnh gần như đen - nhiều khả năng terminal chưa vẽ xong" >&2
fi
