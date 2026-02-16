import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
dotenv.config();
import userRoute from './routes/userRoute.js';
import questionRoute from './routes/questionRoute.js';

connectDB();
let app=express();
app.use(express.json());
app.use(cors({
    origin: [
    "http://localhost:5173",
    "https://quizzer-apps.netlify.app"
  ],
    credentials:true
}));
app.use('/api/user',userRoute);
app.use('/api/question',questionRoute);

app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on port ${process.env.PORT}`);
})