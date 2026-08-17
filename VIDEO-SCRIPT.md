# Kịch bản quay video Task 1

*(HW05 mục 6:95 + mục 11:150 — file làm việc, không nộp)*

## Ba điều kiện bắt buộc, sai một cái là mất điểm

| Điều kiện | Trích đề |
|---|---|
| **Tổng ≥ 6 phút** | *"at least 6 minutes total"* — được cắt thành nhiều clip, mỗi kịch bản một clip |
| **JMeter và resource monitor CHUNG MỘT KHUNG HÌNH** | mục 11:150 — TA kiểm trực tiếp. Không được cắt cảnh qua lại |
| **Giọng tiếng Việt của chính mình** | mục 6:95. Không dùng giọng máy đọc |

Video để **unlisted** trên YouTube, dán link vào `submission/README.md`.

---

## Chuẩn bị trước khi bấm ghi

### 1. Dựng dữ liệu sạch

```bash
cd ~/projects/hw05
./scripts/reset-db.sh          # xoá DB, seed lại 147 sản phẩm + 210 tài khoản
```

### 2. Bố trí màn hình — đây là chỗ quyết định điểm

Mở **hai cửa sổ terminal cạnh nhau**, cùng nhìn thấy được trong một khung hình:

```
┌──────────────────────────┬──────────────────────────┐
│  TRÁI: htop              │  PHẢI: JMeter            │
│  htop -p $(pgrep -x node)│  jmeter -n -t ...        │
└──────────────────────────┴──────────────────────────┘
```

Lệnh cho cửa sổ trái:

```bash
htop -p $(pgrep -x node)
```

Nếu muốn thấy cả CPU tổng thì bỏ `-p`, rồi gõ `F4` lọc chữ `node`.

### 3. Ghi màn hình

Ghi **toàn màn hình** (không ghi từng cửa sổ riêng), để hai terminal luôn nằm chung khung.
Nhớ bật micro.

---

## Kịch bản — 5 phần, tổng ~8 phút

Quay dư 2 phút so với mức tối thiểu để có biên an toàn khi cắt.

---

### Phần 1 — Danh tính và bối cảnh · ~45 giây

**Làm:** ở cửa sổ phải, gõ lần lượt:

```bash
whoami && hostname
git log --oneline | head -5
ls plans/ data/
```

**Nói:**
> "Em là Lý Quốc Thạnh, MSSV 23127262. Đây là bài HW05 Performance Testing trên SUT EShop.
> Máy chạy là `qt-ThinkBook-14-G5-IRH`, trùng với hostname em đã dùng ở HW04.
> Em dùng JMeter chế độ non-GUI. Ba test plan ở thư mục `plans`, ba file CSV riêng cho ba nhóm
> endpoint ở thư mục `data`."

---

### Phần 2 — Kịch bản Load, nhóm read-heavy · ~2 phút

**Làm:** mở nhanh file plan cho thấy tham số, rồi chạy:

```bash
source env.sh
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 \
       -l /tmp/demo-load.jtl
```

**Nói trong lúc nó chạy** — vừa nói vừa chỉ vào htop bên trái:

> "Kịch bản Load bắn vào nhóm read-heavy, tức `GET /api/products` và `?search=`.
> Em chọn ghép Load với read-heavy vì đây là API chỉ đọc, chi phí thấp và ổn định, nên giữ được
> tải đều lâu — điều kiện cần để sau này đo ngưỡng chịu đựng.
>
> Tham số: think-time 800 mili giây cộng trừ 200, vì người dùng thật đọc trang rồi mới bấm tiếp;
> không có think-time thì con số RPS chỉ phản ánh tốc độ sinh request của công cụ.
>
> Bên trái là htop đang bám đúng tiến trình `node server.js`. Thầy có thể thấy CPU và RSS thay đổi
> theo tải. Plan này có 5 assertion thuộc 4 loại — trong đó có một assertion kiểm `Content-Type`,
> vì SUT trả về HTML chứ không phải JSON khi truy vấn lỗi."

**Khi thấy dòng `Err:` khác 0, chỉ vào nó:**

> "Tỉ lệ lỗi khoảng 3,5% này không phải do tải. Toàn bộ đến từ đúng một từ khoá là `O'Neill` —
> dấu nháy đơn làm vỡ câu SQL vì endpoint nối chuỗi trực tiếp. Đây là lỗi chức năng, em đã log
> thành GitHub Issue số 1."

---

### Phần 3 — Kịch bản Stress, nhóm auth-heavy · ~2 phút 30

**Làm:**

```bash
node ../scripts/reset-lockout.js
jmeter -n -t 23127262_Stress_20260813.jmx -Jthreads=400 -Jrampup=60 -Jduration=150 \
       -l /tmp/demo-stress.jtl
```

**Nói:**

