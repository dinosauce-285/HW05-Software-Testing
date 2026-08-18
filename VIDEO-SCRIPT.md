# Kịch bản quay video Task 1 - bản đọc nguyên văn

*(HW05 mục 6:95 + mục 11:150 - file làm việc, không nộp)*

> **Cách dùng:** phần in thường là **lời đọc nguyên văn** - cứ đọc đúng như vậy.
> Phần trong khung xám là **lệnh gõ**. Phần in nghiêng đầu mỗi mục là **ghi chú thao tác**, không đọc.

**Lời thoại: 1 745 từ** -> đọc ở tốc độ bình thường (130-150 từ/phút) ra **11-13 phút**, chưa kể
thời gian chờ JMeter chạy. Dư khá nhiều so với mức tối thiểu 6 phút.

Nếu muốn gọn hơn, xem mục **"Bản rút gọn ~7 phút"** ở cuối file - đã đánh dấu sẵn đoạn nào cắt được.

---

## Ba điều kiện bắt buộc

| Điều kiện | Trích đề |
|---|---|
| Tổng **>= 6 phút** | mục 6:95 - được cắt nhiều clip |
| JMeter và htop **chung một khung hình** | mục 11:150 - TA kiểm trực tiếp, không được cắt cảnh qua lại |
| **Giọng tiếng Việt của chính mình** | mục 6:95 - không dùng giọng máy |

Upload YouTube ở chế độ **unlisted**.

---

## Chuẩn bị trước khi bấm ghi

*Chạy trước, không quay:*

```bash
cd ~/projects/hw05
./scripts/reset-db.sh
```

*Mở hai cửa sổ terminal cạnh nhau, cùng nằm trong một khung hình:*

```
+-----------------------------+-----------------------------+
| TRÁI - htop                 | PHẢI - gõ lệnh              |
| htop -p $(pgrep -x node)    | (nơi chạy JMeter)           |
`-----------------------------+-----------------------------+
```

*Ghi **toàn màn hình**, không ghi từng cửa sổ riêng. Bật micro.*

---

# PHẦN 1 - Mở đầu - 50 giây

*Gõ ở cửa sổ phải:*

```bash
whoami && hostname
```

Xin chào thầy cô. Em là Lý Quốc Thạnh, mã số sinh viên 23127262. Đây là video demo bài tập HW05,
Kiểm thử hiệu năng, trên hệ thống EShop.

Trước hết em xin xác nhận danh tính máy chạy. Tên người dùng là `qt`, tên máy là
`qt-ThinkBook-14-G5-IRH`. Đây đúng là tên máy em đã dùng ở bài HW04, để thầy cô đối chiếu chéo
giữa hai bài.

*Gõ:*

```bash
ls plans/ data/
```

Em dùng Apache JMeter phiên bản 5.6.3, chạy ở chế độ non-GUI. Thư mục `plans` có ba test plan cho
ba kịch bản Load, Stress và Spike. Thư mục `data` có ba file CSV riêng biệt - mỗi nhóm endpoint một
file, đúng như đề yêu cầu là không được dùng chung một file cho cả ba.

Cửa sổ bên trái là `htop` đang theo dõi tiến trình backend. Trong suốt video, mỗi lần em chạy tải
thì thầy cô sẽ thấy được cả JMeter bên phải lẫn mức tiêu thụ tài nguyên bên trái trong cùng một
khung hình.

---

# PHẦN 2 - Kịch bản Load - 1 phút 50

*Gõ:*

```bash
source env.sh
cd plans
jmeter -n -t 23127262_Load_20260811.jmx -Jthreads=120 -Jduration=120 -l /tmp/demo-load.jtl
```

*Nói trong lúc JMeter khởi động và chạy:*

Kịch bản đầu tiên là Load, bắn vào nhóm read-heavy, tức là hai endpoint `GET /api/products` và
`GET /api/products` với tham số `search`.

Em ghép Load với nhóm read-heavy vì đây là endpoint chỉ đọc, chi phí mỗi request thấp và ổn định,
nên giữ được tải đều trong thời gian dài mà không làm hỏng dữ liệu. Đó là điều kiện cần để về sau
đo ngưỡng chịu đựng của phần cứng bằng con số cụ thể.

Về tham số, em đặt think-time 800 mili giây cộng trừ 200. Lý do là người dùng thật đọc trang rồi
mới bấm tiếp, chứ không bắn request liên tiếp không nghỉ. Nếu bỏ think-time thì con số request mỗi
giây chỉ phản ánh tốc độ sinh tải của công cụ, không phản ánh hành vi người dùng.

Ramp-up đặt 60 giây, tăng dần khoảng một luồng mỗi giây rưỡi, để tránh cú sốc lúc khởi động. Cú sốc
là việc của kịch bản Spike, không phải của Load.

*Chỉ tay sang cửa sổ trái:*

Bên trái, `htop` đang bám đúng tiến trình `node server.js`. Thầy cô thấy cột CPU và cột RES thay
đổi theo tải. Em đo tài nguyên bằng cách đọc trực tiếp `utime` và `stime` từ `/proc`, chứ không
dùng `ps` với tham số `%cpu` - vì con số của `ps` là trung bình cộng dồn từ lúc tiến trình khởi
động, nên nó bị pha loãng bởi khoảng thời gian máy rảnh trước đó và cho ra số thấp hơn thực tế rất
nhiều.

*Khi thấy dòng `Err:` khác 0, chỉ vào nó:*

Ở đây thầy cô thấy tỉ lệ lỗi khoảng ba phẩy năm phần trăm. Em xin nhấn mạnh: **con số này không
phải do quá tải**. Toàn bộ lỗi đến từ đúng một từ khoá tìm kiếm là `O'Neill`. Dấu nháy đơn trong từ
khoá làm vỡ câu lệnh SQL, vì endpoint này nối chuỗi người dùng thẳng vào truy vấn. Đây là lỗi chức
năng kèm lỗ hổng SQL injection, không phải vấn đề hiệu năng. Em đã log nó thành GitHub Issue số 1.

