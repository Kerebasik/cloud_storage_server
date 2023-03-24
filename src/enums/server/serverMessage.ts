export enum ServerMessage {
  Error = 'Server error',
  UncorrectedReq = 'Uncorrected request',
}

export enum ServerMessageError {
  UploadError = 'Upload error',
  AuthError = 'Auth error',
  SearchError = 'Search error',
}

export enum ServerMessageDisk {
  NoSpaceDisk = 'No space on the disk',
}

export enum ServerMessageFile {
  FileNotFound = 'File not found',
  FileDelete = 'File was delete',
  FileCreate = 'File is create',
  FileAlready = 'File already exist',
}

export enum ServerMessageUser {
  UserWithEmailAlready = 'User with email already exist',
  UserCreated = 'User was created',
  UserNotFound = 'User not found',
  UserPassIsNotValid = 'Invalid password',
}
