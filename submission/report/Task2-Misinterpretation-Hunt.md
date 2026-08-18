# Task 2 - Phân tích bằng AI và săn lỗi diễn giải

*(HW05 mục 6:98-104 - thang điểm mục 15:188 - 10 điểm)*

**Sinh viên:** Lý Quốc Thạnh - 23127262

---

## Quy trình ba bước

| Bước | Việc | Trạng thái |
|---|---|---|
| 1 | Cho AI phân tích `.jtl` và đề xuất ngưỡng *(mục 6:102)* | [x] `submission/appendix/AI-Analysis-Raw.md` - 7 715 từ, giữ nguyên văn |
| 2 | Săn chỗ đọc sai, kèm giá trị đúng từ `.jtl` thô *(mục 6:103)* | [x] bảng A và B bên dưới |
| 3 | Phân loại 10 đề xuất tối ưu feasible / hallucinated *(mục 6:104)* | [x] |
| 4 | Tổng kết tỉ lệ | [x] |

### Cách bước 1 được thực hiện

Bản phân tích do một phiên AI **độc lập** sinh ra, cô lập có chủ đích: chỉ được cấp 4 file `.jtl`
thô và một mô tả trung lập về hệ thống. **Không** được cấp mã nguồn SUT, **không** được cấp báo cáo
chính, **không** biết gì về 13 lỗi đã phát hiện. Cô lập như vậy để chỗ đọc sai là lỗi phát sinh tự
nhiên, không phải lỗi dàn dựng.

### Nguyên tắc kiểm chứng

Mọi con số ở cột "Giá trị đúng" tính **trực tiếp từ `.jtl` thô** bằng `scripts/jtl-stats.py` hoặc
script Python đọc thẳng file - **không** lấy từ `statistics.json` do JMeter sinh. Lý do vì sao điều
này quan trọng nằm ngay ở phát hiện đầu tiên của bảng B.

---

## Bước 2 - Bảng A: chỗ AI đọc sai

### A1 - Suy luận về ngưỡng khoá tài khoản không giải thích được dữ liệu quan sát được

| | |
|---|---|
| **AI nói** | *"Số lần sai để bị khoá là 2, không phải 3. Suy ra trực tiếp từ tỉ lệ 40 / 36,663: nếu ngưỡng là 3 lần thì với chu kỳ mở khoá 180 s và 3 chu kỳ trong bài test, số 401 phải xấp xỉ gấp rưỡi con số quan sát được."* |
| **Kết luận** | Đúng - ngưỡng thật là 2 |
| **Suy luận** | Sai - không giải thích được dữ liệu |

Dữ liệu thật cho thấy 401 phân bố **20 / 10 / 10** chứ không đều:

```bash
python3 - <<'PY'
import csv
from collections import defaultdict
t401=defaultdict(int); t0=None; rows=[]
with open('results/raw/stress-20260813T003655Z.jtl') as f:
    for r in csv.DictReader(f):
        ts=int(r['timeStamp']); t0=ts if t0 is None else min(t0,ts)
        rows.append((ts, r['responseCode'], r['label']))
for t,c,l in rows:
    if 'tham do lockout' in l and c=='401': t401[(t-t0)//30000]+=1
for k in sorted(t401): print(f"giây {k*30:4}-{k*30+30:<4}: {t401[k]:3} lần 401")
PY
```

```
giây    0-30  :  20 lần 401
giây  180-210 :  10 lần 401
giây  360-390 :  10 lần 401
```

Lý thuyết "gấp rưỡi" của AI dự đoán một phân bố đều, không khớp với 20/10/10.

**Cơ chế thật** - đọc `server.js:46-62`: `login_attempts` chỉ được reset về 0 khi đăng nhập
**thành công** (dòng 48). Hết 180 giây khoá, bộ đếm vẫn giữ nguyên giá trị 4.

