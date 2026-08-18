# Sổ tay phân tích `.jtl` - các lỗi diễn giải thường gặp

Danh sách này rút từ việc đối chiếu một bản phân tích do AI sinh với số liệu đo thật.
Mỗi mục kèm **cách kiểm chứng bằng lệnh**.

---

## 1. Nhầm giới hạn của công cụ đo với giới hạn của hệ thống

**Triệu chứng:** kết luận "hệ thống chỉ chịu được N req/s" từ một lượt chạy có think-time.

**Vì sao sai:** với think-time *t* giây và *T* luồng, throughput trần của **kịch bản** là
`T / (t x số_sampler_mỗi_vòng)` - hoàn toàn không liên quan tới năng lực server.

**Ví dụ thật:** kịch bản Load đo 45,1 req/s với 50 luồng và think-time 800 ms. Nghe như trần của
server. Soak trên **chính endpoint đó** với 1 000 luồng đo được **997 req/s** - lệch **22 lần**.

**Cách kiểm chứng:** nếu CPU của tiến trình server thấp trong lúc chạy -> nút thắt nằm ở kịch bản,
không phải ở server.

```bash
awk -F',' 'NR>1{s+=$3;n++} END{printf "CPU trung bình: %.1f%%\n",s/n}' evidence/monitor/<run>-resource.csv
```

CPU dưới 50% mà kết luận "server đã tới hạn" là sai.

---

## 2. Coi mọi `success=false` là "server trả lỗi"

**Triệu chứng:** báo cáo ghi "tỉ lệ lỗi 1,29%, server không chịu nổi tải".

**Vì sao sai:** JMeter đánh `success=false` cho **cả hai** trường hợp - HTTP lỗi thật, **và**
assertion trượt trong khi HTTP vẫn 200.

**Ví dụ thật:** trong 9 971 "lỗi" của một lượt Stress, **8 758 mẫu (87,8%) có `responseCode = 200`**
- chúng chỉ vượt ngưỡng Duration Assertion 2 000 ms. Server không hề trả lỗi; nó chậm.

**Cách kiểm chứng:**

```bash
python3 scripts/jtl-stats.py errors <file.jtl>
```

Lệnh này tách riêng cột "mã phản hồi của các mẫu bị đánh là lỗi". Thấy `200` trong đó nghĩa là có
mẫu trượt vì assertion chứ không phải vì server.

---

## 3. Quy lỗi cho tải trong khi lỗi là tất định

**Triệu chứng:** "tỉ lệ lỗi 3,57% cho thấy hệ thống quá tải".

**Cách phân biệt:** lỗi do tải thì **tỉ lệ thay đổi theo mức tải**; lỗi chức năng thì **tỉ lệ đứng
yên**.

**Ví dụ thật:** cùng một tỉ lệ 7,13% và 7,14% trên nhóm tìm kiếm, đo ở hai lượt chạy cách nhau
2 ngày với mức tải chênh **20 lần** (45 req/s so với 997 req/s). Tất cả đến từ đúng một từ khoá
chứa dấu nháy đơn.

**Cách kiểm chứng:**

```bash
awk -F',' 'NR>1 && $8=="false"{print $14}' <file.jtl> | sort | uniq -c | sort -rn | head
```

Lỗi dồn vào một URL duy nhất -> lỗi chức năng. Rải đều -> có thể do tải.

---

## 4. Lẫn lộn throughput toàn lượt với throughput ổn định

**Triệu chứng:** dùng con số throughput của JMeter làm "năng lực hệ thống".

**Vì sao sai:** con số đó tính cả giai đoạn ramp-up, khi tải chưa đạt mức mục tiêu.

**Ví dụ thật:** cùng một lượt soak - **952,6 req/s** tính toàn lượt (gồm 60 giây ramp), nhưng
**997 req/s** ở trạng thái ổn định. Chênh 4,6%.

**Cách kiểm chứng:**

```bash
python3 scripts/jtl-stats.py steady <file.jtl> 60
```

