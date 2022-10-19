import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";
import mongoose from "mongoose";
import 'dotenv/config';
const app=express();

//db connect
mongoose.connect(process.env.DB_CONNECTION,()=>console.log("connected to db"));

//mifflewares
app.use(express.json());
app.use(cors());

//router middlewares
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

app.listen(process.env.PORT,()=>console.log(`Server running on port ${process.env.PORT}`));