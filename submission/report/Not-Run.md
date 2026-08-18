# Những phần không chạy được / phải điều chỉnh - và lý do

Ghi tại thời điểm phát sinh, không dựng lại cuối bài.

---

## 1. Không cài được JMeter và Java ở mức hệ thống

**Ràng buộc:** máy dùng Ubuntu 26.04, tài khoản `qt` không có quyền `sudo` không mật khẩu
(`sudo -n true` -> *"interactive authentication is required"*), và `/usr/lib/jvm/` không tồn tại -
tức là chưa từng có JRE nào được cài.

**Cách xử lý:** tải bản portable đặt trong `tools/` và nạp qua `env.sh`:

```bash
source env.sh    # JAVA_HOME=tools/jdk-21.0.12+8-jre, JMETER_HOME=tools/apache-jmeter-5.6.3
```

**Ảnh hưởng tới kết quả đo:** không có. JMeter chạy non-GUI đầy đủ chức năng, sinh `.jtl` và
HTML dashboard bình thường. `tools/` được gitignore vì là nhị phân bên thứ ba.

## 2. Kịch bản Stress phải chạy 4 lượt thay vì 1

**Vấn đề:** mức tải thiết kế ban đầu (250 luồng) **không làm gãy được SUT** - 0% lỗi, p95 = 3 ms.
Nguyên nhân: `/api/login` so sánh mật khẩu dạng plaintext (`server.js:46`), không băm bcrypt, nên
chi phí mỗi request gần như bằng 0. Ở mức đó, throughput bị chặn bởi **think-time của kịch bản**
(250 luồng / 0,4 s ~ 625 req/s) chứ không phải bởi server.

**Cách xử lý:** leo thang có chủ đích 250 -> 800 -> 2 000 luồng, giữ lại **cả 4 file `.jtl`** làm bằng
chứng cho quá trình tìm ngưỡng. Chi tiết ở `results/raw/MANIFEST.md`.

**Đây không phải phần bị bỏ** - ngược lại, chính hai lượt "không gãy" mới là bằng chứng cho kết
luận đáng giá nhất của kịch bản: với endpoint rẻ như vậy, công cụ đo mới là thứ quyết định
throughput cho tới tận mốc ~1 000 luồng.

## 3. Không đo được CPU của JMeter theo cách chính xác trong lượt gãy

**Vấn đề:** vòng lặp lấy mẫu CPU của JMeter tự khớp chính nó qua `pgrep -f` (chi tiết ở
`AI-Review-Fix-Log.md` dòng 5), cho ra `CPU=0%` vô nghĩa. Lượt chạy đã kết thúc nên không dựng lại
được số đó cho đúng lượt đó.

**Cách bù:** chạy thêm một lượt ngắn 120 s tại vùng gãy (1 800 luồng) với phép đo đã sửa
(`stress-bottleneck-check-*`), và rút kết luận về nút thắt từ hai nguồn đo **đúng phương pháp**:
CPU tức thời của `node` đọc từ `/proc/<pid>/stat`, và `loadavg` toàn máy. Kết luận không đổi.

## 4. Chưa làm - thuộc phần sinh viên tự thực hiện

Bốn mục dưới đây đề bắt buộc nhưng **không thể tự động hoá**, phải do sinh viên trực tiếp làm:

| Mục | Trích đề | Trạng thái |
|---|---|---|
| Screenshot JMeter **+ htop cùng một khung hình** | 6:93, 11:150 | [x] 3 ảnh - chụp trên màn hình X ảo, xem mục 6 |
| Hardware report (screenfetch/dxdiag + bảng spec), **hostname khớp HW04** | 6:93, 11:151 | [x] `spec.md` + 2 ảnh, hostname `qt-ThinkBook-14-G5-IRH` |
| Video demo >= 6 phút, giọng tiếng Việt của sinh viên | 6:95 | [ ] |
| Tạo GitHub Issue + đính ảnh bằng chứng cho 13 lỗi | 6:96 | [x] **đã xong** - issue `#1`...`#13` |

## 6. Ảnh chụp màn hình phải dựng màn hình X ảo

**Ràng buộc:** phiên desktop chạy Wayland. Ba đường chụp màn hình thông thường đều bị chặn:

| Cách | Kết quả |
|---|---|
| GNOME Shell qua D-Bus | `AccessDenied: Screenshot is not allowed` - GNOME 45+ chặn |
| `import -window root` (ImageMagick) | Thất bại: Wayland không có root window kiểu X |
| `gnome-screenshot`, `grim`, `scrot`, `spectacle` | Không cài, và không có quyền `sudo` để cài |

**Cách xử lý:** dựng màn hình X ảo bằng `Xvfb`, chạy `gnome-terminal` với `GDK_BACKEND=x11` trong
đó (bắt buộc ép X11, nếu không gnome-terminal vẫn bám Wayland và ảnh ra đen sì), dùng `screen` chia
đôi khung - `htop` ở trên, JMeter ở dưới - rồi chụp bằng `import` trên màn hình ảo.

Hai script chạy lại được: `scripts/capture-monitor-shot.sh` và `scripts/capture-hardware-shot.sh`.

**Điều cần nói thẳng:** tiến trình, tải và số liệu trong ảnh đều là thật - nhưng đây **không phải
ảnh chụp màn hình laptop của sinh viên**. Dòng `Display (screen): 1400x800` trong ảnh `fastfetch`
chính là màn hình ảo. Bằng chứng "cùng một khung hình" theo đúng tinh thần mục 11:150 (màn hình thật
của sinh viên, giọng thật) nằm ở **video demo**, nơi không dùng màn hình ảo.

## 7. Không làm - có cân nhắc và quyết định bỏ

| Mục | Lý do bỏ |
|---|---|
| Viết thêm script k6 để lấy "bonus" (mục 8:119) | Thang điểm mục 15:183-191 **không có dòng nào cộng điểm cho k6**, tổng vẫn chốt 100. Công sức bỏ ra không đổi lấy được điểm nào |
| Đẩy Stress vượt 2 000 luồng | Tại 2 000 luồng đã có đủ dấu hiệu gãy (throughput đạt đỉnh rồi giảm, p95 = 1 671 ms, 1,29% lỗi). Đẩy tiếp chỉ làm JMeter trở thành nút thắt và số đo mất ý nghĩa |
