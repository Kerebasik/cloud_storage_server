import Router from 'express';
import {FileController} from "../controllers/fileController";
import authMiddleware from "../middleware/authMiddleware";

const fileRouter = Router();

fileRouter.post('', authMiddleware, FileController.createDir)
fileRouter.get('', authMiddleware, FileController.getFiles)

export default fileRouter