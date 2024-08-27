import { Request, Response } from "express";
import fs from "fs";
import supabase from "../config/supabaseClient";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("file ========? ", req.file);

    const filePath = req.file.path;
    const fileName = req.file.filename;
    const bucket = "images"; 

    // Upload file to Supabase storage
    const fileStream = fs.createReadStream(filePath);
    // console.log("fileStream", fileStream);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(`user-files/${fileName}`, fileStream, {
        cacheControl: '3600',
        upsert: false,
      });

      // console.log("uploadData", uploadData);
      
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return res.status(500).json({ error: "Error uploading file" });
    }

    const { data: publicUrlData, error: urlError }: any = supabase.storage
      .from(bucket)
      .getPublicUrl(`user-files/${fileName}`);

    if (urlError) {
      console.error("Error getting public URL:", urlError);
      return res.status(500).json({ error: "Error getting file URL" });
    }

    // Delete the file from local storage
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      }
    });

    // Send the public URL as a response
    res.json({ fileUrl: publicUrlData.publicURL });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Server error" });
  }
};