| Chu kỳ | Bộ đếm đầu chu kỳ | Số lần sai để đạt ngưỡng >=3 | 401 sinh ra |
|---|---|---|---|
| 1 | 0 | 2 lần (0->2->4) | 10 tài khoản x 2 = **20** v |
| 2 | 4 (không reset) | 1 lần (4->6) | 10 x 1 = **10** v |
| 3 | 6 | 1 lần | 10 x 1 = **10** v |

Khớp chính xác cả ba chu kỳ.

**Vì sao AI trượt:** nó không được cấp mã nguồn, nên buộc phải suy từ số liệu. Nhưng thay vì nói rõ
đây là suy đoán, nó trình bày như một phép suy diễn chặt chẽ. Bộ đếm không reset sau khi mở khoá là
chi tiết **không thể suy ra từ log** - và bản thân nó cũng là một lỗi đáng ghi nhận thêm của SUT.

---

### A2 - Trích dẫn sai loại thống kê: "avg" trong khi con số là trung vị

| | |
|---|---|
| **AI nói** | *"ở mức đồng thời thấp (dưới 200 luồng), đăng nhập hợp lệ có **avg ~1 ms**"* |
| **Giá trị đúng** | **trung bình = 69,36 ms** - **trung vị = 1 ms** |

```bash
python3 - <<'PY'
import csv
v=[]
with open('results/raw/stress-20260813T003655Z.jtl') as f:
    for r in csv.DictReader(f):
        if int(r['allThreads'])<200 and r['label'].startswith('POST dang nhap hop le'):
            v.append(int(r['elapsed']))
v.sort()
print(f"{len(v)} mẫu - tb={sum(v)/len(v):.2f} ms - p50={v[len(v)//2]} - p95={v[int(len(v)*.95)]} - max={v[-1]}")
PY
```

```
7199 mẫu - tb=69.36 ms - p50=1 - p95=3 - max=28577
```

Trung bình bị kéo lên 69 ms bởi vài mẫu ngoại lai tới 28,6 giây (kết nối bị treo trong lúc ramp).
Con số **1 ms** mà AI dẫn là **trung vị**, không phải trung bình.

**Vì sao đáng kể:** kết luận "không có bcrypt" vẫn đúng và vẫn đứng vững - nhưng nó đứng trên
**p50**, không phải trên "avg". Nếu người đọc kiểm lại bằng đúng chỉ số AI nêu, họ sẽ thấy 69 ms và
tưởng AI bịa, trong khi kết luận thực ra chính xác. Dẫn sai tên chỉ số làm hỏng khả năng kiểm chứng
của chính lập luận đúng.

---

### A3 - Giải thích nhân quả không kiểm chứng được, trình bày như sự thật đã xác lập

| | |
|---|---|
| **AI nói** | *"Nguyên nhân: đường ghi của SQLite tốn chi phí cố định cho mỗi lần đồng bộ journal ra đĩa; khi request thưa... page cache đã nguội; khi request dày đặc... chi phí được phân bổ trên nhiều thao tác ghi."* |
| **Vấn đề** | Không có bất kỳ dữ liệu nào trong `.jtl` chống lưng cho cơ chế này |

Hiện tượng (checkout nhanh hơn lúc bị vọt tải) là **có thật** và kiểm chứng được. Nhưng **nguyên
nhân** thì không: `.jtl` không chứa số lần fsync, không chứa trạng thái page cache, không chứa gì
về journal. AI cũng không được cấp mã nguồn để biết checkout ghi như thế nào.

Cách viết *"Nguyên nhân: ..."* thay vì *"một giả thuyết có thể là..."* biến suy đoán thành khẳng
định. Đây là dạng lỗi nguy hiểm nhất trong báo cáo hiệu năng, vì nó dẫn thẳng tới quyết định tối ưu
sai chỗ.

**Tự phê bình:** báo cáo chính của tôi mắc **đúng lỗi cùng loại** - tôi giải thích hiện tượng này
bằng "vòng lặp sự kiện luôn bận nên không phải đánh thức lại, đồng thời CPU chuyển sang tần số cao".
Cũng là suy đoán, cũng không kiểm chứng được. Đã sửa lại thành giả thuyết có ghi rõ là chưa kiểm
chứng.

