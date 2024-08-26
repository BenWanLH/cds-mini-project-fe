import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../model/api/response';

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string) {
    return this.httpClient.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
      username,
      password
    })
  }
}
