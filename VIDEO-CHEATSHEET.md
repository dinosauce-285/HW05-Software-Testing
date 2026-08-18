# Bảng chạy khi quay - 3 scenario: lệnh - htop - lời nói

*(file làm việc, không nộp - bản rút gọn của `VIDEO-SCRIPT.md` để liếc trong lúc quay)*

Mọi con số htop trong file này đều **đo thật trên chính máy `qt-ThinkBook-14-G5-IRH`**, không phải ước lượng.

---

## ! Câu "một luồng mỗi giây" đang sai với lượt chính thức

`VIDEO-SCRIPT.md` Phần 3 viết *"em đặt tăng đúng một luồng mỗi giây... tại giây thứ N thì có đúng N
người dùng đồng thời"*. Hồ sơ ramp thật rút từ `results/raw/stress-20260813T003655Z.jtl`:

```
t=  0s ->   12 luồng      t=180s -> 1213 luồng
t= 30s ->  213 luồng      t=210s -> 1413 luồng
t= 60s ->  413 luồng      t=240s -> 1625 luồng
t= 90s ->  613 luồng      t=270s -> 1862 luồng
t=120s ->  813 luồng      t=300s -> 2000 luồng
t=150s -> 1013 luồng      (giữ 2000 tới hết 380s)
```

Tức **6,7 luồng/giây**, không phải 1. Con số 1 luồng/giây chỉ đúng với lượt dò đầu tiên
(250 luồng / 250 giây). Nói nhầm câu này trên camera thì buổi vấn đáp bị hỏi *"vậy 1800 luồng là
giây thứ 1800 à?"* là kẹt - điểm gãy thật rơi vào **giây thứ 262**.

**Câu thay thế:**

> "Ramp-up tuyến tính với tốc độ không đổi - lượt chính thức là hai nghìn luồng trong ba trăm giây,
> tức khoảng sáu phẩy bảy luồng mỗi giây. Nhờ tốc độ không đổi mà trục thời gian ánh xạ thẳng sang
> trục tải, nên em đọc được điểm gãy một nghìn tám trăm luồng rơi đúng vào giây thứ hai trăm sáu
> mươi hai."

Tiện: mức demo `400 luồng / 60 giây` cũng ra đúng **6,7 luồng/giây** - cùng tốc độ với lượt chính
thức, chỉ ngắn hơn. Nói được câu đó là ăn điểm.

**Hai file khác còn mang con số cũ, cần sửa trước khi nộp:**

- `VIDEO-SCRIPT.md` Phần 3 - đoạn *"Về ramp-up, em đặt tăng đúng một luồng mỗi giây"*
- `submission/report/Main-Report.md:259` - ô *"Tăng đều 1 luồng/giây biến trục thời gian thành trục tải:
  tại giây thứ N có đúng N người dùng đồng thời"*

---

# (1) LOAD

```bash
cd ~/projects/hw05/plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 -l /tmp/demo-load.jtl
```

**htop sẽ làm gì:** CPU% từ `0` leo dần trong 60 giây ramp lên **14-18%** rồi đứng phẳng.
RES bò từ `77000` lên khoảng `118000` (77 -> 115 MB). Chỉ 1-2 thanh CPU sáng.

**Nói:**

- Ghép Load với read-heavy vì endpoint chỉ đọc, chi phí thấp và ổn định -> giữ tải đều lâu được, là
  điều kiện cần để sau này đo ngưỡng phần cứng bằng số
- Think-time 800ms +/- 200: người thật đọc trang rồi mới bấm. Bỏ think-time thì req/s chỉ phản ánh
  tốc độ sinh tải của công cụ
- Ramp-up 60 giây, tránh cú sốc lúc khởi động - cú sốc là việc của Spike
- Chỉ vào CPU 17%: **nút thắt là think-time trong kịch bản, không phải server**
- Chỉ vào `Err: 3.4%`: toàn bộ đến từ đúng một từ khoá `O'Neill`, dấu nháy đơn làm vỡ câu SQL vì
  endpoint nối chuỗi thẳng vào truy vấn. Lỗi chức năng kèm SQL injection, không phải vấn đề hiệu
  năng. Đã log GitHub Issue #1
- Plan có 5 assertion thuộc 4 loại, trong đó có kiểm `Content-Type` vì khi lỗi hệ thống trả HTML chứ
  không phải JSON - chỉ kiểm mã 200 là bỏ sót hoàn toàn

