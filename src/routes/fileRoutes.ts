import Router from 'express';
import {FileController} from "../controllers/fileController";
import authMiddleware from "../middleware/authMiddleware";

const fileRouter = Router();

fileRouter.post('', authMiddleware, FileController.createDir)
fileRouter.post('/uploadAlone', authMiddleware, FileController.uploadFile)
fileRouter.get('', authMiddleware, FileController.getFiles)
fileRouter.get('/download', authMiddleware, FileController.downloadFile)
fileRouter.delete('/delete', authMiddleware, FileController.deleteFile)
fileRouter.get('/search', authMiddleware, FileController.searchFiles)

export default fileRouter