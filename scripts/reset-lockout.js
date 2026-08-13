#!/usr/bin/env node
/**
 * Mở khoá tài khoản giữa các lượt chạy Stress/Spike - yêu cầu của đề mục 6:93.
 *
 * VÌ SAO PHẢI CÓ SCRIPT RIÊNG, KHÔNG DÙNG `node backend/database.js`:
 * sut/backend/database.js gọi initDatabase() ngay khi được import (dòng 117),
 * và initDatabase() bắt đầu bằng 6 lệnh DROP TABLE (dòng 15-20). Nghĩa là chỉ
 * cần require file đó là TOÀN BỘ dữ liệu bị xoá, gồm cả 200 tài khoản và 147
 * sản phẩm do scripts/seed-data.js tạo ra. Reset lockout mà mất luôn dữ liệu
 * nền thì lượt chạy sau không còn gì để bắn.
 *
 * Script này mở thẳng file database.sqlite bằng driver sqlite3, không đụng tới
 * database.js, nên chỉ xoá trạng thái khoá và giữ nguyên mọi dữ liệu khác.
 *
 * Chạy: node scripts/reset-lockout.js
 */

const path = require("path");
const BACKEND = path.resolve(__dirname, "../sut/backend");
const sqlite3 = require(path.join(BACKEND, "node_modules/sqlite3")).verbose();

const dbPath = path.join(BACKEND, "database.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.get(
    "SELECT COUNT(*) AS locked FROM users WHERE locked_until IS NOT NULL OR login_attempts > 0",
    (err, before) => {
      if (err) {
        console.error("Không đọc được bảng users:", err.message);
        process.exit(1);
      }
      db.run(
        "UPDATE users SET login_attempts = 0, locked_until = NULL",
        function (err2) {
          if (err2) {
            console.error("Reset thất bại:", err2.message);
            process.exit(1);
          }
          db.get("SELECT COUNT(*) AS total FROM users", (err3, after) => {
            console.log(
              `Đã mở khoá: ${before.locked} tài khoản có trạng thái khoá/đếm sai -> 0`,
            );
            console.log(`Tổng tài khoản còn nguyên: ${after.total}`);
            db.close();
          });
        },
      );
    },
  );
});
