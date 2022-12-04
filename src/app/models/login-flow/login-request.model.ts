export interface LoginRequestModel {
  email: string;
  password: string;
  otpChannel: string;
  otp: string;
  token: string;
  version: number;
}
