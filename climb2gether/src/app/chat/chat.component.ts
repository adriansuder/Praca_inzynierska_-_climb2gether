import { Component, OnInit } from '@angular/core';

interface Message {
  id: number;
  userName: string;
  message: string;
  messageDate: string;
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
   date = new Date();
 MESSAGES: Message[] = [
    { "id": 0,"userName": 'Jan', "message": "Availableasdasdasd asda sad sdasd asd asd asd asd asd asd asd a", "messageDate":(this.date.toLocaleString().toString()) },
      { "id": 1,"userName": 'Jan', "message": "Ready asd asd asd asd asdsa sfsd fsdf sdfsdf sdf sdf sd fsdf sdf ", "messageDate":(this.date.toLocaleString())},
      { "id": 2,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 3,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 4,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 5,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 6,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg sfsfsdfsdfv sdfdsfsfsdfsdf sdfsdfs sdfdf etrehgffvbcv cvdfgergrberb tgbrtrtyhbnytnjghjghj fghdgdfgdfgbr  fhfghfhdfgdfgb dfg dfgbdfbgdfbgdfgbgbd fgbfdbgdfgdfgsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf dfgbdfbgdfbgdfgbd dfgdfgbdfgbdf fgbdfgbdfgb", "messageDate":(this.date.toLocaleString()) },
      { "id": 7,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 8,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 9,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 2,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 3,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 4,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 5,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 6,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 7,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 8,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) },
      { "id": 9,"userName": 'Jan', "message": "Started sdf sdf sdf sd fsdf sdf sdf sd fefwersef dsfg rt ergt dg dsg ", "messageDate":(this.date.toLocaleString()) }
  ];

  blabla = ['bla1', 'bla1', 'bla1'];
  constructor() { }

  ngOnInit(): void {
  }

}
