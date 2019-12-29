import { DatajsonService } from './../../services/datajson.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss'],
})
export class ListMenuComponent implements OnInit {

  @Input() from;
  options: any;
  path:string;

  constructor(
    private navCtrl:NavController,
    private srvDataJson: DatajsonService
  ) {
    this.options = [];
    this.path = "";
  }

  ngOnInit() {
     this.srvDataJson.get(this.path + this.from +".json", "fileLoadAsync", (data: any) => this.options = data );
  }

  openNavDetailsPage(item) {
    console.log(item.route);
    this.navCtrl.navigateBack(item.route);
  }
}
