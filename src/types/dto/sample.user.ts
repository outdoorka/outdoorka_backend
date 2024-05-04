export interface IUserModel {
  name: string;
  email: string;
  photo: string;
}

export interface UserResult extends IUserModel {
  _id: string;
}
