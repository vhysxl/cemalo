import mongoose, { model, models, Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUri: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    conversations: [{
        prompt: { type: String, },
        result: { type: String, }
    }],
    lastSaved: {
        type: Date,
        default: Date.now
    }
});

// Use existing model or create it if it doesn't exist
export const Chats = models.Chats || model("Chats", chatSchema);

export default Chats;
