import fs from 'fs';
import { Request } from 'express';
import { IFile } from '../models/fileModel';

export class FileService {
  static createDir(req: Request, file: IFile) {
    const filePath = `${req.filePath}\\${file.user}\\${file.path}`;
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          return resolve({ message: 'File was created' });
        } else {
          return reject({ message: 'File already exist' });
        }
      } catch (e) {
        return reject({ message: 'File error' });
      }
    });
  }

  static deleteFileOrDir(req: Request, file: IFile) {
    try {
      const path = `${req.filePath}\\${file.user}\\${file.path}`;
      if (fs.existsSync(path)) {
        if (file.type === 'dir') {
          return fs.rmdirSync(path);
        } else {
          return fs.unlinkSync(path);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
