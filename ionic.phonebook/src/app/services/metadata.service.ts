/*
 * @author: Antonio Membrides Espinosa
 * @mail: tonykssa@gmail.com
 * @made: 24/12/2019
 * @update: 25/12/2019
 * @description: Local data manager services
 * @require: ionic/angular 4.11.7
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  constructor() { 
    localStorage.setItem('msg', "[]");
  }

  get length() {
    return localStorage.length;
  }

  clear() {
    localStorage.clear();
    localStorage.setItem('msg', "[]");
  }

  getItem(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }


  //... message manage .......................................
  addMsg(msg: string){
    var tmp = JSON.parse(localStorage.getItem('msg'));
    tmp.push({ "msg":msg, "date": Date.now });
    localStorage.setItem('msg', JSON.stringify(tmp));
  }

  getMsg(){
    return JSON.parse(localStorage.getItem('msg'));
  }

  clearMsg(){
    localStorage.setItem('msg', "[]");
  }
}
