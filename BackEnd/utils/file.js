const cloudinary = require("cloudinary").v2;

// Trong file chứa config Cloudinary
console.log("--- Checking Cloudinary Env Varscdssđs ---");
console.log("CLOUD_NAME:", "dq7dbaqd3");
console.log("API_KEY:", "829283612981464"); // Xem nó có giá trị không
console.log("API_SECRET:", "Jw4s1Ko7TTTH5TsBtgD8soAGpO4"); // Không log secret thật
console.log("--- End Check ---");

cloudinary.config({
  cloud_name: "dq7dbaqd3",
  api_key: "829283612981464",
  api_secret: "Jw4s1Ko7TTTH5TsBtgD8soAGpO4",
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
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