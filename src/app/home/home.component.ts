import {Component, OnInit} from '@angular/core';
import {OnlineService} from "../core/services/app/online.service";
import {PersonneWithIp} from "../core/model/personneWithIp";
import {Message} from "../core/model/message";
import {MessageService} from "../core/services/app/message.service";
import {FormControl, FormGroup} from "@angular/forms";
import {SendMessageFrontToBack} from "../core/model/sendMessageFrontToBack";
import {NetworkAndIpAddresses} from "../core/model/networkAndIpAddresses";
import {NetworkAndAddressChoice} from "../core/model/networkAndAddressChoice";
import {interval} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  personnesWithIp: PersonneWithIp[];

  selectedPerson: PersonneWithIp;

  messages: Message[];

  param: boolean;

  networks: NetworkAndIpAddresses[];

  choice: NetworkAndAddressChoice;

  messageSend: FormGroup = new FormGroup({
    message: new FormControl(''),
  });

  constructor(private onlineService: OnlineService, private messageService: MessageService) {
    this.selectedPerson = null;
    this.param = false;
    this.choice = new NetworkAndAddressChoice();
  }

  async ngOnInit() {
    await this.refreshWhosOnline();
    interval(1000).subscribe(x => this.refreshMessage())
  }

  async refreshWhosOnline() {
    this.personnesWithIp = await this.onlineService.getOnlinePersonneWithIp(this.choice) as PersonneWithIp[];
  }

  async selectPersonne(personWithIp: PersonneWithIp) {
    this.param = false;
    this.selectedPerson = personWithIp;
    await this.refreshMessage();
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

  async getNetworks() {
    this.networks = await this.onlineService.getNetwork() as NetworkAndIpAddresses[];
  }

  async enterParam() {
    this.selectedPerson = null;
    await this.getNetworks();
    this.param = true;
  }

  async selectIp(networkName, ip) {
    this.choice.ipAddress = ip;
    this.choice.networkName = networkName;
    this.param = false;
    await this.refreshWhosOnline();
  }

}
