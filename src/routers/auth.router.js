const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const profileController = require("../controllers/profile.controller");
const verifyToken = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", verifyToken, authController.me);

// Profile routes
router.get("/profile/:id", profileController.getProfileById);
router.put(
  "/profile/update",
  verifyToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
  ]),
  profileController.updateProfile
);

router.put("/profile/update-avatar", verifyToken, profileController.updateAvatar);
router.put("/profile/update-cover", verifyToken, profileController.updateCoverImage);

router.post("/profile/delete-avatar", verifyToken, profileController.deleteAvatar);
router.post("/profile/delete-cover", verifyToken, profileController.deleteCoverImage);

module.exports = router;
