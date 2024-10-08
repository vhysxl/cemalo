import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import os from 'os';
import multer from "multer";
import { promisify } from 'util'; // Promisify multer's upload function

export const config = {
    api: {
        bodyParser: false,
    },
};

const upload = multer({ dest: os.tmpdir() });
const fileManager = new GoogleAIFileManager(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Promisify multer's single file handler
const uploadSingle = promisify(upload.single('file'));

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Wrap multer's upload.single in a promise to properly handle async flow
            await uploadSingle(req, res);

            const document = req.file;
            const prompt = req.body.prompt;

            console.log(document)

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            });

            if (document) {
                // Handle file upload and content generation
                const uploadResponse = await fileManager.uploadFile(document.path, {
                    mimeType: document.mimetype,
                    displayName: document.originalname,
                });

                const result = await model.generateContent([
                    {
                        fileData: {
                            mimeType: uploadResponse.file.mimeType,
                            fileUri: uploadResponse.file.uri,
                        },
                    },
                    { text: prompt },
                ]);

                const uri = uploadResponse.file.uri;
                const llmResponse = result.response.text();
                const mimeType = uploadResponse.file.mimeType
                const fileName = uploadResponse.file.displayName
                
                // Send the response with result and uri
                res.status(200).json({ result: llmResponse, uri, prompt, mimeType, fileName });
            } else {
                // Handle follow-up question if no file is uploaded
                const followUpQuestion = req.body.prompt;
                const uri = req.body.uri;
                const mimeType = req.body.mimeType;

                const resultFollowUp = await model.generateContent([
                    {
                        fileData: {
                            mimeType: mimeType,
                            fileUri: uri,
                        },
                    },
                    { text: followUpQuestion },
                ]);

                const result = resultFollowUp.response.text();

                res.status(200).json({ result: result });
            }
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(400).json({ error: error.message || "An error occurred while processing the file" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}