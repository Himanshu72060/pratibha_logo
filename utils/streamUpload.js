// helper to upload buffer using upload_stream
const streamifier = require('streamifier');


const uploadFromBuffer = (cloudinary, buffer, folder = 'hero-slider') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );


        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};


module.exports = uploadFromBuffer;