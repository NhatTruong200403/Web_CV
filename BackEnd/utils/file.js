const cloudinary = require("cloudinary").v2;
// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload hình ảnh
async function uploadImage(file, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject("Upload failed");
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(file.buffer);
  });
}

// Upload CV
async function uploadCV(file) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      {
        folder: "cv_uploads",
        resource_type: "raw", // Cho phép upload các file không phải ảnh
        // Giới hạn loại file nếu cần
        allowed_formats: ["pdf", "doc", "docx"],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

// Middleware upload
async function cloudinaryUpload(req, res, next) {
  try {
    // Nếu có file ảnh
    if (req.file) {
      const uploadResult = await uploadImage(req.file);
      req.uploadedFileUrl = uploadResult.secure_url;
    }

    next();
  } catch (error) {
    res.status(400).json({
      message: "Upload thất bại",
      error: error.message,
    });
  }
}

module.exports = {
  uploadImage,
  uploadCV,
  cloudinaryUpload,
};
