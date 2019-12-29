import { PersonService } from './../services/person.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
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

}
