const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const { create, getAllPublicPosts } = require("../controllers/posts.controller");
const upload = require("../middleware/upload.middleware");

router.post("/create", verifyToken, upload.array("files", 10), create);
router.get("/public", getAllPublicPosts);

module.exports = router;
