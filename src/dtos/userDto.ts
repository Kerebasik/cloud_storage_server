import { IUser } from '../models/userModel';

class UserDto {
  _id;
  email;
  diskStorage;
  usedStorage;
  avatar;
  files;
  constructor(model: IUser) {
    this._id = model._id;
    this.email = model._id;
    this.diskStorage = model.diskStorage;
    this.usedStorage = model.usedStorage;
    this.avatar = model.avatar;
    this.files = model.files;
  }
}

export default UserDto;
