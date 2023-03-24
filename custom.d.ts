import { fileUpload } from 'express-fileupload';

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      files?: fileUpload.FileArray | null | undefined;
    }
  }
}
