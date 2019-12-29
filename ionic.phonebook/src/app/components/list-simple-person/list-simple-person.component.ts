import { Person } from './../../model/person';
import { PersonService } from './../../services/person.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-list-simple-person',
  templateUrl: './list-simple-person.component.html',
  styleUrls: ['./list-simple-person.component.scss'],
})
export class ListSimplePersonComponent implements OnInit {

  @Output()
  onedit: EventEmitter<Person>;
  @Output()
  ondelete: EventEmitter<Person>;
  @Output()
  onlist: EventEmitter<Person>;

  @Input() title;
  data: any;

  constructor(private srvPerson: PersonService) { 
    this.onedit = new EventEmitter<Person>();
    this.onlist = new EventEmitter<Person>();
    this.ondelete = new EventEmitter<Person>();
    this.data = this.srvPerson.get();
  }

  ngOnInit() {}

  edit(item:Person){
    console.log(item);
    this.onedit.emit(item);
  }

  delete(item:Person){
    this.data = this.srvPerson.del(item.id);
    this.ondelete.emit(item);
  }
  
  list(item:Person){
    console.log(item);
    this.onlist.emit(item);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      this.data = [];
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
}
