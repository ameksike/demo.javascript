import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class PersondbService {

 // public properties

 path: string;
 dbname: string;
 ext: string;
 db: SQLiteObject = null;

 constructor(
  private sqlite: SQLite
 ) {
    this.path = "./assets/data/";
    this.dbname = "phonebook";
    this.ext = ".db";
    this.connect();
 }

 // public methods
 connect(){
    this.sqlite.create({
      name: this.dbname + this.ext,
      location: this.dbname
    })
    .then((db: SQLiteObject) => {
      this.db = db;
      this.createTable();  
    })
    .catch(e => console.log(e));
 }

 setDatabase(db: SQLiteObject){
   if(this.db === null){
     this.db = db;
   }
 }

 create(obj: any){
   let sql = 'INSERT INTO person(firstname, lastname, age, sex, address, phone, avatar) VALUES(?,?,?,?,?,?,?)';
   return this.db.executeSql(sql, [obj.firstname, obj.lastname, obj.age, obj.sex, obj.address, obj.phone, obj.avatar]);
 }

 createTable(){
   let sql = 'CREATE TABLE IF NOT EXISTS person (id  INTEGER PRIMARY KEY AUTOINCREMENT, firstname VARCHAR, lastname VARCHAR, age INTEGER, sex CHAR, address VARCHAR, phone VARCHAR, avatar VARCHAR );';
   return this.db.executeSql(sql, [])
   .then(() => console.log('Executed SQL'))
   .catch(e => console.log(e));
 }

 delete(obj: any){
   let sql = 'DELETE FROM person WHERE id=?';
   return this.db.executeSql(sql, [obj.id]);
 }

 getAll(){
   let sql = 'SELECT * FROM person';
   return this.db.executeSql(sql, [])
   .then(response => {
     let tasks = [];
     for (let index = 0; index < response.rows.length; index++) {
       tasks.push( response.rows.item(index) );
     }
     return Promise.resolve( tasks );
   })
   .catch(error => Promise.reject(error));
 }

 update(obj: any){
   let sql = 'UPDATE tasks SET firstname=?, lastname=?, age=?, sex=?, address=?, phone=?, avatar=? WHERE id=?';
   return this.db.executeSql(sql, [obj.firstname, obj.lastname, obj.age, obj.sex, obj.address, obj.phone, obj.avatar]);
 }
}
