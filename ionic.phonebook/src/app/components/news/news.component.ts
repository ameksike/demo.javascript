import { DatajsonService } from './../../services/datajson.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {

  @Input() from;
  options: any;

  constructor(
    private srvDataJson: DatajsonService
  ) { }

  ngOnInit() {
    this.srvDataJson.get( this.from +".json", "fileLoadAsync", (data: any) => this.options = data );
 }

}
