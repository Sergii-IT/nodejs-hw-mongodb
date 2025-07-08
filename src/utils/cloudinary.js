import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { config } from 'dotenv';

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error('Missing image buffer'));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'contacts-app',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error('Image upload failed'));
        }
        resolve(result.secure_url);
      },
    );

    Readable.from(buffer).pipe(stream);
  });
};
