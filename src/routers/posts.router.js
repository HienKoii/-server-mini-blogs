const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const { create, getAllPublicPosts, updatePost } = require("../controllers/posts.controller");
const upload = require("../middleware/upload.middleware");
const { body } = require("express-validator");

router.post("/create", verifyToken, upload.array("files", 10), create);
router.get("/public", getAllPublicPosts);

// Update post
router.put("/update/:id", verifyToken, upload.array("files", 10), updatePost);

module.exports = router;
