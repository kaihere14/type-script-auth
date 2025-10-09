import express from "express";
import { connectDB } from "./config";
import "dotenv/config"
import morgan from "morgan"
import cors from "cors"


const app = express();
const port = 5500
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ts_backend";

app.use(express.json({limit:"16kb"}))
app.use(morgan("dev"))
app.use(cors({
    origin : "http://localhost:5500"
}))

import userRouter from "./routes/user.routes";
app.use("/api/users",userRouter)


app.post("/",(req,res)=>{
    return res.status(200).json({message:"Home is responding"})
})

async function start() {
    try {
        await connectDB(process.env.MONGO_URI as string);
        console.log("MongoDB connected");
        app.listen(port, () => {
            console.log("server is running on port 5500 ")
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

start();