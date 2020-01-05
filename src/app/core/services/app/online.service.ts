import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PersonneWithIp} from "../../model/personneWithIp";

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  async getOnlinePersonneWithIp() {
    return await this.http.get("http://localhost:8080/chat/scan", this.httpOptions).toPromise();
  }
}
