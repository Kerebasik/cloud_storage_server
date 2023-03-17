import fs from 'fs';
import MainAppConfig from "../config/appConfig";
import {IFile} from "../models/fileModel";


export class FileService{
    static createDir(file:IFile){
        const filePath = `${MainAppConfig.FILE_PATH}\\${file.user}\\${file.path}`
        return new Promise(((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'File was created'})
                } else {
                    return reject({message: "File already exist"})
                }
            } catch (e) {
                return reject({message: 'File error'})
            }
        }))
    }
}

