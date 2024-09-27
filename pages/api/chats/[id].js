import Chats from "/models/Chats"
import { connectDB } from "/lib/mongoose"

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            if (req.query.id) {
                const chat = await Chats.findById(req.query.id);
                if (chat) {
                    res.status(200).json(chat);
                } else {
                    res.status(404).json({ message: "Chat not found" });
                }
            } else {
                res.status(400).json({ message: "Missing id parameter" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}