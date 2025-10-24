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
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });
module.exports = upload;
