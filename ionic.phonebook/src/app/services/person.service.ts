import { DatajsonService } from './datajson.service';
import { Person } from './../model/person';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  path: string;
  list: Array<Person>;

  constructor(    
    private srvDataJson: DatajsonService
  ) {
    this.list = [];
    this.path = "./assets/data/phonebook.json";
    /*this.srvDataJson.get(this.path, "fileLoadAsync", (data: any) =>{
      this.list = data ;
      console.log(this.list);
    });*/
    this.list = [ 
        { "id": 11, "firstname":  "Dr Nice ", "lastname":  "Dr Nice ",  "age": 12, "sex":"M", "phone": "85668899", "address":"Lincon Street", "icon":"./assets/person/img2-small.jpg" },
        { "id": 12, "firstname":  "Narco ", "lastname":  "Dr Nice ",       "age": 22, "sex":"M", "phone": "35678889", "address":"Lincon Street", "icon":"./assets/person/img4-small.jpg" },
        { "id": 13, "firstname":  "Bombasto ", "lastname":  "Dr Nice ",    "age": 14, "sex":"M", "phone": "52668989", "address":"Lincon Street", "icon":"./assets/person/img2-small.jpg" },
        { "id": 14, "firstname":  "Celeritas ", "lastname":  "Dr Nice ", "age": 47, "sex":"F", "phone": "55667899", "address":"Lincon Street", "icon":"./assets/person/img3-small.jpg" },
        { "id": 15, "firstname":  "Magneta ", "lastname":  "Dr Nice ",    "age": 78, "sex":"F", "phone": "55148899", "address":"Lincon Street", "icon":"./assets/person/img5-small.jpg" },
        { "id": 16, "firstname":  "RubberMan ", "lastname":  "Dr Nice ",  "age": 13, "sex":"M", "phone": "55668899", "address":"Lincon Street", "icon":"./assets/person/img2-small.jpg" },
        { "id": 17, "firstname":  "Dynama ", "lastname":  "Dr Nice ",    "age": 25, "sex":"F", "phone": "57668899", "address":"Lincon Street", "icon":"./assets/person/img3-small.jpg" },
        { "id": 18, "firstname":  "Dr IQ ", "lastname":  "Dr Nice ",      "age": 58, "sex":"M", "phone": "96681899", "address":"Lincon Street", "icon":"./assets/person/img4-small.jpg" },
        { "id": 19, "firstname":  "Magma ", "lastname":  "Dr Nice ",      "age": 47, "sex":"F", "phone": "55668899", "address":"Lincon Street", "icon":"./assets/person/img1-small.jpg" },
        { "id": 20, "firstname":  "Tornado ", "lastname":  "Dr Nice ",    "age": 68, "sex":"M", "phone": "75668899", "address":"Lincon Street", "icon":"./assets/person/img2-small.jpg" }
    ];
  }

  find(obj: number | Person){
    var value = ( obj instanceof Object ) ? obj['id'] : obj;
    for(var i=0; i<this.list.length; i++){
      if(value == this.list[i]['id']){
        return i;
      }
    }
    return  -1;
  }
  
  get(id=-1){
    console.log('-----------------------------------------------');
    console.log(this.list);
    if(id==-1){
      return this.list;
    }
    return this.list[this.find(id)];
  }

  set(obj: Person){
    var index = this.find(obj);
    if(index != -1){
      this.list[index] = obj;
    }else{
      this.list.push(obj);
    }    
    return this.list;
  }

  del(id=-1){
    if(id==-1){
      this.list = [];
    }else{
      this.list.splice( this.find(id), 1 );
    }
    return this.list;
  }




}