---

# (2) STRESS

```bash
node ../scripts/reset-lockout.js
jmeter -n -t 23127262_Stress_20260813.jmx -Jthreads=400 -Jrampup=60 -Jduration=90 -l /tmp/demo-stress.jtl
```

**htop sẽ làm gì** *(đo thật)*: CPU leo gần như tuyến tính - giây 6 là `10%`, giây 21 là `38%`,
giây 41 là `60%`, giây 56 là `75%`, giây 76-90 chạm **83-87%**. RES từ `118000` lên `148000`.
Vẫn chỉ 1-2 thanh sáng trong 16 thanh.

**Nói:**

- Nói về `reset-lockout.js` **trước khi gõ lệnh jmeter**: tuyệt đối không dùng `node backend/database.js`
  như tài liệu SUT hướng dẫn, vì file đó gọi `initDatabase()` ngay khi import mà hàm này mở đầu bằng
  6 lệnh `DROP TABLE` -> mất sạch 210 tài khoản và 147 sản phẩm. Đã dính bẫy 2 lần, log GitHub Issue #4
- Ghép Stress với auth-heavy vì ép tới gãy sẽ kích hoạt khoá tài khoản - đúng thứ đề bắt mô tả quy
  trình reset
- Đề ghi khoá sau 3 lần sai, **hệ thống thật khoá sau 2 lần**: mã nguồn cộng 2 vào bộ đếm mỗi lần
  sai trong khi ngưỡng là 3. Kiểm chứng bằng 10 tài khoản thăm dò riêng, mỗi tài khoản nhận đúng 2
  lần 401 rồi chuyển 403
- Plan tách 2 nhánh bằng If Controller vì 403 "đã khoá" trả rất nhanh (hệ thống kiểm khoá trước cả
  bước so mật khẩu) - trộn chung thì throughput đẹp giả tạo
- Ramp-up: **dùng câu đã sửa ở đầu file**
- **Chỉ vào cột CPU đang leo**: mỗi luồng thêm vào là một nấc CPU. **Chỉ vào dãy 16 thanh**: chỉ một
  nhân sáng - Node đơn luồng, nút thắt là phần mềm chứ không phải máy yếu. Lượt chính thức CPU chạm
  132% trong khi load average toàn máy chỉ 12%
- Ở mức demo này chưa gãy (`Err 0%`). Điểm gãy 1800 luồng đo ở lượt chính thức: p95 nhảy 399 ->
  1228ms, lỗi 0,63 -> 1,94%, và thời gian bắt tay TCP nhảy 1ms -> 1020ms. Chỉ báo thứ ba rõ nhất -
  hàng đợi kết nối tràn, không phải xử lý chậm đi

---

# (3) SPIKE

```bash
cd .. && ./scripts/reset-db.sh && cd plans
jmeter -n -t 23127262_Spike_20260813.jmx -Jbase=20 -Jbaseduration=120 -Jspike=300 -Jspikeduration=30 -Jspikedelay=30 -l /tmp/demo-spike.jtl
```

**htop sẽ làm gì** *(đo thật)*: 30 giây đầu gần như đứng yên - CPU `2-3%`, RES `83000->88000`.
Giây 33 bắt đầu vọt, giây 37-41 **RES nhảy 27 MB trong 4 giây** lên `116000`, CPU lên `23-25%`.
Giữ đỉnh tới giây 61. Rồi **CPU sập về `2-4%` nhưng RES vẫn đứng ở `118000`**.

**Nói:**

- Vừa reset DB vì `POST /api/checkout` không kiểm giỏ hàng, không kiểm tồn kho, insert thẳng vào
  bảng `orders` - một lượt để lại hàng nghìn đơn rác
- Cả hai endpoint cần `Authorization: Bearer`, nên plan có setUp Thread Group login trước 50 tài
  khoản, dùng JSON Extractor lấy token lưu vào properties
- Không login lại mỗi vòng lặp, vì làm vậy thì mỗi giao dịch gánh thêm một request auth và số liệu
  nhóm transactional bị trộn với nhóm auth - hai nhóm đề bắt tách bạch
- Hình dạng: nền 20 luồng chạy suốt, giây 30 vọt lên 300 trong 5 giây, giữ 30 giây rồi rút. Tách 2
  Thread Group riêng vì gộp chung thì sau khi vọt rút đi không còn đường cơ sở nào để đo hồi phục
