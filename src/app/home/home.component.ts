import { Component, OnInit } from '@angular/core';
import {OnlineService} from "../core/services/app/online.service";
import {PersonneWithIp} from "../core/model/personneWithIp";
import {Personne} from "../core/model/personne";
import {Message} from "../core/model/message";
import {MessageService} from "../core/services/app/message.service";
import {FormControl, FormGroup} from "@angular/forms";
import {SendMessageFrontToBack} from "../core/model/sendMessageFrontToBack";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  personnesWithIp: PersonneWithIp[];

  selectedPerson: PersonneWithIp;

  messages: Message[];

  messageSend: FormGroup = new FormGroup({
    message: new FormControl(''),
  });

  constructor(private onlineService: OnlineService, private messageService: MessageService) {
    this.selectedPerson = null;
  }

  async ngOnInit() {
    await this.refreshWhosOnline();
  }

  async refreshWhosOnline() {
    this.personnesWithIp = await this.onlineService.getOnlinePersonneWithIp() as PersonneWithIp[];
  }

  async selectPersonne(personWithIp: PersonneWithIp) {
    this.selectedPerson = personWithIp;
    this.refreshMessage();
  }

  async refreshMessage() {
    this.messages = await this.messageService.getAllPersonMessage(this.selectedPerson.personne.id) as Message[];
  }

  async checkEnter(event) {
    console.log(event);
    console.log(event.code);
    if (event.code != 'Enter') { //Enter keycode
      return;
    }
    await this.sendMessage();
  }

  async sendMessage() {
    let message = this.messageSend.controls['message'].value;
    if (message === "") {
      return;
    }
    let sendMessageFrontToBack = new SendMessageFrontToBack();
    sendMessageFrontToBack.cleanMessage = message;
    sendMessageFrontToBack.idPersonne = this.selectedPerson.personne.id;
    sendMessageFrontToBack.ipAdress = this.selectedPerson.ipAdress;
    sendMessageFrontToBack.signature = "test";
    await this.messageService.postMessage(sendMessageFrontToBack);
    this.messageSend.controls['message'].setValue("");
    await this.refreshMessage();
  }

}
