#!/usr/bin/env python3
"""
Trích số liệu THẬT từ file .jtl thô của JMeter.

Vì sao cần: đề mục 6:103 bắt mỗi lỗi diễn giải của AI phải kèm "the correct value
from your raw .jtl log". Công cụ này tính trực tiếp từ log thô, KHÔNG đọc
statistics.json do JMeter sinh — nhờ vậy con số đưa vào báo cáo truy ngược được
tới từng dòng log, và kiểm chứng lại được bằng chính lệnh đã dùng.

Cách dùng:
  python3 scripts/jtl-stats.py summary  <file.jtl>          # thống kê theo từng sampler
  python3 scripts/jtl-stats.py errors   <file.jtl>          # phân rã nguyên nhân lỗi
  python3 scripts/jtl-stats.py timeline <file.jtl> [giây]   # diễn biến theo thời gian
  python3 scripts/jtl-stats.py threads  <file.jtl> [giây]   # tải đồng thời và độ trễ tương ứng
  python3 scripts/jtl-stats.py steady   <file.jtl> [giây]   # throughput ở trạng thái ổn định
"""

import csv
import sys
from collections import defaultdict


def pct(sorted_vals, p):
    if not sorted_vals:
        return 0
    k = int(len(sorted_vals) * p)
    return sorted_vals[min(k, len(sorted_vals) - 1)]


def load(path):
    with open(path, newline="") as f:
        for row in csv.DictReader(f):
            yield row


def cmd_summary(path):
    by = defaultdict(lambda: {"el": [], "err": 0, "t0": None, "t1": None})
    tot = {"el": [], "err": 0, "t0": None, "t1": None}
    for r in load(path):
        el, ts = int(r["elapsed"]), int(r["timeStamp"])
        ok = r["success"] == "true"
        for d in (by[r["label"]], tot):
            d["el"].append(el)
            if not ok:
                d["err"] += 1
            d["t0"] = ts if d["t0"] is None else min(d["t0"], ts)
            d["t1"] = ts if d["t1"] is None else max(d["t1"], ts)

    print(f"\nNguồn: {path}")
    print(f"{'Sampler':45} {'mẫu':>8} {'lỗi':>7} {'%lỗi':>6} {'tb':>7} "
          f"{'p50':>6} {'p90':>7} {'p95':>7} {'p99':>8} {'max':>8} {'req/s':>8}")
    print("-" * 125)
    for label in list(by) + ["TỔNG"]:
        d = tot if label == "TỔNG" else by[label]
        v = sorted(d["el"])
        n = len(v)
        dur = max((d["t1"] - d["t0"]) / 1000, 0.001)
        print(f"{label[:45]:45} {n:>8} {d['err']:>7} {d['err']/n*100:>5.2f}% "
              f"{sum(v)/n:>7.2f} {pct(v,.5):>6} {pct(v,.9):>7} {pct(v,.95):>7} "
              f"{pct(v,.99):>8} {v[-1]:>8} {n/dur:>8.1f}")
    print(f"\nThời lượng: {(tot['t1']-tot['t0'])/1000:.1f} giây")
    print("Ghi chú: cột req/s ở đây là trung bình TOÀN LƯỢT, đã gồm cả giai đoạn ramp-up.")
    print("        Muốn con số ở trạng thái ổn định, dùng lệnh con 'steady'.")


def cmd_errors(path):
    causes = defaultdict(int)
    urls = defaultdict(int)
    codes = defaultdict(int)
    total = err = 0
    for r in load(path):
        total += 1
        if r["success"] == "true":
            continue
        err += 1
        code = r["responseCode"]
        codes[code] += 1
        msg = (r.get("failureMessage") or "").strip()[:90]
        causes[f"HTTP {code} | {msg or '(assertion không kèm thông báo)'}"] += 1
        urls[r.get("URL", "")] += 1

    print(f"\nNguồn: {path}")
    print(f"Tổng mẫu {total} · lỗi {err} ({err/total*100:.2f}%)\n")
    if not err:
        print("Không có mẫu lỗi nào.")
        return
    print("Phân rã theo nguyên nhân:")
    for k, v in sorted(causes.items(), key=lambda x: -x[1]):
        print(f"  {v:>7} ({v/err*100:>5.1f}% số lỗi)  {k}")
    print("\nMã phản hồi của các mẫu bị đánh là lỗi:")
    for k, v in sorted(codes.items(), key=lambda x: -x[1]):
        note = "  <- HTTP thành công, trượt vì assertion" if k == "200" else ""
        print(f"  {v:>7}  {k}{note}")
    print("\nURL sinh lỗi nhiều nhất:")
    for k, v in sorted(urls.items(), key=lambda x: -x[1])[:5]:
        print(f"  {v:>7}  {k[:100]}")