> "Kịch bản Stress bắn vào `POST /api/login`. Em ghép Stress với auth-heavy vì ép tới điểm gãy sẽ
> kích hoạt cơ chế khoá tài khoản — đúng thứ đề yêu cầu mô tả quy trình reset.
>
> Trước mỗi lượt em chạy `reset-lockout.js`. Lưu ý là **không** được dùng
> `node backend/database.js` như tài liệu SUT hướng dẫn, vì file đó gọi `DROP TABLE` ngay khi
> được import — em đã mất sạch dữ liệu hai lần vì lệnh này, và đã log thành Issue số 4.
>
> Một phát hiện quan trọng: đề bài ghi khoá sau 3 lần sai, nhưng SUT thật khoá sau **2** lần.
> Mã nguồn cộng 2 vào bộ đếm mỗi lần sai trong khi ngưỡng là 3. Em đo được 10 tài khoản thăm dò,
> mỗi tài khoản nhận đúng 2 lần 401 rồi chuyển sang 403.
>
> Ramp-up đặt 1 luồng mỗi giây, để biến trục thời gian thành trục tải — giây thứ N có đúng N người
> dùng đồng thời, nhờ vậy đọc ra ngưỡng gãy bằng số chứ không phải đoán."

**Chỉ vào htop:**

> "CPU của tiến trình node đang lên. Ở lượt chạy chính thức 2000 luồng, nó chạm 132%, trong khi
> loadavg toàn máy chỉ khoảng 12% trên 16 luồng — nghĩa là nút thắt là **một nhân CPU** do Node
> chạy đơn luồng, không phải phần cứng."

---

### Phần 4 — Kịch bản Spike, nhóm transactional · ~1 phút 30

**Làm:**

```bash
cd .. && ./scripts/reset-db.sh && cd plans
jmeter -n -t 23127262_Spike_20260813.jmx \
       -Jbase=20 -Jbaseduration=120 -Jspike=300 -Jspikeduration=30 -Jspikedelay=30 \
       -l /tmp/demo-spike.jtl
```

**Nói:**

> "Kịch bản Spike bắn vào luồng `POST /api/cart` rồi `POST /api/checkout`. Cả hai endpoint đều cần
> Bearer token, nên plan có một setUp Thread Group đăng nhập trước 50 tài khoản và lưu token vào
> properties.
>
> Hình dạng spike: nền 20 luồng chạy suốt, đến giây thứ 30 thì vọt lên 300 luồng trong 5 giây rồi
> rút. Em tách làm hai Thread Group riêng — nếu gộp chung thì sau khi cú vọt rút đi sẽ không còn
> đường cơ sở nào để đo thời gian hồi phục."

**Khi cú vọt xảy ra, chỉ vào cả hai cửa sổ:**

> "Đây là lúc vọt. Throughput bên phải nhảy lên, RSS bên trái cũng tăng theo. Ở lượt chính thức,
> RSS đi từ 75 lên đỉnh 119,7 MB rồi chỉ về 94 — tức 19 MB không bao giờ được nhả lại, vì biến
> `userCarts` giữ giỏ hàng trong RAM và không có đường xoá."

---

### Phần 5 — Kết quả và phát hiện đáng giá nhất · ~1 phút 30

**Làm:** mở dashboard HTML và chạy công cụ trích số:

```bash
cd .. && python3 scripts/jtl-stats.py summary results/raw/soak-20260813T010601Z.jtl
python3 scripts/jtl-stats.py steady results/raw/soak-20260813T010601Z.jtl 60
```

**Nói:**

> "Ngưỡng chịu đựng đo bằng soak 11 phút: **997 request mỗi giây** giữ đều suốt 10 phút, dao động
> dưới 0,2%, và trần bộ nhớ **161 MB** — RSS chững hẳn từ phút thứ 8, tức đường đọc không rò rỉ.
>
> Điểm gãy là **1 800 người dùng đồng thời**, tại đó ba chỉ báo vỡ cùng lúc: p95 nhảy gấp ba,
> tỉ lệ lỗi tăng gấp ba, và thời gian bắt tay TCP nhảy từ 1 mili giây lên 1020 — nghĩa là hàng đợi
> kết nối của socket đã tràn.
>
> Phát hiện em thấy đáng giá nhất lại không nằm ở SUT mà ở chính công cụ đo. Dashboard HTML của
> JMeter báo p95 của lượt Stress là 1671 mili giây, nhưng giá trị thật tính từ log thô chỉ là
> **237**. Nguyên nhân là JMeter mặc định chỉ tính phân vị trên 20 nghìn mẫu cuối cùng, mà lượt đó
> có 770 nghìn mẫu. Em đã phải sửa bốn con số trong báo cáo của mình vì tin dashboard."

---

## Soát trước khi tải lên

- [ ] Tổng thời lượng **≥ 6 phút**
- [ ] Mọi cảnh có JMeter đang chạy đều **thấy được htop trong cùng khung**
- [ ] Có giọng nói tiếng Việt của mình xuyên suốt, không phải giọng máy
- [ ] Có đoạn cho thấy `hostname` = `qt-ThinkBook-14-G5-IRH`
- [ ] Đặt chế độ **unlisted**, không phải private
- [ ] Dán link vào `submission/README.md` mục "Video demo" và bảng biến trong `CLAUDE.md`

---

## Nếu bí thời gian

Cắt Phần 5 xuống còn 45 giây và bỏ đoạn mở dashboard — vẫn đủ 6 phút. **Không được cắt** Phần 3
(quy trình reset lockout) vì đó là mục đề chấm riêng ở 6:93.
