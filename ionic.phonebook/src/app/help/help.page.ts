import { Component, OnInit, NgModule } from '@angular/core';
import { MetadataService } from './../services/metadata.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  meta:any;
  msg:string;
  msgs:any;
  data:any;

  constructor(private metadata: MetadataService) { 
    this.meta = {};
    this.msg = "";
    this.msgs = [];

    this.data = [
      { "name":"Miso", "id":"1", "handler":{ edit: function(item){ console.log( "edit" + item.id); }, list: function(item){ console.log( "list" + item.id); }} },
      { "name":"Casco", "id":"2", "handler":{ edit: function(item){ console.log( "edit" + item.id); }, list: function(item){ console.log( "list" + item.id); }} },
      { "name":"DeTercomo", "id":"3", "handler":{ edit: function(item){ console.log( "edit" + item.id); }, list: function(item){ console.log( "list" + item.id); }} },
      { "name":"Dino", "id":"4", "handler":{ edit: function(item){ console.log( "edit" + item.id); }, list: function(item){ console.log( "list" + item.id); }} }
    ]
  }

  ngOnInit() {
    fetch('./assets/data/meta.json').then(res => res.json())
    .then(json => {
      this.meta = json;
      console.log(json);
    });

    this.msgs = this.metadata.getMsg();
    
    console.log(this.msgs);
  }



  setData(){
    this.metadata.addMsg(this.msg);
    this.msgs = this.metadata.getMsg();
    console.log(this.msgs);
  }

  setClear(){
    this.metadata.clearMsg();
    console.log(this.msgs);
  }

}
