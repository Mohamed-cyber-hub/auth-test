import mongoose from 'mongoose';
export const connectDb = async () => { 
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${mongoose.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error:", error.message)
        process.exit(1)// exit the process with a non-zero status code
    }
}