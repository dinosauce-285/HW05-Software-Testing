#!/usr/bin/env node
/**
 * Đếm số đơn hàng trong DB - dùng để chứng minh trạng thái sạch trước mỗi lượt
 * chạy và đo lượng đơn rác do checkout sinh ra (đề mục 6:93).
 *
 * Mở thẳng file sqlite, KHÔNG import sut/backend/database.js vì file đó xoá sạch
 * mọi bảng ngay khi được import (database.js:15-20, 117).
 */
const path = require("path");
const BACKEND = path.resolve(__dirname, "../sut/backend");
const sqlite3 = require(path.join(BACKEND, "node_modules/sqlite3")).verbose();

const db = new sqlite3.Database(path.join(BACKEND, "database.sqlite"));
db.get("SELECT COUNT(*) AS c FROM orders", (err, row) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log(row.c);
  db.close();
});
