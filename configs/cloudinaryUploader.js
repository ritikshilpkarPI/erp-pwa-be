const cloudinary = require('./cloudinaryConfig');

// Upload image to Cloudinary
const cloudinaryImage = async (image) => {
    try {
        console.log({ image });
        const result = await cloudinary.uploader.upload(`data:${image.mimetype};base64,${btoa(Buffer.from(image?.data).toString('binary'))}`, {
            folder: 'ERP'
        });
        return result;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};

module.exports = cloudinaryImage;