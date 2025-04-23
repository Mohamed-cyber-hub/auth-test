import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './db/connectDb.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "https://auth-test-frontend.vercel.app/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello  Express!');
});

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    connectDb();
    console.log('Server is running on port',);
}); 