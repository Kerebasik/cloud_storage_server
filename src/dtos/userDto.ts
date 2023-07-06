import { IUser } from '../models/userModel';

class UserDto {
  _id;
  email;
  subscription;
  usedStorage;
  avatar;
  files;
  constructor(model: IUser) {
    this._id = model._id;
    this.email = model.email;
    this.subscription = model.subscription;
    this.usedStorage = model.usedStorage;
    this.avatar = model.avatar;
    this.files = model.files;
  }
}

export default UserDto;
