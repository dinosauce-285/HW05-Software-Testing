# Log thô `.jtl` — danh mục và checksum

Các file `.jtl` **không được commit lên GitHub**: lượt Stress ở mức 2000 luồng sinh ra file 106 MB,
vượt giới hạn 100 MB/file của GitHub. Chúng nằm nguyên vẹn trên đĩa và đi kèm trong file `.zip` nộp
Moodle theo đề mục 14:171 (*"The three raw .jtl logs"*) — Policies:41 cho phép dùng split-and-zip
cho file lớn.

Bảng `sha256` dưới đây để TA đối chiếu file trong zip đúng là file do JMeter sinh ra, không bị sửa tay
(đề mục 11:149 — TA verify trực tiếp).

| Lượt chạy | File | Kích thước | sha256 |
|---|---|---|---|
| **Load — chính thức** | `load-20260811T023204Z.jtl` | 2,0 MB | `018141aab668ed3c1d5c3fa1ef10ce91b096cee3de0f57cbdfba589f0d538eca` |
| Stress — dò mức nền | `stress-20260813T002147Z.jtl` | 17 MB | `586a8d1c0f80266cfce59c99a5f533b84350948cc8475d362718c00e51cdeb42` |
| Stress — leo thang | `stress-20260813T002811Z.jtl` | 71 MB | `bedc5b21a8442bc4670209d86780fd17fae569033d081a5c61cd9fcd0ce511eb` |
| **Stress — chính thức** | `stress-20260813T003655Z.jtl` | 106 MB | `36b0efbe2d98e0708d7dcba45953a412aabb8d7919e91d22238a55bf54a92d06` |
| Stress — quy trách nút thắt | `stress-bottleneck-check-20260813T004442Z.jtl` | 38 MB | `c186b67e9780c84c307630007570c577e31051152f49260351e9bba4b66de39b` |
| **Spike — chính thức** | `spike-20260813T005423Z.jtl` | 2,5 MB | `dd861a70209a306acbf4e205f368e6c0b2bdcc7af59d9bbcf9a3cbb1d6239f55` |
| Endurance — dò trần read-heavy | `load-ramp-20260813T010033Z.jtl` | 29 MB | `388d827d076d883cb57c6c844f6c97945833e1e6a15a0ac2f8756c29c4a695e7` |
| **Endurance — soak 11 phút** | `soak-20260813T010601Z.jtl` | 95 MB | `255af8494dc19772de9ecd6e33b1ce3fecc1d7afa75305eb32b72891501c52e2` |

## Vì sao kịch bản Stress có 4 file

Đề mục 6:88 định nghĩa Stress là đẩy tới điểm gãy. Mức tải đầu tiên **không làm gãy được SUT**, nên
phải leo thang có chủ đích — mỗi nấc là một lượt chạy riêng, giữ lại đầy đủ để chứng minh quá trình
tìm ngưỡng chứ không phải chọn sẵn con số đẹp:

| Lượt | Luồng | Kết quả | Kết luận rút ra |
|---|---|---|---|
| 1 | 250 | 0% lỗi, p95 = 3 ms, CPU đỉnh 72% | Chưa gãy. Throughput 622/s bị chặn bởi **think-time** (250 ÷ 0,4 s), không phải bởi server |
| 2 | 800 | 0% lỗi, p95 = 10 ms, CPU đỉnh 115% | Vẫn chưa gãy nhưng đã vào vùng bão hoà CPU |
| 3 | 2000 | **1,29% lỗi**, p95 = 1671 ms, max 34,2 s | Gãy. Đây là lượt chính thức |
| 4 | 1800 | Chạy ngắn 120 s | Đo song song CPU của `node` và của JMeter để chứng minh nút thắt nằm ở SUT, không phải ở công cụ đo |

Lượt 1 và 2 **không phải là thất bại cần giấu** — chúng chính là bằng chứng cho kết luận quan trọng
nhất của kịch bản này: với endpoint rẻ như `/api/login` (mật khẩu so sánh dạng plaintext, không bcrypt),
số luồng của công cụ đo mới là thứ quyết định throughput cho tới tận mốc ~1000 luồng.
