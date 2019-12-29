import { Person } from './../model/person';
import { PersonService } from './../services/person.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  id:any;
  person:any;

  constructor(
    private navCtrl: NavController, 
    private route: ActivatedRoute,
    private srvPerson: PersonService
    ){

    this.id = 0;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.person = this.srvPerson.get(this.id);
  }

  save(){
    this.srvPerson.set(this.person);
    this.navCtrl.navigateForward('/list');
  }

  setAge(value){
    this.person.age = value;
  }

  setPhone(value){
    this.person.phone = value;    
  }

  setName(value){
    this.person.name = value;  
  }
}
