import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PersonIdAndName} from "../../model/personIdAndName";

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  async getAllPersons() {
    return await this.http.get("http://localhost:8080/chat/persons", this.httpOptions).toPromise();
  }

  async changeName(personIdAndName: PersonIdAndName) {
    return await this.http.post("http://localhost:8080/chat/persons/change-name", personIdAndName, this.httpOptions).toPromise();
  }
}
