import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Cookies from "js-cookie";
import { environment } from '../../../environments/environment';
import { RoomResponse } from '../../model/api/response';


@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private httpClient: HttpClient) { }

  logout() {
    Cookies.remove("authorization");
  }
}
