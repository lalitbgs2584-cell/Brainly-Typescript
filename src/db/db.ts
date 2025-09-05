import mongoose from "mongoose";
import { config } from "../config";
const connectionString:string = String(config.mongoUri) || ""

const connectDB =async () => {
    await mongoose.connect(`${connectionString}/Second-Brain`)
    .then((result) => {
        console.log(`Database connected successfully.`)
    }).catch((err) => {
        console.log(connectionString)
        console.log(`Error connecting to database `,err.message)
    });
}

export default connectDB