Lệnh này tự bỏ khoảng đầu (ramp-up) và khoảng cuối (luồng kết thúc so le).

---

## 5. Đặt ngưỡng cảnh báo thấp hơn nhiễu nền

**Triệu chứng:** đề xuất "cảnh báo khi p95 tăng quá 20%".

**Vì sao sai:** p95 dao động đáng kể ngay cả khi không có gì thay đổi.

**Ví dụ thật:** trong một lượt soak 11 phút - cùng commit, cùng máy, cùng tải - p95 đi từ **6 ms**
lên **11 ms** rồi về **8 ms**. Biên độ **1,83 lần**. Ngưỡng 20% sẽ báo động liên tục. Trong khi đó
**p50 bất biến ở 2 ms** suốt 10 phút -> p50 mới là tín hiệu đáng dùng.

**Cách đo nhiễu nền của chính hệ thống:**

```bash
python3 scripts/jtl-stats.py timeline <file-soak.jtl> 60
```

Ngưỡng cảnh báo phải đặt **trên** biên độ dao động đo được.

---

## 6. Suy nguyên nhân từ trực giác thay vì từ số liệu

**Triệu chứng:** "độ trễ đăng nhập cao do chi phí băm mật khẩu".

**Cách kiểm chứng:** nhìn độ trễ ở **tải thấp**, nơi chưa có hàng đợi.

**Ví dụ thật:** đăng nhập mất **~1 ms** ở dưới 200 luồng. Một phép bcrypt cost 10 tốn 50-100 ms CPU.
1 ms chứng minh **không hề có băm** - mật khẩu đang so sánh dạng plaintext. Toàn bộ độ trễ ở tải cao
là **thời gian xếp hàng**, không một mili giây nào là chi phí mã hoá.

**Nguyên tắc:** độ trễ ở tải thấp = chi phí xử lý thật. Độ trễ ở tải cao trừ đi độ trễ ở tải thấp =
thời gian xếp hàng.

---

## 7. Bỏ qua chuyện `.jtl` không chứa số liệu bộ nhớ

**Triệu chứng:** kết luận "không có rò rỉ bộ nhớ" chỉ dựa trên `.jtl`.

**Vì sao sai:** file `.jtl` **không có** cột nào về RAM. Muốn kết luận về bộ nhớ thì bắt buộc phải
có dữ liệu đo tài nguyên riêng.

**Ví dụ thật:** soak trên đường **đọc** cho RSS chững ở 161 MB - không rò rỉ. Nhưng kịch bản Spike
trên đường **ghi** cho RSS đi 75,0 -> 119,7 -> chỉ về 94,0 MB, tức **19 MB không bao giờ nhả lại**.
Cùng một hệ thống, hai kết luận trái ngược, tuỳ vào endpoint nào được bắn.

**Cách kiểm chứng:**

```bash
awk -F',' 'NR>1{r=$4/1024; if(NR==2)f=r; if(r>m)m=r; l=r}
  END{printf "đầu %.1f MB - đỉnh %.1f MB - cuối %.1f MB - không nhả %.1f MB\n",f,m,l,l-f}' \
  evidence/monitor/<run>-resource.csv
```

---

## Bảng tra nhanh

| Nghi ngờ | Lệnh kiểm |
|---|---|
| Throughput có phải trần server? | `jtl-stats.py steady` + xem CPU trong `evidence/monitor/` |
| "Lỗi" là lỗi thật hay assertion trượt? | `jtl-stats.py errors` - nhìn cột mã phản hồi |
| Lỗi do tải hay tất định? | So tỉ lệ lỗi giữa hai lượt khác mức tải |
| Điểm gãy ở đâu? | `jtl-stats.py threads` - tìm chỗ p95 nhảy bậc |
| Có trôi theo thời gian? | `jtl-stats.py timeline 60` - xem p50 có tăng đơn điệu không |
| Có rò rỉ bộ nhớ? | CSV tài nguyên, **không** phải `.jtl` |
