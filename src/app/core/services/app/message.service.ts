import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SendMessageFrontToBack} from "../../model/sendMessageFrontToBack";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  async getAllPersonMessage(idPersonne: number) {
    return await this.http.get(this.stringformat("http://localhost:8080/chat/conversation/{0}",idPersonne), this.httpOptions).toPromise();
  }

  async postMessage(sendMessageFrontToBack: SendMessageFrontToBack) {
    return await this.http.post("http://localhost:8080/chat/send", sendMessageFrontToBack, this.httpOptions).toPromise();
  }

  async getAllMessages() {
    return await this.http.get("http://localhost:8080/chat/conversation", this.httpOptions).toPromise();
  }

  stringformat(...args: any[]) {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
      var reg = new RegExp("\\{" + i + "\\}", "gm");
      s = s.replace(reg, arguments[i + 1]);
    }
    return s;
  };
}