Plan này có năm assertion thuộc bốn loại khác nhau. Trong đó có một assertion kiểm header
`Content-Type`, bởi vì khi lỗi thì hệ thống trả về HTML chứ không phải JSON. Nếu chỉ kiểm mã trạng
thái 200 thì sẽ bỏ sót hoàn toàn.

---

# PHẦN 3 - Kịch bản Stress - 2 phút 20

*Gõ:*

```bash
node ../scripts/reset-lockout.js
```

Kịch bản thứ hai là Stress, bắn vào `POST /api/login`, tức nhóm auth-heavy.

Em ghép Stress với nhóm này vì khi ép tới điểm gãy, hệ thống sẽ kích hoạt cơ chế khoá tài khoản -
đúng thứ mà đề yêu cầu mô tả quy trình reset giữa các lượt chạy.

Lệnh em vừa chạy là `reset-lockout.js`. Em xin lưu ý một điểm quan trọng: **tuyệt đối không được
dùng** lệnh `node backend/database.js` như tài liệu của hệ thống hướng dẫn. Lý do là file
`database.js` gọi hàm khởi tạo ngay khi được import, mà hàm đó mở đầu bằng sáu lệnh `DROP TABLE`.
Nghĩa là chỉ cần chạy nó là mất sạch hai trăm tài khoản và một trăm bốn mươi bảy sản phẩm mà em đã
tạo. Trong quá trình làm bài em đã dính bẫy này hai lần, và đã log thành GitHub Issue số 4.

*Gõ:*

```bash
jmeter -n -t 23127262_Stress_20260813.jmx -Jthreads=400 -Jrampup=60 -Jduration=150 -l /tmp/demo-stress.jtl
```

Một phát hiện quan trọng khác: đề bài ghi hệ thống khoá tài khoản sau ba lần đăng nhập sai, nhưng
hệ thống thật khoá sau **hai** lần. Nguyên nhân là mã nguồn cộng hai đơn vị vào bộ đếm mỗi lần sai,
trong khi ngưỡng khoá là ba. Em kiểm chứng bằng mười tài khoản thăm dò riêng: mỗi tài khoản nhận
đúng hai phản hồi 401 rồi chuyển sang 403, không có ngoại lệ nào.

Vì phát hiện đó, plan này tách hai nhánh riêng biệt bằng If Controller: nhánh tài khoản hợp lệ và
nhánh thăm dò khoá. Lý do phải tách là phản hồi 403 "đã khoá" trả về rất nhanh, vì hệ thống kiểm
trạng thái khoá trước cả bước so mật khẩu. Nếu trộn chung hai nhánh thì các phản hồi 403 siêu nhanh
sẽ kéo throughput trung bình đẹp lên một cách giả tạo, và số đo mất ý nghĩa.

