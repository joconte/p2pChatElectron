import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PersonneWithIp} from "../../model/personneWithIp";
import {NetworkAndAddressChoice} from "../../model/networkAndAddressChoice";

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

  async getOnlinePersonneWithIp(networkAndIpChoice: NetworkAndAddressChoice) {
    return await this.http.post("http://localhost:8080/chat/scan", networkAndIpChoice, this.httpOptions).toPromise();
  }

  async getNetwork() {
    return await this.http.get("http://localhost:8080/chat/network", this.httpOptions).toPromise();
  }
}
