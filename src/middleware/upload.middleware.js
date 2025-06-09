const multer = require("multer");

// Dùng memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
