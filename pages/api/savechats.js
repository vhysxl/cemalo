import { connectDB } from "/lib/mongoose";
import Chats from "/models/Chats";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { userId, fileUri, fileName, mimeType, conversations } = req.body;

            console.log(req.body)
            await connectDB()

            await Chats.create({ userId, fileUri, fileName, mimeType, conversations })
            return res.status(201).json({ message: "chat tersimpan!" })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "gagal menyimpan chat" })
        }
    } else {
        console.log("gagal cokkk")
    }

}