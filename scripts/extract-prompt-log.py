#!/usr/bin/env python3
"""
Trích nhật ký tương tác AI nguyên văn từ transcript của Claude Code.

Đề mục 9:130-134 đòi mỗi lượt tương tác phải ghi: tên công cụ AI, ngày giờ,
prompt nguyên văn, và output của AI. Transcript đầy đủ nằm ở
~/.claude/projects/-home-qt-projects-hw05/*.jsonl

Chạy: python3 scripts/extract-prompt-log.py
"""
import json, glob, os, re
from datetime import datetime, timezone, timedelta

SRC = os.path.expanduser("~/.claude/projects/-home-qt-projects-hw05")
OUT = os.path.join(os.path.dirname(__file__), "..", "submission", "appendix", "AI-Prompt-Log.md")
VN = timezone(timedelta(hours=7))
SKIP = ("<task-notification>", "[Image:", "[Request interrupted", "<system-reminder>",
        "<local-command", "Caveat:", "<command-name>", "<user-memory")
MAX_OUT = 2500          # cat bot output qua dai, co ghi ro da cat


def vn_time(ts):
    if not ts:
        return "?"
    return datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone(VN).strftime("%d/%m/%Y %H:%M:%S")


def load(path):
    for line in open(path, encoding="utf-8"):
        try:
            yield json.loads(line)
        except Exception:
            continue


def blocks(rec):
    c = rec.get("message", {}).get("content")
    return c if isinstance(c, list) else []


sessions = []
for f in glob.glob(os.path.join(SRC, "*.jsonl")):
    recs = list(load(f))
    turns, pending = [], None
    for r in recs:
        t = r.get("type")
        if t == "user":
            bl = blocks(r)
            if not bl or bl[0].get("type") != "text":
                continue
            txt = (bl[0].get("text") or "").strip()
            if not txt or txt.startswith(SKIP):
                continue
            if pending:
                turns.append(pending)
            pending = {"time": vn_time(r.get("timestamp")), "raw": r.get("timestamp") or "",
                       "prompt": txt, "out": [], "tools": []}
        elif t == "assistant" and pending is not None:
            for b in blocks(r):
                if b.get("type") == "text" and b.get("text", "").strip():
                    pending["out"].append(b["text"].strip())
                elif b.get("type") == "tool_use":
                    pending["tools"].append(b.get("name", "?"))
    if pending:
        turns.append(pending)
    if turns:
        sessions.append((os.path.basename(f)[:8], turns))

# Sap xep theo moc thoi gian cua luot dau tien, khong theo mtime cua file:
# phien dang mo van bi ghi tiep nen mtime khong phan anh thu tu that.
sessions.sort(key=lambda x: x[1][0]["raw"])

total = sum(len(t) for _, t in sessions)
lines = [
    "# AI Prompt Log — nhật ký tương tác nguyên văn",
    "",
    "*(HW05 mục 9:130-134 — \"include the following information for each interaction: "
    "Name of the AI tool · Date and time · Your prompt · The AI output\")*",
    "",
    "| Mục | Giá trị |",
    "|---|---|",
    "| **Công cụ AI** | Claude Opus 5 (`claude-opus-5`) qua Claude Code CLI |",
    "| **Sinh viên** | Lý Quốc Thạnh — 23127262 |",
    "| **Bài tập** | HW05 — Performance Testing |",
    f"| **Tổng số lượt tương tác** | **{total}** |",
    f"| **Số phiên làm việc** | {len(sessions)} |",
    "| **Múi giờ** | UTC+7 (giờ Việt Nam) |",
    "",
    "**Nguồn:** trích tự động bằng `scripts/extract-prompt-log.py` từ transcript",
    "`~/.claude/projects/-home-qt-projects-hw05/*.jsonl`.",
    "",
    "**Prompt giữ nguyên văn 100%**, không sửa, không paraphrase — kể cả lỗi chính tả và câu cụt.",
    f"Output của AI cắt ở {MAX_OUT} ký tự mỗi lượt cho gọn; chỗ nào bị cắt đều ghi rõ. Bản đầy đủ nằm",
    "trong transcript gốc và trong chính các artifact đã nộp.",
    "",
    "Bảng audit theo mẫu của Khoa — có verdict và phần sinh viên sửa — nằm ở `AI-Audit-Report.md`.",
    "",
    "---",
    "",
]

idx = 0
for sid, turns in sessions:
    lines += [f"# Phiên `{sid}` — {len(turns)} lượt", ""]
    for t in turns:
        idx += 1
        lines += [
            f"## Lượt {idx} — {t['time']}",
            "",
            "**Prompt (nguyên văn):**",
            "",
            "```text",
            t["prompt"],
            "```",
            "",
        ]
        if t["tools"]:
            seen, order = set(), []
            for x in t["tools"]:
                if x not in seen:
                    seen.add(x); order.append(x)
            lines += [f"**Công cụ AI đã gọi:** {len(t['tools'])} lần — "
                      + ", ".join(f"`{x}`" for x in order), ""]
        out = "\n\n".join(t["out"]).strip()
        if out:
            cut = len(out) > MAX_OUT
            lines += ["**Output AI:**", "", "```text",
                      out[:MAX_OUT] + ("\n\n[... cắt bớt, xem transcript gốc ...]" if cut else ""),
                      "```", ""]
        else:
            lines += ["**Output AI:** (chỉ gọi công cụ, không có phần văn bản)", ""]
        lines += ["---", ""]

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as fh:
    fh.write("\n".join(lines))

print(f"Đã trích {total} lượt tương tác từ {len(sessions)} phiên")
print(f"-> {os.path.relpath(OUT)}  ({os.path.getsize(OUT)/1024:.0f} KB)")