Về ramp-up, em đặt tăng đúng một luồng mỗi giây. Cách này biến trục thời gian thành trục tải: tại
giây thứ N thì có đúng N người dùng đồng thời. Nhờ vậy em đọc ra ngưỡng gãy bằng con số chứ không
phải phỏng đoán.

*Chỉ sang htop:*

Thầy cô thấy CPU của tiến trình `node` đang lên. Ở lượt chạy chính thức với hai nghìn luồng, nó
chạm một trăm ba mươi hai phần trăm, trong khi `loadavg` của toàn máy chỉ khoảng mười hai phần trăm
trên mười sáu luồng CPU. Nghĩa là nút thắt nằm ở **một nhân CPU duy nhất**, do Node chạy đơn luồng -
không phải do phần cứng yếu, cũng không phải do công cụ đo.

Điểm gãy đo được là **một nghìn tám trăm người dùng đồng thời**. Tại đúng mốc đó có ba chỉ báo vỡ
cùng lúc: p95 nhảy từ 399 lên 1228 mili giây, tỉ lệ lỗi tăng từ 0,63 lên 1,94 phần trăm, và thời
gian bắt tay TCP nhảy từ một mili giây lên một nghìn hai mươi. Chỉ báo thứ ba là rõ nhất - nó cho
thấy hàng đợi kết nối của socket đã tràn, chứ không phải hệ thống xử lý chậm đi.

---

# PHẦN 4 - Kịch bản Spike - 1 phút 40

*Gõ:*

```bash
cd .. && ./scripts/reset-db.sh && cd plans
```

Kịch bản thứ ba là Spike, bắn vào luồng giao dịch: `POST /api/cart` rồi `POST /api/checkout`.

Em vừa reset lại toàn bộ cơ sở dữ liệu. Lý do là endpoint checkout không kiểm giỏ hàng và không
kiểm tồn kho, nó chèn thẳng bản ghi vào bảng đơn hàng. Một lượt chạy để lại hàng nghìn đơn rác, nên
bắt buộc phải reset giữa các lượt thì số liệu mới sạch.

*Gõ:*

```bash
jmeter -n -t 23127262_Spike_20260813.jmx -Jbase=20 -Jbaseduration=120 -Jspike=300 -Jspikeduration=30 -Jspikedelay=30 -l /tmp/demo-spike.jtl
```

Cả hai endpoint này đều yêu cầu header `Authorization` với Bearer token. Vì vậy plan có một setUp
Thread Group đăng nhập trước năm mươi tài khoản, dùng JSON Extractor lấy token rồi lưu vào
properties. Các luồng chính lấy token theo chỉ số luồng.

Em không đăng nhập lại trong mỗi vòng lặp, vì làm vậy thì mỗi giao dịch phải gánh thêm một request
đăng nhập, và số liệu của nhóm transactional sẽ bị trộn với nhóm auth - hai nhóm mà đề yêu cầu tách
bạch.

Về hình dạng spike: nền hai mươi luồng chạy suốt, đến giây thứ ba mươi thì vọt lên ba trăm luồng
chỉ trong năm giây, giữ ba mươi giây rồi rút về nền. Em tách làm hai Thread Group riêng biệt, vì
nếu gộp chung thì sau khi cú vọt rút đi sẽ không còn đường cơ sở nào để đo thời gian hồi phục.

*Khi cú vọt xảy ra, chỉ vào cả hai cửa sổ:*

Đây là thời điểm vọt tải. Throughput bên phải nhảy vọt, và bên trái thầy cô thấy RES của tiến trình
node cũng tăng theo.

Ở lượt chạy chính thức, hệ thống hấp thụ trọn cú vọt gấp hai mươi lần mà **không mất một request
nào**, và hồi phục **dưới một giây**. Nhưng bộ nhớ thì có vấn đề: RES đi từ 75 megabyte lên đỉnh
119,7 rồi chỉ về được 94. Tức là mười chín megabyte không bao giờ được nhả lại. Nguyên nhân là giỏ
hàng được giữ trong RAM bằng một biến toàn cục, chỉ có ghi thêm mà không có đường xoá, kể cả sau
khi đặt hàng thành công.

---

# PHẦN 5 - Ngưỡng chịu đựng và phát hiện đáng giá nhất - 1 phút 30

*Gõ:*

```bash
cd .. && python3 scripts/jtl-stats.py steady results/raw/soak-20260813T010601Z.jtl 60
```

Cuối cùng là ngưỡng chịu đựng của phần cứng, đo bằng một lượt soak mười một phút với một nghìn
người dùng đồng thời.

