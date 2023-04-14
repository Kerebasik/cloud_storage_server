import { NextFunction, Request, Response } from 'express';

function avatarPathMiddleware(path: string) {
  return function (req: Request, res: Response, next: NextFunction): void {
    req.avatarPath = path;
    next();
  };
}
export default avatarPathMiddleware;