---

### A4 - Suy ra vị trí lưu trữ giỏ hàng từ kích thước phản hồi

| | |
|---|---|
| **AI nói** | *"Kích thước phản hồi checkout cố định 313-315 byte và không đổi theo thời gian... là dấu hiệu rõ ràng rằng checkout không đọc và không kiểm giỏ hàng... Hệ quả: giỏ hàng trong RAM không bao giờ được dọn."* |
| **Kết luận** | Đúng cả hai vế |
| **Suy luận** | Không hợp lệ |

Kích thước phản hồi **không nói gì** về việc dữ liệu được lưu ở đâu. Một endpoint đọc giỏ hàng từ
CSDL rồi trả về đúng `{"message":..., "orderId":...}` cũng cho kích thước cố định y hệt. Bước nhảy
từ "phản hồi không đổi kích thước" sang "giỏ hàng nằm trong RAM" không có cầu nối logic.

Kết luận đúng chỉ vì trùng hợp - kiểm chứng bằng mã nguồn (`server.js:14` khai báo
`const userCarts = {}`, dòng 293 chỉ `push`, không có đường xoá) và bằng đo RSS thật (75,0 -> đỉnh
119,7 -> chỉ về 94,0 MB).

**Vì sao AI trượt:** bị ép phải kết luận dứt khoát (prompt ghi *"đừng viết kiểu có thể là"*) trong
khi dữ liệu không đủ. Nó lấp khoảng trống bằng một suy luận nghe hợp lý. Đây là hệ quả trực tiếp của
cách ra prompt - lỗi của người dùng AI nhiều hơn là của model.

---

### A5 - Số liệu trong phần diễn giải không khớp với bảng của chính nó

| | |
|---|---|
| **AI nói** | *"trong lúc spike, checkout nhanh hơn lúc nền (avg 2.87 ms so với **5.20 ms**)... nhất quán trên 6,345 mẫu spike so với **751 mẫu nền**"* |
| **Bảng của chính AI** | checkout nền: **2 214 mẫu**, avg **4,8 ms** |

Không có tập con nào cho ra 751 mẫu hoặc 5,20 ms:

```bash
python3 - <<'PY'
import csv
t0=None; rows=[]
with open('results/raw/spike-20260813T005423Z.jtl') as f:
    for r in csv.DictReader(f):
        ts=int(r['timeStamp']); rows.append((ts,int(r['elapsed']),r['label']))
        t0=ts if t0 is None else min(t0,ts)
allnen=[e for t,e,l in rows if l=='POST dat hang - checkout']
inwin=[e for t,e,l in rows if l=='POST dat hang - checkout' and 120<=(t-t0)/1000<165]
print(f"checkout nền TOÀN lượt  : {len(allnen)} mẫu - tb={sum(allnen)/len(allnen):.2f} ms")
print(f"checkout nền trong spike: {len(inwin)} mẫu - tb={sum(inwin)/len(inwin):.2f} ms")
PY
```

```
checkout nền TOÀN lượt  : 2214 mẫu - tb=4.84 ms
checkout nền trong spike:  345 mẫu - tb=3.03 ms
```

Ngoài chuyện số không khớp, phép so sánh còn **so lệch đối tượng**: nó đặt nhánh spike (2,87 ms)
cạnh nhánh nền tính trên **toàn lượt** (4,84 ms). Nhưng nhánh nền **cũng nhanh lên** trong đúng cửa
sổ spike (3,03 ms). Quan sát đúng phải là *"mọi thứ đều nhanh hơn trong lúc tải cao"*, chứ không
phải *"nhánh spike nhanh hơn nhánh nền"*.

---

## Bước 2 - Bảng B: chỗ **báo cáo của tôi** sai mà AI đúng

