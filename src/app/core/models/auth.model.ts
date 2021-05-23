import { User } from "./user.model";

export interface UserRegisterLogin extends User {
  otp: string;
  subscriptions?: any;
}
