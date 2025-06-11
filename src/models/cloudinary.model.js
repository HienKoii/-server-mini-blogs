const cloudinary = require("../config/cloudinary.config");

class CloudinaryModel {
  static async uploadFiles(files, folder = "posts") {
    try {
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          // Tự nhận resource_type dựa vào mimetype
          let resourceType = "image"; // default
          if (file.mimetype.startsWith("video/")) {
            resourceType = "video";
          } else if (file.mimetype.startsWith("image/")) {
            resourceType = "image";
          } else {
            // Có thể mở rộng cho audio hoặc các loại file khác nếu cần
            throw new Error(`Unsupported file type: ${file.mimetype}`);
          }
          console.log("resourceType", resourceType);

          const base64Data = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

          const result = await cloudinary.uploader.upload(base64Data, {
            folder,
            resource_type: resourceType,
          });

          return {
            type: result.resource_type,
            url: result.secure_url,
            public_id: result.public_id,
          };
        })
      );

      return uploadResults;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload files to Cloudinary");
    }
  }

  static async deleteFile(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw new Error("Failed to delete file from Cloudinary");
    }
  }

  static async deleteMultipleFiles(publicIds = []) {
    try {
      const deleteResults = await Promise.all(
        publicIds.map(async (publicId) => {
          const result = await cloudinary.uploader.destroy(publicId);
          return {
            public_id: publicId,
            result: result.result,
          };
        })
      );
      return deleteResults;
    } catch (error) {
      console.error("Cloudinary delete multiple error:", error);
      throw new Error("Failed to delete multiple files from Cloudinary");
    }
  }

  //Lấy danh sách file trong folder
  static async listFilesInFolder(folder = "posts", maxResults = 100, resourceType = "image") {
    try {
      const result = await cloudinary.api.resources({
        type: "upload",
        prefix: folder.endsWith("/") ? folder : folder + "/", // đảm bảo có dấu /
        max_results: maxResults,
        resource_type: resourceType,
      });

      return result.resources; // mảng file
    } catch (error) {
      console.error("Cloudinary list files error:", error);
      throw new Error("Failed to list files from Cloudinary");
    }
  }
}

module.exports = CloudinaryModel;
