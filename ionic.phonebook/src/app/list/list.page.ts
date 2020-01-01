import { PersondbService } from './../services/persondb.service';
import { DatajsonService } from './../services/datajson.service';
import { PersonService } from './../services/person.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
//import { FileChooser } from '@ionic-native/file-chooser/ngx';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  persons: any;
  constructor(
      private navCtrl: NavController, 
      private srvPerson: PersonService,
      private srvDataJson: DatajsonService,
      private srvDataDb: PersondbService
      //private fileChooser: FileChooser
  ) { }

  ngOnInit() {
    this.persons = this.srvPerson.get();
  }

  list(event){
    this.navCtrl.navigateForward('/details/'+ event.id);
  } 
  
  edit(event){
    this.navCtrl.navigateForward('/edit/'+ event.id);
  }

  import(){
    console.log("AAAAAAAAAAAA");
    var dta;

    //console.log(this.srvDataJson.fileLoad("./assets/data/menu.json"));

    dta =  this.srvDataDb.getFullPath();
    console.log(dta);
    /*
    this.srvDataJson.fileLoad2("./assets/data/menu.json", (data: void) => {
      console.log(data);  
    });*/

    
    /*this.fileChooser.open()
    .then(uri => console.log(uri))
    .catch(e => console.log(e));*/  
  }
}
