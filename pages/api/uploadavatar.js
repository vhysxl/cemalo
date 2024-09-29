import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import os from 'os';
import fs from 'fs';
import { promisify } from "util";
import { connectDB } from "/lib/mongoose";
import User from "/models/User";

const s3Client = new S3Client({
    region: process.env.REGION_S3,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_S3,
        secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
    }
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const upload = multer({ dest: os.tmpdir() });
const uploadSingle = promisify(upload.single('file'));

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await uploadSingle(req, res);

            const avatar = req.file;
            const userId = req.body.id;

            if (!avatar) {
                return res.status(400).json({ error: "File upload failed" });
            }

            const fileExtension = avatar.originalname.split('.').pop();
            const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileName = `${uniquePrefix}.${fileExtension}`;

            const fileStream = fs.createReadStream(avatar.path);

            const params = {
                Bucket: process.env.S3_NAME,
                Key: fileName,
                Body: fileStream,
                ContentType: avatar.mimetype,
            };

            const command = new PutObjectCommand(params);
            await s3Client.send(command);

            const fileUri = `https://${process.env.S3_NAME}.s3.${process.env.REGION_S3}.amazonaws.com/${fileName}`;

            await connectDB();

            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $set: { avatar: fileUri } },
                { new: true }
            ).lean();

            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            console.log("Updated user:", updatedUser);  // Log the updated user

            res.status(200).json({
                msg: "File uploaded and avatar updated successfully",
                url: fileUri,
                user: {
                    ...updatedUser,
                    id: updatedUser._id.toString(),  // Ensure id is a string
                }
            });

        } catch (error) {
            console.error("Error during file upload:", error);
            res.status(500).json({ error: error.message || "An error occurred while processing the file" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}