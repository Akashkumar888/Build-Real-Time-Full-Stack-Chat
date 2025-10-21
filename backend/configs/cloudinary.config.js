
import {v2 as cloudinary} from 'cloudinary'


  cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY
  })


export default cloudinary;   


// import { v2 as cloudinary } from 'cloudinary';
// const connectCloudinary = () => {
//   if (!process.env.CLOUDINARY_CLOUD_NAME ||
//       !process.env.CLOUDINARY_API_KEY ||
//       !process.env.CLOUDINARY_SECRET_KEY) {
//     throw new Error('Cloudinary environment variables missing!');
//   }
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET_KEY,
//   });
//   console.log('✅ Cloudinary configured');
// };
// export default { cloudinary, connectCloudinary };


// import cloudinarySetup from './cloudinary.js';
// cloudinarySetup.connectCloudinary(); // configure first
// // Now use cloudinarySetup.cloudinary anywhere
// const result = await cloudinarySetup.cloudinary.uploader.upload('path/to/image.jpg');
