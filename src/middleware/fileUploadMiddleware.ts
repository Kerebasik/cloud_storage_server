import fileUpload from 'express-fileupload';
import { FileConfig } from '../config/fileConfig';

export default fileUpload({
  limits: {
    fileSize: FileConfig.MAX_SIZE,
  },
});
