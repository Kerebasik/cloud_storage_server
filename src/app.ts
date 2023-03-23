import express, {Express} from 'express';
import authRoutes from "./routes/authRoutes";
import fileRouter from "./routes/fileRoutes";
import expressFileUpload from "./middleware/fileUploadMiddleware";
import cors from './middleware/corsMiddleware';
import User from './models/userModel';

const app:Express = express()
app.use(express.json());

app.use(expressFileUpload)
app.use(cors);
app.use("/api/auth", authRoutes);
app.use("/api/file", fileRouter);

app.get("/",async (req, res)=>{
    return res.json(await User.find())
})

export default app;