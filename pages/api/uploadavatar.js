import { connectDB } from "/lib/mongoose";
import User from "/models/User";

export default async function handler(req, res) {
    if (req.method === 'POST') {

        try {
            //konek bucket gcp atau bucket s3
            const { userid, avatar } = req.body;

            //connect DB
            await connectDB();

            //handle query DB
            await User.insertOne({ avatar })
            //res(200)

        } catch (error) {
            //send(500, error)
        }
    }





}