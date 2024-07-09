const cloudinary = require('../configs/cloudinaryConfig');

// Upload image to Cloudinary
const uploadImageToCloudinary = async (image) => {
    try {
        
        const result = await cloudinary.uploader.upload(`data:${image.mimetype};base64,${btoa(Buffer.from(image?.data).toString('binary'))}`, {
            folder: 'ERP'
        });
        return result;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};

module.exports = {uploadImageToCloudinary};