import { NextFunction, Request, Response } from 'express';

function avatarPath(path:string){
  return  function (req: Request, res: Response, next: NextFunction): void {
    req.avatarPath = path
    next();
  }
}
export default avatarPath;
