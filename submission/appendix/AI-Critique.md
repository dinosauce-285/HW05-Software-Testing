# AI Critique - HW05 Performance Testing

**Sinh viên:** Lý Quốc Thạnh - 23127262
**Công cụ AI:** Claude Opus 5 (Claude Code CLI)

---

AI sai ở đâu? Trong 12 artifact được audit, bốn cái phải viết lại, và cả bốn rơi vào cùng một nhóm:
những chỗ đòi hiểu ngữ cảnh vận hành thật. Nó chọn `ps -o %cpu` để đo CPU - cách viết phổ biến
nhất, nhưng đó là trung bình cộng dồn từ lúc tiến trình khởi động, sai bản chất khi đo hiệu năng.
Nó chép lệnh reset dữ liệu từ tài liệu của SUT mà không mở file ra xem, trong khi lệnh ấy xoá sạch
cơ sở dữ liệu. Nó viết assertion đúng ý định nghiệp vụ nhưng bỏ qua việc JMeter có hai tầng phán
quyết độc lập, khiến phản hồi đúng ý đồ bị tính là lỗi.

Vì sao nó không tự bắt được? Vì không lỗi nào làm chương trình dừng. Tất cả đều chạy trơn tru và
âm thầm cho ra số sai. AI không có cơ chế tự hỏi "con số này có hợp lý về mặt vật lý không" - nó
báo RSS 2,1 MB cho một tiến trình Node đang phục vụ 45 request mỗi giây mà không thấy bất thường.
Đáng nói hơn, cùng một lỗi `pgrep` khớp nhầm chính tiến trình gọi nó đã tái phát ba lần, dù lần đầu
đã được ghi vào nhật ký.

Tôi rút ra hai nguyên tắc. Thứ nhất, nghiệm thu bằng "chạy được không" là vô dụng với loại lỗi này;
phải nghiệm thu bằng "con số có hợp lý không". Thứ hai, prompt định hình lỗi: chính câu tôi viết -
*"đừng viết kiểu có thể là"* - đã ép AI bịa ra cơ chế nhân quả cho một hiện tượng mà dữ liệu không
giải thích được. Khi thiếu dữ liệu, phải cho phép AI nói là thiếu dữ liệu.
