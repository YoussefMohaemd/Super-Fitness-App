import { changePassword } from './interface/changePassword';
import { Injectable } from '@angular/core';
import { AuthAPI } from './base/AuthAPI';
import { map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthENDPOINT } from './enums/AuthAPI.endpoint';
import { AuthLoginAPIAdapter } from './adaptor/auth-login-api.adapter';
import { loginUser } from './interface/login';
import { LoginRes, ProfileDataRes } from './interface/loginRes';
import { AuthRegisterAPIAdapter } from './adaptor/auth-register-api.adapter';
import { registerUser } from './interface/register';
import { RegisterRes } from './interface/registerRes';
import { ForgetPassUser } from './interface/forgetPass';
import { VerifyCodeUser } from './interface/VerifyCode';
import { ResetPassUser } from './interface/ResetPass';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UpdateUserProfileData } from './interface/updateUserProfile';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService implements AuthAPI {
  private jwtHelper = new JwtHelperService();
  constructor(
    private _HttpClient: HttpClient,
    private _AuthLoginAPIAdapter: AuthLoginAPIAdapter,
    private _AuthRegisterAPIAdapter: AuthRegisterAPIAdapter,
  ) {}

  private isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  Login(data: loginUser): Observable<LoginRes | never[]> {
    return this._HttpClient
      .post(AuthENDPOINT.SIGNIN, data)
      .pipe(map((res: any) => this._AuthLoginAPIAdapter.adapt(res)));
  }

  Regester(data: registerUser): Observable<RegisterRes | never[]> {
    return this._HttpClient
      .post(AuthENDPOINT.SIGNUP, data)
      .pipe(map((res: any) => this._AuthRegisterAPIAdapter.adapt(res)));
  }

  Forgetpass(data: ForgetPassUser): Observable<any> {
    return this._HttpClient.post(AuthENDPOINT.FORGOT_PASSWORD, data);
  }

  changePassword(data: changePassword): Observable<any>{
    return this._HttpClient.patch(AuthENDPOINT.CHANGE_PASSWORD, data)


  }

  VerifyCode(data: VerifyCodeUser): Observable<any> {
    return this._HttpClient.post(AuthENDPOINT.VERIFY_RESET_CODE, data);
  }

  resetpass(data: ResetPassUser): Observable<any> {
    return this._HttpClient.put(AuthENDPOINT.RESET_PASSWORD, data);
  }


  Logout(): Observable<any> {
    return this._HttpClient.get(AuthENDPOINT.LOGOUT);
  }

  getProfileData(): Observable<ProfileDataRes> {
    return this._HttpClient.get<ProfileDataRes>(AuthENDPOINT.PROFILE_DATA);
  }

  editProfile(data: UpdateUserProfileData): Observable<ProfileDataRes> {
    return this._HttpClient.put<ProfileDataRes>(AuthENDPOINT.EDIT_PROFILE , data)
  }
  
}
