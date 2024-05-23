import cloudinary from '../config/cloudinary';

export const uploadImage = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image'
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary: ' + error.message);
  }
};

export const uploadAudio = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video'
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Failed to upload audio to Cloudinary: ' + error.message);
  }
};