- **Chỉ vào RES lúc vọt**: nhảy 27 MB trong 4 giây
- **Chỉ vào giây 65**: CPU đã về nền mà RES vẫn đứng nguyên - hồi phục tốc độ nhưng chưa hồi phục bộ
  nhớ. Nguyên nhân: giỏ hàng giữ trong RAM bằng biến toàn cục, chỉ ghi thêm không có đường xoá, kể
  cả sau khi đặt hàng thành công
- Lượt chính thức: hấp thụ trọn cú vọt gấp 20 lần **không mất request nào**, hồi phục dưới 1 giây,
  nhưng RES đi 75 -> 119,7 -> chỉ về 94 MB

! Ở lượt demo ngắn, bộ nhớ **có thể nhả lại** (đo được RES về 84 MB ở giây 101). Nên khi trích con
số 119,7 -> 94 phải nói rõ **"ở lượt chính thức"**, đừng chỉ vào màn hình mà khẳng định nó không nhả.

---

## Phụ lục - trạng thái máy trước khi quay

| Việc | Lệnh | Dấu hiệu đạt |
|---|---|---|
| Chạy SUT + seed | `./scripts/reset-db.sh` | in ra `San pham: 152` / `Don hang: 0` / `Da reset xong.` |
| Nạp JMeter | `source env.sh` (từ `~/projects/hw05`) | `jmeter --version 2>/dev/null` ra `5.6.3` |
| Pane trái | `htop -d 10` -> `F4` gõ `node server.js` -> `Enter` -> `Shift+H` | còn **đúng 1 dòng** trắng |
| Kiểm SUT | `curl -s localhost:3000/api/products \| head -c 80` | ra JSON |

Đọc RES: htop trên máy này in **kilobyte thô**. `89540` nghĩa là **87 MB**, không phải 89 nghìn MB.

Ba cột cần nhìn: **CPU%** (theo 1 nhân, >100% là bình thường), **RES** (RAM thật), **TIME+** (nhảy =
đang làm việc). Bỏ qua **VIRT** và **MEM%**.

---

# Danh sách lệnh theo thứ tự quay

## Chuẩn bị - chưa bật OBS

Pane TRÁI:
```bash
htop -d 10
```
rồi `F4` -> gõ `node server.js` -> `Enter` -> `Shift+H` (còn đúng 1 dòng).

Pane PHẢI:
```bash
cd ~/projects/hw05
./scripts/reset-db.sh
source env.sh
clear
```

## Phần 1 - mở đầu (~50s)

```bash
whoami && hostname
ls plans/ data/
```

## Phần 2 - Load (~2:10)

```bash
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 -l /tmp/demo-load.jtl
```

## Phần 3 - Stress (~2:40)

```bash
node ../scripts/reset-lockout.js
jmeter -n -t 23127262_Stress_20260813.jmx -Jthreads=400 -Jrampup=60 -Jduration=90 -l /tmp/demo-stress.jtl
```

## Phần 4 - Spike (~2:15)

```bash
cd .. && ./scripts/reset-db.sh && cd plans
jmeter -n -t 23127262_Spike_20260813.jmx -Jbase=20 -Jbaseduration=120 -Jspike=300 -Jspikeduration=30 -Jspikedelay=30 -l /tmp/demo-spike.jtl
```

Nên **cắt clip ngay trước lệnh này**: `reset-db.sh` mất khá lâu để seed 200 tài khoản, quay vào
là dead air. Chạy khi không ghi, rồi mở clip mới bằng cách cuộn lên cho thấy output `Don hang: 0`.

## Phần 5 - ngưỡng chịu đựng (~1:30, chạy tức thì)

```bash
cd ..
python3 scripts/jtl-stats.py steady results/raw/soak-20260813T010601Z.jtl 60
python3 scripts/jtl-stats.py summary results/raw/stress-20260813T003655Z.jtl
```

## Lưu ý xuyên suốt

- Terminal mới mở phải `source env.sh` lại (từ `~/projects/hw05`), nếu không sẽ báo `jmeter: command not found`
- Sau `reset-db.sh` thì PID backend đổi - bộ lọc `F4` của htop tự bắt tiến trình mới, không phải làm lại
- Lượt demo ghi ra `/tmp/`, **không có `-e -o`** -> không đụng tới bộ bằng chứng đã nộp trong `results/`
