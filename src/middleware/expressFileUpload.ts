import fileUpload from "express-fileupload";
import {FileConfig} from '../enums/file'


export default fileUpload({
        limits: {
            fileSize: FileConfig.MAX_SIZE
        }
})