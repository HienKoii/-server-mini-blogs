// const mysql = require("mysql2");
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render yêu cầu SSL nhưng không cần CA xác thực
  },
  max: 20, // Số lượng connection tối đa trong pool
  idleTimeoutMillis: 30000, // Thời gian chờ trước khi đóng connection không sử dụng
  connectionTimeoutMillis: 2000, // Thời gian chờ để lấy connection từ pool
});

// Xử lý lỗi khi có vấn đề với pool
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Test connection khi khởi động
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Successfully connected to database");
  release();
});

module.exports = pool;
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "blogs",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// module.exports = pool.promise();
