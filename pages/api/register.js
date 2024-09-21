import { mongooseConnect } from "/lib/mongoose";
import User from "/models/User";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, email, password } = req.body;

            // Ensure all fields are provided
            if (!name || !email || !password ) {
                return res.status(400).json({ message: "All fields are required." });
            }

            // Connect to MongoDB
            await mongooseConnect();

            // Check if the email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use." });
            }

            // Create the new user
            await User.create({ name, email, password });

            return res.status(201).json({ message: "User Registered." });
        } catch (error) {
            console.error("Error during registration:", error);
            return res.status(500).json({ message: "Terjadi sebuah kesalahan.", error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}