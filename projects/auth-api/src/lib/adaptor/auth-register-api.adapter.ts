import { ProfileDataRes } from './../interface/loginRes';
import { Injectable } from '@angular/core';
import { Adapter } from '../interface/adapter';
import { RegisterRes } from '../interface/registerRes';

@Injectable({
  providedIn: 'root'
})
export class AuthRegisterAPIAdapter implements Adapter {

  constructor() { }
  adapt(data:ProfileDataRes):RegisterRes{
     return {
      message:data.message,
      token:data.token,
      user:data.user.email
     }
  }
}