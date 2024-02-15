import { IUser } from "./IUser";

export interface IResponse {
  token?: string;
  user?: IUser;
  message?: string;
  status: number;
}