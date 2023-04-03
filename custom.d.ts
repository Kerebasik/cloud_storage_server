import { fileUpload } from 'express-fileupload';

declare global {
  namespace Express {
    export interface Request {
      avatarPath:string;
      userId: string;
      files?: fileUpload.FileArray | null | undefined;
      filePath: string;
    }
  }
}