Việc rà soát lộ ra bốn lỗi trong chính báo cáo chính của tôi. Ghi lại đầy đủ vì mục 6:103 yêu cầu
săn lỗi **diễn giải metric**, không phải chứng minh AI kém.

### B1 - p95 lấy từ dashboard JMeter sai gấp 7 lần - và đây là bẫy hệ thống

| | |
|---|---|
| **Tôi đã viết** | Stress p95 = **1 671 ms** (lấy từ `statistics.json`) |
| **Giá trị đúng** | **237 ms** |
| **AI viết** | 237 ms - **đúng** |

Kiểm bằng cách đếm trực tiếp, không tin phép tính nào:

```bash
python3 - <<'PY'
import csv
els=[]
with open('results/raw/stress-20260813T003655Z.jtl') as f:
    for r in csv.DictReader(f): els.append(int(r['elapsed']))
n=len(els)
for thr in (237, 1669):
    above=sum(1 for e in els if e>thr)
    print(f"số mẫu > {thr:5} ms: {above:7} ({above/n*100:6.3f}%)")
PY
```

```
số mẫu >   237 ms:   38080 ( 4.945%)      <- đúng là p95
số mẫu >  1669 ms:   11172 ( 1.451%)      <- thực ra là ~p98,5
```

**Nguyên nhân gốc:** JMeter đặt `jmeter.reportgenerator.statistic_window = 20000` (mặc định, thấy
trong `bin/user.properties`). Dashboard HTML **chỉ tính phân vị trên 20 000 mẫu cuối cùng**, tức
phần đuôi quá tải nhất của lượt chạy. Bằng chứng: p50 khớp **chính xác 205 ms** ở đúng cửa sổ
20 000, trong khi p50 toàn lượt là 172 ms.

Hệ quả trải rộng, phụ thuộc số mẫu:

| Lượt | Mẫu | Vượt 20 000? | p95 thô | p95 dashboard | Lệch |
|---|---|---|---|---|---|
| Load | 13 483 | không | 2 ms | 2 ms | khớp |
| Spike | 17 376 | không | 6 ms | 6 ms | khớp |
| **Soak** | 627 943 | **có** | **8 ms** | 12 ms | 1,5x |
| **Stress** | 770 065 | **có** | **237 ms** | 1 671 ms | **7,1x** |

**Vì sao tôi trượt:** R11 trong quy tắc làm việc ghi rõ *"mọi con số phải truy ngược được về `.jtl`"*
- và tôi vi phạm chính quy tắc mình đặt ra, vì `statistics.json` **trông như** đã là số liệu từ log
thô. Nó là số liệu dẫn xuất, có lấy mẫu. Phiên AI kia tránh được bẫy này chỉ vì nó **không được cấp**
thư mục HTML, buộc phải tự tính từ log.

### B2 - Điểm gãy: 1 626 -> 1 800 luồng

| | |
|---|---|
| **Tôi đã viết** | Gãy ở **~1 626** luồng (mốc xuất hiện lỗi đầu tiên, đọc từ dòng summary 30 giây) |
| **Giá trị đúng** | **1 800** luồng |

```bash
python3 - <<'PY'
import csv
from collections import defaultdict
b=defaultdict(lambda: {'el':[], 'ct':[], 'err':0})
with open('results/raw/stress-20260813T003655Z.jtl') as f:
    for r in csv.DictReader(f):
        k=int(r['allThreads'])//100*100
        b[k]['el'].append(int(r['elapsed'])); b[k]['ct'].append(int(r['Connect']))
        if r['success']!='true': b[k]['err']+=1
def p(v,q): v=sorted(v); return v[min(int(len(v)*q),len(v)-1)]
for k in sorted(b):
    if k<1600: continue
    d=b[k]; n=len(d['el'])
    print(f"{k:5}-{k+99:<5} p95={p(d['el'],.95):6} p99={p(d['el'],.99):6} "
          f"lỗi={d['err']/n*100:5.2f}% Connect_p95={p(d['ct'],.95):5}")
PY
```

