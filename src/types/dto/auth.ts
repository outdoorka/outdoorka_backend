export interface LoginModel {
  email: string;
  password: string;
}

export interface AuthResult extends LoginModel {
  _id: string;
}
