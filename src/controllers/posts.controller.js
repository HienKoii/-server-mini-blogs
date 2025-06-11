const Posts = require("../models/posts.model");
const { uploadFiles, deleteFile, deleteMultipleFiles } = require("../models/cloudinary.model");

exports.create = async (req, res) => {
  try {
    const user = req.user;
    const { content, privacy } = req.body;

    let mediaUrls = [];

    // Nếu có file upload thì xử lý upload lên Cloudinary
    if (req.files && req.files.length > 0) {
      console.log("Số lượng file nhận được:", req.files.length);

      // Upload từng ảnh và lấy URL
      const uploadResults = await uploadFiles(req.files, `posts/${req.user.id}`);

      // Lọc ra những ảnh upload thành công
      mediaUrls = uploadResults.filter((url) => url !== null);
    }

    // Dữ liệu post
    const postData = {
      user_id: user.id,
      content,
      media: JSON.stringify(mediaUrls),
      status: privacy === "private" ? 1 : 0,
    };

    await Posts.create(postData);

    res.status(201).json({
      message: "Đăng bài viết thành công",
    });
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getAllPublicPosts = async (req, res) => {
  try {
    const posts = await Posts.findAllPublicPostsWithUser();

    res.status(200).json(posts);
  } catch (error) {
    console.error("Lỗi khi lấy bài viết công khai:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { content, status } = req.body;

    const keepMedias = JSON.parse(req.body.keepMedias || "[]"); // Mảng public_id
    const files = req.files;

    // 1. Kiểm tra quyền
    const post = await Posts.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });

    if (parseInt(post.user_id) !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền sửa bài viết này" });
    }

    // 2. Parse lại media từ DB (vì lưu dưới dạng JSON string)
    const oldMedia = post.media || [];

    // 3. Lọc media cần xóa
    const removedMedia = oldMedia.filter((img) => !keepMedias.includes(img.public_id));
    // Optional: Xoá media cũ khỏi Cloudinary
    if (removedMedia.length > 0) {
      const publicIdsToDelete = removedMedia.map((img) => img.public_id);
      await deleteMultipleFiles(publicIdsToDelete);
    }

    // 4. Upload media mới nếu có
    let uploadedMedia = [];
    if (files && files.length > 0) {
      const uploadResults = await uploadFiles(files, `posts/${userId}`);
      uploadedMedia = uploadResults.filter((url) => url !== null);
    }

    // 5. Gộp media mới và media được giữ lại
    const updatedMedia = [
      ...oldMedia.filter((img) => keepMedias.includes(img.public_id)), // media giữ lại
      ...uploadedMedia, // media mới
    ];

    // 6. Cập nhật bài viết
    const updated = await Posts.update(postId, {
      content,
      media: JSON.stringify(updatedMedia),
      status,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài viết để cập nhật" });
    }

    res.json({
      success: true,
      message: "Cập nhật bài viết thành công",
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