```
 1600-1699  p95=   199 p99=  1222 lỗi= 0.24% Connect_p95=    1
 1700-1799  p95=   399 p99=  1443 lỗi= 0.63% Connect_p95=    1
 1800-1899  p95=  1228 p99=  2677 lỗi= 1.94% Connect_p95= 1020   <- ba chỉ báo cùng vỡ
 1900-1999  p95=  1634 p99=  4461 lỗi= 4.13% Connect_p95= 1051
```

Mốc 1 626 của tôi dựa vào "lỗi đầu tiên xuất hiện" - nhưng tỉ lệ lỗi **đã dao động 0,01-0,24% từ
mức 400 luồng**, nên "lỗi đầu tiên" không phải tín hiệu sạch. Tại 1 800 thì **ba** chỉ báo vỡ cùng
lúc, trong đó `Connect` p95 nhảy từ **1 ms lên 1 020 ms** - một ngưỡng nhị phân gần như không có
vùng xám, và là bằng chứng cho thấy hàng đợi accept của socket đã tràn chứ không phải xử lý chậm.

### B3 - Thời gian hồi phục sau spike: "< 15 giây" -> **< 1 giây**

Tôi cắt dữ liệu theo cửa sổ 15 giây nên độ phân giải chỉ tới đó. Cắt theo 1 giây:

```
giây 163: 15 mẫu - tb=1.67 ms   <- đang trong spike
giây 165: 15 mẫu - tb=1.60 ms   <- spike kết thúc
giây 166: 17 mẫu - tb=3.18 ms   <- ĐÃ về mức nền (trước spike: 3.38 ms)
```

Con số của tôi không sai, nhưng **kém chính xác 15 lần** so với dữ liệu cho phép.

### B4 - Soak p95 = 12 ms -> **8 ms**

Cùng nguyên nhân với B1 (627 943 mẫu > 20 000).

---

## Bước 3 - Phân loại 10 đề xuất tối ưu

| # | Đề xuất | Phân loại | Lý do |
|---|---|---|---|
| **A1** | Prepared statement cho `?search=` | [x] **Feasible** | Kiểm chứng `server.js:144` - đúng là nối chuỗi. Sửa một dòng, xoá 100% lỗi 500 (22 886 lỗi trên 2 lượt). Đồng thời bịt SQL injection |
| **A2** | Tăng backlog TCP + keep-alive | [x] **Feasible** | `server.js:570` gọi `app.listen(PORT, cb)` - **không truyền backlog**, nên dùng mặc định 511 của Node. Đo được `Connect` p95 nhảy 1 -> 1 020 ms tại 1 800 luồng, đúng chỗ AI chỉ |
| **A3** | Giới hạn vòng đời giỏ hàng trong RAM | [x] **Feasible** | `userCarts = {}` (`server.js:14`) chỉ `push` (dòng 293), không có đường xoá. Đo được 19,0 MB không nhả lại |
| **B1** | Chạy Node ở chế độ cluster | [x] **Feasible** | Đo được `node` chiếm 102% CPU trung bình trong khi `loadavg` toàn máy 1,53-1,93 trên 16 luồng. Cảnh báo kèm theo của AI - **A3 phải làm trước B1**, vì giỏ hàng trong RAM sẽ vỡ khi có nhiều worker - là chính xác và tinh tế |
| **B2** | Cache `GET /api/products` + ETag | [x] **Feasible** *(ước lượng dựa trên suy luận sai)* | Bản thân giải pháp hợp lý. Nhưng cách ước lượng thì hỏng: AI lấy chênh lệch 22% giữa `/api/products` (3,37 ms) và `?search=` (2,76 ms) rồi quy ra "chi phí tuần tự hoá chiếm 20-25%". Hai endpoint khác nhau **cả ở truy vấn lẫn ở kích thước kết quả** - không tách được biến |
| **B3** | Bật SQLite WAL | [x] **Feasible** | Một lệnh `PRAGMA`. Lợi ích hiện tại khiêm tốn vì đường ghi chưa bão hoà - chính AI cũng nói vậy, không thổi phồng. Lập luận "điều kiện bắt buộc để B1 phát huy tác dụng" là hợp lý |
| **B4** | Kết nối DB dùng chung ~~+ chỉ mục~~ | [X] **Hallucinated** *(nửa đầu)* | *"Mở một kết nối SQLite bền vững cho mỗi worker **thay vì mở/đóng theo request**"* - SUT **chưa bao giờ** mở kết nối theo request. `database.js:5` mở **một** kết nối lúc nạp module rồi `module.exports = db` (dòng 119); `server.js` có **0** lần gọi `new sqlite3.Database`. AI tối ưu một vấn đề không tồn tại. Nửa sau (chỉ mục) thì trung thực - chính AI ghi "lợi ích gần như bằng không" ở quy mô 200 dòng |
| **C1** | Băm mật khẩu bằng bcrypt | [x] **Feasible** | Kiểm chứng `server.js:46` so sánh chuỗi trần. AI còn chủ động cảnh báo rằng ai đọc 198,8 ms rồi quy cho chi phí băm là sai - chính là cái bẫy đề bài giăng sẵn, và nó tránh được |
| **C2** | Chuyển sang PostgreSQL | [x] **Feasible** *(hoãn có điều kiện)* | Không đề xuất làm ngay, nêu rõ ngưỡng kích hoạt (>2 000 ghi/giây hoặc cần nhiều máy). Đúng với dữ liệu: checkout 2,9 ms, SQLite chưa phải nút thắt |
| **C3** | SQLite FTS5 khi danh mục lớn | [x] **Feasible** *(hoãn có điều kiện)* | `LIKE '%từ khoá%'` có ký tự đại diện ở đầu thì không chỉ mục nào dùng được - đúng, kiểm chứng `server.js:144`. Vô hại ở 147 sản phẩm |

