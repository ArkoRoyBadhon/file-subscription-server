// import fs from "fs";
// import path from "path";
// // import cloudinary from "../config/cloud";
// import catchAsyncError from "../middlewares/catchAsyncErrors";
// import File from "../models/file.model";
// import PurchasedPlan from "../models/purchasedPlan";
// import sendResponse from "../utils/sendResponse";
// import { Storage } from '@google-cloud/storage';


// const storage = new Storage({
//   keyFilename: path.join(__dirname, '../config/google-cloud-key.json'), // Path to your GCP service account key
//   projectId: 'your-project-id',
// });

// const bucket = storage.bucket('file-system');







// export const uploadFile = catchAsyncError(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }
  
//   const { filename, path: filePath, size, mimetype } = req.file;
  
//   const blob = bucket.file(filename);
//   const blobStream = blob.createWriteStream({
//     resumable: false,
//     contentType: mimetype,
//   });

//   blobStream.on('error', (err) => {
//     console.error('Upload error:', err);
//     return res.status(500).json({ message: 'Failed to upload file' });
//   });
  
//   blobStream.on('finish', async () => {
//     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    
//     // Save file info to your database
//     const file = await File.create({
//       filename,
//       path: publicUrl,
//       size,
//       mimetype,
//     });

//     res.status(201).json({
//       message: 'File uploaded successfully',
//       data: file,
//     });
//   });

//   fs.createReadStream(filePath).pipe(blobStream);
// });



// export const accessFileController = catchAsyncError(async (req, res) => {
//   const fileId = req.params.fileId;

//   const isFileExist = await File.findById(fileId);
//   if (!isFileExist) {
//     return sendResponse(res, {
//       message: 'File not found',
//       success: false,
//       data: null,
//       statusCode: 404,
//     });
//   }

//   // Verify subscription status
//   const planId = req.purchasedPlanId as string;
//   if (!isFileExist.isFree) {
//     await PurchasedPlan.findByIdAndUpdate(
//       planId,
//       { $inc: { limit: -1 } },
//       { new: true }
//     );
//   }

//   // Serve the file URL from GCS
//   const fileUrl = isFileExist.path;
//   res.redirect(fileUrl); // Redirect the user to the file URL
// });


// export const deleteFile = catchAsyncError(async (req, res) => {
//   const fileId = req.params.fileId;

//   const isFileExist = await File.findById(fileId);
//   if (!isFileExist) {
//     return sendResponse(res, {
//       message: 'File not found',
//       success: false,
//       data: null,
//       statusCode: 404,
//     });
//   }

//   const filePath = isFileExist.path;
//   const fileName = path.basename(filePath);

//   // Delete the file from GCS
//   const file = bucket.file(fileName);
//   await file.delete();

//   // Delete file information from your database
//   await File.findByIdAndDelete(isFileExist._id);

//   sendResponse(res, {
//     message: 'File deleted successfully',
//     success: true,
//     data: null,
//     statusCode: 200,
//   });
// });


// export const getSigninUrl = catchAsyncError(async (req, res) => {
//   const fileId = req.params.fileId;
//   const isFileExist = await File.findById(fileId);
//   if (!isFileExist) {
//     return sendResponse(res, {
//       message: 'File not found',
//       success: false,
//       data: null,
//       statusCode: 404,
//     });
//   }

//   const fileName = isFileExist.filename;
//   const options = {
//     version: 'v4',
//     action: 'read',
//     expires: Date.now() + 60 * 60 * 1000, // 1 hour
//   };

//   // Generate signed URL
//   const [url] = await bucket.file(fileName).getSignedUrl(options);

//   sendResponse(res, {
//     message: 'Successfully generated signed URL',
//     data: url,
//     success: true,
//   });
// });


// // export const accessFileController = catchAsyncError(async (req, res) => {
// //   const fileId = req.params.fileId;

// //   const isFileExist = await File.findById(fileId);
// //   if (!isFileExist) {
// //     return sendResponse(res, {
// //       message: "file not found",
// //       success: false,
// //       data: null,
// //       statusCode: 404,
// //     });
// //   }

// //   const fileName = isFileExist.filename;

// //   const existInLocal = fs.existsSync(isFileExist.path);
// //   if (!existInLocal) {
// //     return sendResponse(res, {
// //       message: "file not found maybe its deleted from the folder",
// //       success: false,
// //       data: null,
// //       statusCode: 404,
// //     });
// //   }

// //   const file = path.join(__dirname, "..", "files", fileName);
// //   const planId = req.purchasedPlanId as string;

// //   if (!isFileExist.isFree) {
// //     await PurchasedPlan.findByIdAndUpdate(
// //       planId,
// //       { $inc: { limit: -1 } },
// //       { new: true }
// //     );
// //   }
// //   res.sendFile(file);
// // });


// // export const uploadFile = catchAsyncError(async (req, res) => {
// //   if (!req.file) {
// //     return res.status(400).json({ message: "No file uploaded" });
// //   }

// //   const { filename, path, size, mimetype } = req.file;

// //   const file = await File.create({ filename, path, size, mimetype });

// //   res.status(201).json({
// //     message: "File uploaded successfully",
// //     data: file,
// //   });
// // });

// // export const deleteFile = catchAsyncError(async (req, res) => {
// //   const fileId = req.params.fileId;

// //   const isFileExist = await File.findById(fileId);
// //   if (!isFileExist) {
// //     return sendResponse(res, {
// //       message: "file not found",
// //       success: false,
// //       data: null,
// //       statusCode: 404,
// //     });
// //   }

// //   const filePath = isFileExist.path;
// //   if (fs.existsSync(filePath)) {
// //     fs.unlinkSync(filePath);
// //   }
// //   const delteFile = await File.findByIdAndDelete(isFileExist._id);
// //   sendResponse(res, {
// //     message: "file deleted successfully",
// //     success: true,
// //     data: null,
// //     statusCode: 200,
// //   });
// // });

// // export const getSigninUrl = catchAsyncError(async (req, res) => {
// //   const fileId = req.params.fileId;
// //   const isFileExist = await File.findById(fileId);
// //   if (!isFileExist) {
// //     return sendResponse(res, {
// //       message: "file not found",
// //       success: false,
// //       data: null,
// //       statusCode: 404,
// //     });
// //   }

// //   const publicId = isFileExist.filename.split("Files/")[1];
// //   console.log(isFileExist.filename);

// //   const url = cloudinary.utils.private_download_url(
// //     "j6s7lsl8s7insh9gpydq",
// //     "mp4",
// //     {
// //       // type: "private",
// //       expires_at: Math.floor(Date.now() / 1000) + 3600, // URL expires in 30sec
// //     }
// //   );

// //   console.log(url);

// //   sendResponse(res, {
// //     message: "successfully get signin url",
// //     data: url,
// //     success: true,
// //   });
// // });
