export interface User {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  countryCode?: string;
  country?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
