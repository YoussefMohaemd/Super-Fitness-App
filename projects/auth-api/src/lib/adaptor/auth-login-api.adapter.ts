import { ProfileDataRes, LoginRes } from '../interface/loginRes';
import { Injectable } from '@angular/core';
import { Adapter } from '../interface/adapter';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginAPIAdapter implements Adapter {
  constructor() {}
  adapt(data: ProfileDataRes): LoginRes {
    return {
      message: data.message,
      email: data.user.email,
      token: data.token,
    };
  }
}