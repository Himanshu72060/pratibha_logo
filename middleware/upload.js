// const multer = require("multer");
// const path = require("path");

// // Memory storage (buffer ke liye)
// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//     let ext = path.extname(file.originalname).toLowerCase();
//     if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//         cb(new Error("Only images are allowed"), false);
//         return;
//     }
//     cb(null, true);
// };

// module.exports = multer({ storage, fileFilter });

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'courses', // folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage });
module.exports = upload;

