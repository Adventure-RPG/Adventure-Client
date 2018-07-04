export interface RegistrateReq extends LoginReq {
  username: string;
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface Body {
  token: string;
}

export interface LoginResponse {
  location: string;
  statusCode: number;
  body: Body;
}
