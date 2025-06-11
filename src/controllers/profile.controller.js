const User = require("../models/user.model");
const Posts = require("../models/posts.model");
const { uploadFiles, listFilesInFolder, deleteFile } = require("../models/cloudinary.model");

// Lấy thông tin profile của người dùng khác
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    // lấy danh sách avatar
    const listAvatar = await listFilesInFolder(`avatar/${user.id}`);
    const listCoverImage = await listFilesInFolder(`coverImage/${user.id}`);
    user.listAvatar = listAvatar ? listAvatar : [];
    user.listCoverImage = listCoverImage ? listCoverImage : [];

    // Lấy số bài viết
    const posts = await Posts.findAllByWithUserId(user.id);
    user.posts_count = posts.length;
    user.posts = posts;

    res.json(user);
  } catch (error) {
    console.error("Get profile by id error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật thông tin profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const avatarFile = req.files["avatar"];
    const coverImageFile = req.files["cover_image"];

    let avatarUrl = null;
    let coverImageUrl = null;

    // Nếu có file avatar mới
    if (avatarFile) {
      const folder = `avatar/${req.user.id}`;
      const uploadResultsAvatarFile = await uploadFiles(avatarFile, folder);
      if (uploadResultsAvatarFile && uploadResultsAvatarFile.length > 0) {
        avatarUrl = uploadResultsAvatarFile;
      }
    }
    if (coverImageFile) {
      const folder = `coverImage/${req.user.id}`;
      const uploadResultsCoverImageUrl = await uploadFiles(coverImageFile, folder);
      if (uploadResultsCoverImageUrl && uploadResultsCoverImageUrl.length > 0) {
        coverImageUrl = uploadResultsCoverImageUrl;
      }
    }
    const updated = await User.updateProfile(req.user.id, { name, bio, avatarUrl, coverImageUrl });
    if (!updated) {
      return res.status(400).json({ message: "Không thể cập nhật thông tin" });
    }

    const user = await User.findById(req.user.id);

    // lấy danh sách avatar
    const listAvatar = await listFilesInFolder(`avatar/${user.id}`);
    const listCoverImage = await listFilesInFolder(`coverImage/${user.id}`);
    user.listAvatar = listAvatar ? listAvatar : [];
    user.listCoverImage = listCoverImage ? listCoverImage : [];

    // Lấy số bài viết
    const posts = await Posts.findAllByWithUserId(user.id);
    user.posts_count = posts.length;
    user.posts = posts;
    res.json({
      message: "Cập nhật thông tin thành công",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    await User.updateAvatar(req.user.id, req.body.image);
    res.json({ message: "Cập nhật thông tin thành công" });
  } catch (error) {
    console.log("error updateAvatar: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateCoverImage = async (req, res) => {
  try {
    await User.updateCoverImage(req.user.id, req.body.image);
    res.json({ message: "Cập nhật thông tin thành công" });
  } catch (error) {
    console.log("error updateAvatar: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    const { image } = req.body;
    let isDelete = false;

    const avatar = await User.findAvatarById(req.user.id);
    console.log("avatar", avatar);
    if (avatar && image.public_id === avatar[0]?.public_id) {
      await User.updateAvatar(req.user.id, []);
      isDelete = true;
    }
    await deleteFile(image.public_id);

    res.json({ message: "Cập nhật ảnh đại diện thành công", isDelete });
  } catch (error) {
    console.log("error deleteAvatar: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.deleteCoverImage = async (req, res) => {
  try {
    const { image } = req.body;
    let isDelete = false;

    const cover = await User.findCoverImageById(req.user.id);

    if (cover && image.public_id === cover[0]?.public_id) {
      await User.updateCoverImage(req.user.id, []);
      isDelete = true;
    }
    await deleteFile(image.public_id);

    res.json({ message: "Cập nhật ảnh bìa thành công", isDelete });
  } catch (error) {
    console.log("error deleteCoverImage: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
