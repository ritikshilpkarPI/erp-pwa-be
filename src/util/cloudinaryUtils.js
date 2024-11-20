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
const uploadPdfToCloudinary = async (pdfBuffer) => {
    try {
        // Create a base64 string from the PDF buffer
        const base64Data = pdfBuffer.toString('base64');

        // Upload the PDF buffer to Cloudinary as raw data
        const result = await cloudinary.uploader.upload(`data:application/pdf;base64,${base64Data}`, {
            folder: 'ERP',
            resource_type: 'raw' // Specify raw resource type for non-image files
        });

        return result;
    } catch (error) {
        console.error('Error uploading PDF to Cloudinary:', error);
        throw error;
    }
};

module.exports = {uploadImageToCloudinary,uploadPdfToCloudinary};