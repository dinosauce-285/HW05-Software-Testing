#!/usr/bin/env bash
# Lay mau muc su dung tai nguyen cua tien trinh backend trong luc chay test.
#
# Vi sao can: de muc 6:94 doi ket luan nguong chiu dung bang so cu the
# ("maximum stable RPS, memory ceiling"). Screenshot htop chung mot khung hinh
# la bang chung bat buoc, nhung khong doc ra so chinh xac duoc - file CSV nay
# bo sung so lieu do duoc.
#
# Dung: ./scripts/monitor.sh <file-csv-dau-ra> [chu-ky-giay]

set -euo pipefail

OUT="${1:?Thieu duong dan file CSV dau ra}"
INTERVAL="${2:-1}"

# Neo dau/cuoi chuoi: pgrep -f so khop TOAN BO dong lenh, nen mau "node server.js"
# khong neo se dinh ca tien trinh bash bao ngoai (dong lenh cua no co chua chuoi
# do) va cho ra RSS ~2 MB, CPU 0% - hoan toan sai so voi backend that.
PID=$(pgrep -f '^node server\.js$' | head -1)
if [ -z "$PID" ]; then
  echo "Khong tim thay tien trinh backend 'node server.js'" >&2
  exit 1
fi

# Chan sai sot: backend Node that luon chiem hon 30 MB RSS ngay khi vua khoi dong.
RSS_KB=$(ps -p "$PID" -o rss=)
if [ "$RSS_KB" -lt 30000 ]; then
  echo "PID $PID chi chiem ${RSS_KB} KB - gan nhu chac chan bat nham tien trinh" >&2
  exit 1
fi

echo "iso_time,pid,cpu_percent,mem_percent,rss_kb,threads" > "$OUT"
echo "Dang theo doi PID $PID -> $OUT (chu ky ${INTERVAL}s). Ctrl-C de dung." >&2

while kill -0 "$PID" 2>/dev/null; do
  read -r cpu mem rss thr < <(ps -p "$PID" -o %cpu=,%mem=,rss=,nlwp= | tr -s ' ')
  echo "$(date -Iseconds),$PID,$cpu,$mem,$rss,$thr" >> "$OUT"
  sleep "$INTERVAL"
done
