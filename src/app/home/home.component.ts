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
import {Personne} from "../core/model/personne";
import {PersonneService} from "../core/services/app/personne.service";
import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  faCog = faCog;

  onlinePersonsWithIp: PersonneWithIp[];

  personnes: Personne[];

  selectedPerson: PersonneWithIp;

  messagesSelectedPerson: Message[];

  param: boolean;

  networks: NetworkAndIpAddresses[];

  choice: NetworkAndAddressChoice;

  messageSend: FormGroup = new FormGroup({
    message: new FormControl(''),
  });

  constructor(private onlineService: OnlineService, private messageService: MessageService, private personneService: PersonneService) {
    this.selectedPerson = null;
    this.param = false;
    this.choice = null;
    this.personnes = new Array();
    this.onlinePersonsWithIp = new Array();
  }

  async ngOnInit() {
    await this.getAllPersons(this.onlinePersonsWithIp);
    interval(1000).subscribe(x => this.refreshMessage());
    interval(5000).subscribe(x => this.getOnlineAndOfflinePerson());
    this.enterParam();
  }

  async getOnlinePersons(): Promise<PersonneWithIp[]> {
    if (this.choice == null) {
      return;
    }
    return await this.onlineService.getOnlinePersonneWithIp(this.choice) as PersonneWithIp[];
  }

  async getOnlineAndOfflinePerson() {
    let onlinePersons =  await this.getOnlinePersons();
    await this.getAllPersons(onlinePersons);
  }

  async getAllPersons(onlinePersons: PersonneWithIp[]) {
    let tempPersons: Personne[] = await this.personneService.getAllPersons() as Personne[];
    let tempPersonsFinal: Personne[] = new Array();
    if (onlinePersons.length == 0) {
      this.personnes = tempPersons;
      return;
    }

    for (let person of tempPersons) {
      let online: PersonneWithIp[] = onlinePersons.filter(e => e.personne.id === person.id);
      if (online.length > 0) {
        continue;
      }
      tempPersonsFinal.push(person);
    }

    this.personnes = tempPersonsFinal;
    this.onlinePersonsWithIp = onlinePersons;
  }

  async selectOffLinePerson(person: Personne) {
    let personWithIp: PersonneWithIp = new PersonneWithIp();
    personWithIp.personne = person;
    personWithIp.ipAdress = null;
    await this.selectPersonne(personWithIp);
  }

  async selectPersonne(personWithIp: PersonneWithIp, ) {
    this.param = false;
    this.selectedPerson = personWithIp;
    await this.refreshMessage();
  }

  async refreshMessage() {
    if (this.selectedPerson == null) {
      return;
    }
    this.messagesSelectedPerson = await this.messageService.getAllPersonMessage(this.selectedPerson.personne.id) as Message[];
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
    this.choice = new NetworkAndAddressChoice();
    this.choice.ipAddress = ip;
    this.choice.networkName = networkName;
    this.param = false;
    await this.getOnlinePersons();
  }

}
