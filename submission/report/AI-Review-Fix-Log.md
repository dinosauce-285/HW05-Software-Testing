# Nhật ký review & fix output của AI

*(HW05 mục 6:92 — "Report what the AI got wrong or missed... and explain **why** it missed them")*

Mỗi dòng được ghi **ngay tại thời điểm phát hiện và sửa**, không dựng lại vào cuối bài — cột "Vì sao AI trượt" không tái tạo được sau khi đã quên bối cảnh.

Công cụ AI: **Claude Opus 5** (Claude Code CLI).

---

| # | Ngày giờ | File:vị trí | AI sinh gì | Sai chỗ nào | Mình sửa thành | Vì sao AI trượt |
|---|---|---|---|---|---|---|
| 1 | 2026-08-11 09:15 | `scripts/monitor.sh:16` | `PID=$(pgrep -f "node server.js" \| head -1)` để tìm tiến trình backend cần đo tài nguyên | `pgrep -f` so khớp **toàn bộ dòng lệnh**, nên mẫu không neo đã khớp trúng tiến trình `bash -c` bao ngoài — dòng lệnh của nó có chứa chuỗi `node server.js`. Kết quả: toàn bộ 332 mẫu tài nguyên của lượt Load đầu ghi nhầm PID 44059, cho ra **RSS 2.1 MB / CPU 0.0%**, trong khi backend thật là PID 44060 với **RSS 117 MB / CPU 2.2%** | Neo hai đầu mẫu: `pgrep -f '^node server\.js$'`, và thêm chốt chặn từ chối PID nào có RSS dưới 30 MB vì tiến trình Node thật không bao giờ nhỏ vậy | **Đặc điểm môi trường, không phải giới hạn model.** Mẫu `pgrep -f "node server.js"` là cách viết chuẩn và chạy đúng ở hầu hết bối cảnh; nó chỉ hỏng vì lệnh được bọc trong `bash -c` — thứ chỉ tồn tại trong phiên chạy qua công cụ. AI không có cách nào biết dòng lệnh cha sẽ chứa lại chính chuỗi đó. Cái đáng trách hơn là **AI không tự nghi ngờ kết quả**: RSS 2.1 MB cho một tiến trình Node phục vụ 45 req/s là bất khả thi về mặt vật lý, lẽ ra phải có bước kiểm tra tính hợp lý ngay trong script — nên bản sửa bổ sung luôn chốt chặn đó |

| 2 | 2026-08-11 09:30 | `scripts/monitor.sh:34` | Lấy mức chiếm CPU bằng `ps -p $PID -o %cpu=` | `%cpu` của `ps` là **trung bình cộng dồn từ lúc tiến trình khởi động**, không phải mức tức thời. Backend đã chạy rảnh 20 phút trước khi bắn tải, nên một đợt tải 5 phút bị pha loãng và cột CPU đứng phẳng ở `2.1%` suốt cả lượt chạy — con số này mà đưa vào báo cáo là tự tạo ra một lỗi diễn giải metric, đúng loại lỗi mà Task 2 yêu cầu đi săn | Đọc trực tiếp `utime + stime` từ `/proc/<pid>/stat`, lấy hiệu giữa hai lần lấy mẫu rồi chia cho `CLK_TCK` và chu kỳ. Kiểm chứng: bắn 300 request liên tiếp thì cột CPU nhảy `0% → 29% → 17% → 0%`, trong khi `ps %cpu` vẫn đứng yên `2.1%`. Thêm luôn `vsz_kb` và `open_fds` để theo dõi rò rỉ tài nguyên | **Giới hạn model kiểu "mặc định trôi theo thói quen".** `ps -o %cpu` là cách viết phổ biến nhất khi hỏi "đo CPU của tiến trình trong shell", và AI chọn đúng cái phổ biến đó mà không xét tới **ngữ cảnh đo lường** — rằng đây là bài kiểm thử hiệu năng, nơi phân biệt "tức thời" với "trung bình đời sống tiến trình" là bản chất chứ không phải chi tiết vặt. Prompt cũng không nêu rõ yêu cầu này, nên đây là lỗi kép: prompt thiếu ràng buộc và model không tự đặt câu hỏi về tính hợp lệ của đơn vị đo |

---

## Ghi chú phương pháp

Số liệu tài nguyên của lượt Load đầu tiên (`load-20260811T022251Z-resource.csv`) đã bị **huỷ bỏ, không dùng trong báo cáo**. Lượt chạy đã được thực hiện lại sau khi sửa script. File `.jtl` của lượt đầu vẫn hợp lệ vì lỗi chỉ nằm ở khâu đo tài nguyên, không đụng tới phép đo độ trễ.
