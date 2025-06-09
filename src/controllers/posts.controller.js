const Posts = require("../models/posts.model");
const { uploadFiles } = require("../models/cloudinary.model");

exports.create = async (req, res) => {
  try {
    const user = req.user;
    const { content, folder, privacy } = req.body;
   

    let mediaUrls = [];

    // Nếu có file upload thì xử lý upload lên Cloudinary
    if (req.files && req.files.length > 0) {
      console.log("Số lượng file nhận được:", req.files.length);

      // Upload từng ảnh và lấy URL
      const uploadResults = await uploadFiles(req.files, folder);
  

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

    const postId = await Posts.create(postData);

    res.status(201).json({
      message: "Đăng bài viết thành công",
      postId,
      media: mediaUrls,
    });
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getAllPublicPosts = async (req, res) => {
  try {
    const posts = await Posts.findAllPublicPostsWithUser();
    console.log('posts', posts)

    res.status(200).json(posts);
  } catch (error) {
    console.error("Lỗi khi lấy bài viết công khai:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