---

## Bước 4 - Tổng kết

### Độ chính xác các nhận định của AI

Đã kiểm **25 nhận định định lượng** bằng lệnh trên `.jtl` thô:

| Chỉ số | Số lượng | Tỉ lệ |
|---|---|---|
| **Đúng hoàn toàn** | 20 | **80%** |
| **Kết luận đúng, suy luận sai** | 3 | 12% |
| **Sai / không kiểm chứng được** | 2 | 8% |

Ba nhận định "kết luận đúng, suy luận sai" là A1 (ngưỡng khoá), A4 (giỏ hàng trong RAM) và A2
(nhầm avg với trung vị). Hai nhận định sai là A3 (giải thích nhân quả bịa) và A5 (số liệu không
khớp).

### Đề xuất tối ưu

| Chỉ số | Số lượng | Tỉ lệ |
|---|---|---|
| **Feasible** | 9 | **90%** |
| **Hallucinated** | 1 | 10% |

### Điều rút ra

**AI mạnh ở tính toán, yếu ở quy nguyên nhân.** Không một phép tính số học nào của nó sai - nó tính
p95 đúng hơn cả dashboard của JMeter. Nhưng cứ chỗ nào phải giải thích **vì sao** thì nó lấp khoảng
trống bằng suy luận nghe hợp lý mà không đánh dấu đó là suy đoán (A1, A3, A4).

**Prompt ép kết luận dứt khoát làm hỏng phần diễn giải.** Câu *"đừng viết kiểu có thể là"* trong
prompt của tôi đã trực tiếp gây ra A3 và A4 - AI không được phép nói "không đủ dữ liệu để kết luận"
nên nó bịa cơ chế. Đây là lỗi của người ra prompt, không phải của model.

**Số liệu do công cụ dựng sẵn không đáng tin hơn số liệu tự tính.** Phát hiện đắt giá nhất của bài
này (B1) không phải chỗ AI sai - mà là chỗ **JMeter sai**, và AI đúng chỉ vì nó không có lựa chọn
nào ngoài tự tính từ log thô. Bốn con số trong báo cáo của tôi đã phải sửa.