def cmd_timeline(path, bucket=30):
    b = defaultdict(lambda: {"el": [], "err": 0})
    t0 = None
    for r in load(path):
        ts = int(r["timeStamp"])
        t0 = ts if t0 is None else min(t0, ts)
    for r in load(path):
        k = (int(r["timeStamp"]) - t0) // (bucket * 1000)
        b[k]["el"].append(int(r["elapsed"]))
        if r["success"] != "true":
            b[k]["err"] += 1

    print(f"\nNguồn: {path}  ·  mỗi dòng = {bucket} giây")
    print(f"{'giây':>12} {'mẫu':>8} {'req/s':>8} {'tb':>8} {'p95':>8} {'p99':>9} {'max':>9} {'%lỗi':>7}")
    print("-" * 80)
    for k in sorted(b):
        v = sorted(b[k]["el"])
        n = len(v)
        print(f"{k*bucket:>5}-{(k+1)*bucket:<6} {n:>8} {n/bucket:>8.1f} {sum(v)/n:>8.2f} "
              f"{pct(v,.95):>8} {pct(v,.99):>9} {v[-1]:>9} {b[k]['err']/n*100:>6.2f}%")


def cmd_threads(path, bucket=30):
    b = defaultdict(lambda: {"el": [], "err": 0, "thr": 0})
    t0 = None
    for r in load(path):
        ts = int(r["timeStamp"])
        t0 = ts if t0 is None else min(t0, ts)
    for r in load(path):
        k = (int(r["timeStamp"]) - t0) // (bucket * 1000)
        b[k]["el"].append(int(r["elapsed"]))
        b[k]["thr"] = max(b[k]["thr"], int(r.get("allThreads", 0) or 0))
        if r["success"] != "true":
            b[k]["err"] += 1

    print(f"\nNguồn: {path}  ·  mỗi dòng = {bucket} giây")
    print("Cột 'luồng' là số luồng đồng thời cao nhất quan sát được trong khoảng đó.\n")
    print(f"{'giây':>12} {'luồng':>7} {'req/s':>8} {'tb':>8} {'p95':>9} {'%lỗi':>7}")
    print("-" * 60)
    for k in sorted(b):
        v = sorted(b[k]["el"])
        n = len(v)
        print(f"{k*bucket:>5}-{(k+1)*bucket:<6} {b[k]['thr']:>7} {n/bucket:>8.1f} "
              f"{sum(v)/n:>8.2f} {pct(v,.95):>9} {b[k]['err']/n*100:>6.2f}%")


def cmd_steady(path, bucket=60):
    b = defaultdict(int)
    t0 = None
    for r in load(path):
        ts = int(r["timeStamp"])
        t0 = ts if t0 is None else min(t0, ts)
    for r in load(path):
        b[(int(r["timeStamp"]) - t0) // (bucket * 1000)] += 1

    rates = [(k, n / bucket) for k, n in sorted(b.items())]
    if len(rates) < 3:
        print("Lượt chạy quá ngắn để tách trạng thái ổn định.")
        return
    # bo khoang dau (ramp-up) va khoang cuoi (thread ket thuc so le)
    mid = [r for _, r in rates[1:-1]]
    print(f"\nNguồn: {path}")
    print(f"Throughput theo từng {bucket} giây:")
    for k, r in rates:
        tag = ""
        if k == rates[0][0]:
            tag = "  <- bỏ: đang ramp-up"
        elif k == rates[-1][0]:
            tag = "  <- bỏ: luồng kết thúc so le"
        print(f"  giây {k*bucket:>5}-{(k+1)*bucket:<5} {r:>8.1f} req/s{tag}")
    print(f"\nTRẠNG THÁI ỔN ĐỊNH ({len(mid)} khoảng):")
    print(f"  thấp nhất  {min(mid):.1f} req/s")
    print(f"  cao nhất   {max(mid):.1f} req/s")
    print(f"  trung bình {sum(mid)/len(mid):.1f} req/s")
    print(f"  biên độ    {(max(mid)-min(mid))/ (sum(mid)/len(mid)) *100:.2f}%")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    cmd, path = sys.argv[1], sys.argv[2]
    arg = int(sys.argv[3]) if len(sys.argv) > 3 else None
    fns = {
        "summary": lambda: cmd_summary(path),
        "errors": lambda: cmd_errors(path),
        "timeline": lambda: cmd_timeline(path, arg or 30),
        "threads": lambda: cmd_threads(path, arg or 30),
        "steady": lambda: cmd_steady(path, arg or 60),
    }
    if cmd not in fns:
        print(__doc__)
        sys.exit(1)
    fns[cmd]()
