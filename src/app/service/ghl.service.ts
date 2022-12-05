import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {LoginRequestModel} from '../models/login-flow/login-request.model';
import {OauthAuthorizationModel} from '../models/login-flow/oauth-authorization.model';
import {OauthTokenModel} from '../models/login-flow/oauth-token.model';

@Injectable({
  providedIn: 'root'
})
export class GhlService {
  loginUrl: string;
  marketplaceBaseUrl: string;
  allAppsUrl: string;
  locationsUrl: string;
  oAuthBaseUrl: string;
  authCodeUrl: string;
  authTokenUrl: string;

  constructor(private http: HttpClient) {
    this.loginUrl = "https://services.leadconnectorhq.com/oauth/2/login/email";
    this.marketplaceBaseUrl = " https://services.msgsndr.com/integrations/public";
    this.allAppsUrl = "/all";
    this.locationsUrl = "/locations?limit=100"
    this.oAuthBaseUrl = "https://services.msgsndr.com/oauth";
    this.authCodeUrl = "/authorize";
    this.authTokenUrl = "/token";
  }

  public login(loginRequest: LoginRequestModel) {
    const payload = {
      email: loginRequest.email,
      password: loginRequest.password
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.loginUrl, payload, {headers: headers});
  }

  public requestOtp(otpRequest: LoginRequestModel) {
    const payload = {
      email: otpRequest.email,
      password: otpRequest.password,
      otpChannel: otpRequest.otpChannel
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.loginUrl, payload, {headers: headers});
  }

  public validateOtp(otpRequest: LoginRequestModel) {
    const payload = {
      email: otpRequest.email,
      password: otpRequest.password,
      otpChannel: otpRequest.otpChannel,
      otp: otpRequest.otp,
      token: otpRequest.token,
      version: otpRequest.version
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.loginUrl, payload, {headers: headers});
  }

  public getAllMarketplaceApps() {
    const url: string = this.marketplaceBaseUrl + this.allAppsUrl;
    return this.http.get<any>(url);
  }

  public getAppDetailsFor(appId: string) {
    const url: string = this.marketplaceBaseUrl + "/" + appId;
    return this.http.get<any>(url);
  }

  public getLocations(apiKey: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(this.locationsUrl, {headers: headers});
  }

  public getOAuthAuthorizationCode(authCodeRequest: OauthAuthorizationModel) {
    const url: string = this.oAuthBaseUrl + this.authCodeUrl;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const payload = new HttpParams();
    payload.set("client_id", authCodeRequest.client_id)
      .set("location_id", authCodeRequest.location_id)
      .set("response_type", "code")
      .set("redirect_url", authCodeRequest.redirect_url)
      .set("scope", authCodeRequest.scope);
    return this.http.post<any>(url, payload.toString(), {headers: headers});
  }

  public executeOAuth(oAuthRequest: OauthTokenModel) {
    const url: string = this.oAuthBaseUrl + this.authCodeUrl;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const payload = new HttpParams();
    payload.set("client_id", oAuthRequest.client_id)
      .set("client_secret", oAuthRequest.client_secret)
      .set("grant_type", "authorization_code")
      .set("code", oAuthRequest.code)
    return this.http.post<any>(url, payload.toString(), {headers: headers});
  }
}
