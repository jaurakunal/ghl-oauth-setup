import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {LoginRequestModel} from '../models/login-flow/login-request.model';
import {OauthAuthorizationModel} from '../models/login-flow/oauth-authorization.model';
import {OauthTokenModel} from '../models/login-flow/oauth-token.model';

@Injectable({
  providedIn: 'root'
})
export class GhlService {
  ghlAppLoginUrl: string;
  marketplaceAppsBaseUrl: string;
  allAppsUrl: string;
  locationsUrl: string;
  oAuthBaseUrl: string;
  authCodeUrl: string;
  authTokenUrl: string;
  marketplaceLoginUrl: string;
  marketplaceMyAppsUrl: string;

  constructor(private http: HttpClient) {
    this.ghlAppLoginUrl = "https://services.leadconnectorhq.com/oauth/2/login/email";
    this.marketplaceAppsBaseUrl = " https://services.msgsndr.com/integrations/public";
    this.allAppsUrl = "/all";
    this.locationsUrl = "/locations"
    this.oAuthBaseUrl = "https://services.msgsndr.com/oauth";
    this.authCodeUrl = "/authorize";
    this.authTokenUrl = "/token";
    this.marketplaceLoginUrl = "https://services.msgsndr.com/oauth/developers/login/email";
    this.marketplaceMyAppsUrl = "https://services.msgsndr.com/oauth/clients";
  }

  public login(loginRequest: LoginRequestModel, ghlApp: boolean) {
    const payload = {
      email: loginRequest.email,
      password: loginRequest.password
    };
    let headers;
    const url = ghlApp ? this.ghlAppLoginUrl : this.marketplaceLoginUrl;

    if (!ghlApp) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        "Version": "2021-04-15",
        "source": "DEVELOPER_WEB_USER",
        "Channel": "APP"
      });
    } else {
      headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    return this.http.post<any>(url, payload, {headers: headers});
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
    return this.http.post<any>(this.ghlAppLoginUrl, payload, {headers: headers});
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
    return this.http.post<any>(this.ghlAppLoginUrl, payload, {headers: headers});
  }

  public getAllMarketplaceApps() {
    const url: string = this.marketplaceAppsBaseUrl + this.allAppsUrl;
    return this.http.get<any>(url);
  }

  public getAppDetailsFor(appId: string) {
    const url: string = this.marketplaceAppsBaseUrl + "/" + appId;
    return this.http.get<any>(url);
  }

  public getLocations(apiKey: string, pageSize: number, skipCount: number) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    });
    const queryParams = new HttpParams()
      .set("limit", pageSize)
      .set("skip", skipCount);
    const url: string = this.marketplaceAppsBaseUrl + this.locationsUrl;
    return this.http.get<any>(url, {headers: headers, params: queryParams});
  }

  public getOAuthAuthorizationCode(apiKey: string, authCodeRequest: OauthAuthorizationModel) {
    const url: string = this.oAuthBaseUrl + this.authCodeUrl;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + apiKey
    });
    const payload = new HttpParams()
      .set("client_id", authCodeRequest.client_id)
      .set("location_id", authCodeRequest.location_id)
      .set("response_type", "code")
      .set("redirect_uri", authCodeRequest.redirect_url)
      .set("scope", authCodeRequest.scope);
    console.log(payload);
    return this.http.post<any>(url, null, {headers: headers, params: payload});
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

  public getMyApps(token: string) {
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token,
      "Version": "2021-04-15",
      "source": "DEVELOPER_WEB_USER",
      "channel": "APP"
    });
    return this.http.get<any>(this.marketplaceMyAppsUrl, {headers: headers});
  }

  public getMyAppDetail(token: string, id: string) {
    const url: string = this.marketplaceMyAppsUrl + "/" + id;
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token,
      "Version": "2021-04-15",
      "source": "DEVELOPER_WEB_USER",
      "channel": "APP"
    });
    return this.http.get<any>(url, {headers: headers});
  }

  public callRedirectUrl(url: string) {
    return this.http.get<any>(url);
  }
}
