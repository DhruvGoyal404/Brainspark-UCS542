const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL.
 * @param {Buffer} buffer - File data
 * @param {string} folder - Cloudinary folder path
 * @param {string} publicId - Optional public_id (used for overwrite/versioning)
 */
const uploadBuffer = (buffer, folder = 'brainspark/avatars', publicId) => {
    return new Promise((resolve, reject) => {
        const opts = { folder, resource_type: 'image', transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] };
        if (publicId) opts.public_id = publicId;

        const stream = cloudinary.uploader.upload_stream(opts, (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
        });
        stream.end(buffer);
    });
};

module.exports = { uploadBuffer };