Kết quả: **997 request mỗi giây**, giữ đều suốt mười phút với biên độ dao động dưới không phẩy hai
phần trăm. Trần bộ nhớ là **161 megabyte** - RES tăng từ 122 rồi chững hẳn từ phút thứ tám, nghĩa
là đường đọc không rò rỉ bộ nhớ. Đối lập hoàn toàn với đường ghi mà em vừa trình bày ở kịch bản
Spike.

Em xin nói thêm một chi tiết về con số 997 này. Ở kịch bản Load lúc nãy, throughput đo được chỉ
khoảng bốn mươi lăm request mỗi giây. Nếu lấy con số đó làm năng lực của hệ thống thì sai hoàn toàn
- đó là giới hạn của think-time trong kịch bản, không phải giới hạn của server. Hai con số lệch
nhau hơn hai mươi lần.

*Gõ:*

```bash
python3 scripts/jtl-stats.py summary results/raw/stress-20260813T003655Z.jtl
```

Và đây là phát hiện em thấy đáng giá nhất của cả bài, mà nó lại không nằm ở hệ thống được kiểm thử,
mà nằm ở chính công cụ đo.

Dashboard HTML do JMeter sinh ra báo p95 của lượt Stress là **1671 mili giây**. Nhưng khi em tự
tính lại từ file log thô, giá trị thật chỉ là **237**. Sai lệch bảy phẩy một lần.

Nguyên nhân là JMeter mặc định đặt tham số `statistic_window` bằng hai mươi nghìn, nghĩa là dashboard
chỉ tính phân vị trên hai mươi nghìn mẫu cuối cùng - mà lượt đó có tới bảy trăm bảy mươi nghìn mẫu,
nên nó chỉ phản ánh phần đuôi quá tải nhất. Em kiểm chứng bằng cách đếm trực tiếp: chỉ có bốn phẩy
chín phần trăm số mẫu vượt 237 mili giây, đúng bằng định nghĩa của p95.

Vì phát hiện này, em đã phải sửa bốn con số trong chính báo cáo của mình, và ghi rõ phần đính chính
thay vì lặng lẽ thay số.

Đó là toàn bộ phần demo. Em cảm ơn thầy cô đã theo dõi.

---

## Soát trước khi upload

- [ ] Tổng thời lượng **>= 6 phút**
- [ ] Mọi cảnh JMeter đang chạy đều **thấy được htop trong cùng khung hình**
- [ ] Giọng tiếng Việt của chính mình xuyên suốt
- [ ] Có đoạn thấy rõ `hostname` = `qt-ThinkBook-14-G5-IRH`
- [ ] Chế độ **unlisted**, không phải private
- [ ] Dán link vào `submission/README.md` và bảng biến `CLAUDE.md`

## Bản rút gọn ~7 phút

Bản đầy đủ dài 11-13 phút. Muốn xuống khoảng 7 phút thì bỏ đúng bốn đoạn sau - đều là phần bổ trợ,
không phải mục đề chấm:

| Bỏ đoạn | Ở phần | Bắt đầu bằng | Tiết kiệm |
|---|---|---|---|
| Giải thích cách đo CPU bằng `/proc` thay vì `ps` | 2 | *"Em đo tài nguyên bằng cách..."* | ~40 giây |
| Giải thích vì sao tách hai nhánh If Controller | 3 | *"Vì phát hiện đó, plan này tách..."* | ~50 giây |
| Giải thích vì sao không đăng nhập lại mỗi vòng lặp | 4 | *"Em không đăng nhập lại trong mỗi vòng lặp..."* | ~35 giây |
| So sánh 45 req/s với 997 req/s | 5 | *"Em xin nói thêm một chi tiết về con số 997..."* | ~45 giây |

**Bốn thứ tuyệt đối không được cắt**, vì mỗi thứ là một mục đề chấm riêng:

| Giữ lại | Vì sao |
|---|---|
| Đoạn `whoami` + `hostname` ở Phần 1 | mục 11:151 - TA đối chiếu tên máy giữa các bài |
| Toàn bộ đoạn reset khoá tài khoản ở Phần 3 | mục 6:93 chấm riêng quy trình reset |
| Lý do ghép mỗi kịch bản với mỗi nhóm endpoint | mục 6:88 bắt giải thích |
| Con số ngưỡng chịu đựng ở Phần 5 | mục 6:94 đòi kết luận bằng số cụ thể |
