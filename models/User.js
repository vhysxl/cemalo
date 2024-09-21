    import mongoose, { model, models, Schema } from "mongoose";
    // Define the user schema
    const userSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        avatar: { type: String },
        password: { type: String }
    }, { timestamps: true });

    // Check if the model already exists to prevent recompilation errors
    export const User = models.User || model("User", userSchema)

    export default User;
