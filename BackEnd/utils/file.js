const cloudinary = require("cloudinary").v2;
const config = require("../config");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});


// Upload hình ảnh (avatar)
async function uploadImage(file, folder) {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!file.buffer || !allowedImageTypes.includes(file.mimetype)) {
    throw new Error("Invalid file: Must be an image (JPEG, PNG, GIF)");
  }
  return uploadToCloudinary(file, {
    folder: folder,
    resource_type: "auto",
  });
}

// Upload CV (PDF only)
async function uploadCV(file, folder) {
  const randomName = `cv_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.pdf`;
  if (!file.buffer || file.mimetype !== "application/pdf") {
    throw new Error("Invalid file: Must be a PDF");
  }
  return uploadToCloudinary(file, {
    folder: folder,
    resource_type: "raw",
    access_mode: "public",
    allowed_formats: ["pdf"],
    public_id: randomName,
  });
}

// Hàm upload chung
async function uploadToCloudinary(file, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(new Error(`Upload failed: ${error.message}`));
        else resolve(result.secure_url); console.log(result, "result" , result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
}


async function cloudinaryUpload(req, res, next) {
  try {
    if (req.file) {
      const url = await uploadImage(req.file, "users");
      req.uploadedFileUrl = url;
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