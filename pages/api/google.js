import { connectDB } from "../../lib/mongoose";
import { User } from "../../models/User";
import { NextResponse } from "next/server";

export default async function POST(req) {
    try {
        // Parse the request body
        const body = await req.body;
        const { name, email } = body;

        // Check if name and email are valid
        if (typeof name !== 'string' || typeof email !== 'string' || !name || !email) {
            return NextResponse.json({ error: 'Invalid name or email' }, { status: 400 });
        }

        // Connect to the database and create user
        await connectDB();
        await User.create({ name, email });

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
