import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DatajsonService {

  data: any;
  constructor() {

  }

  /*
  import { readFile } from 'fs';
  import { promisify } from 'util';
  Error ERROR in src/app/tab1/tab1.page.ts(3,26): error TS2307: Cannot find module 'fs'
  fileToJSON(fileName: string): Promise<JSON> {
    return promisify(readFile)(fileName)
                 .then(buffer => JSON.parse(buffer.toString()))
  }
  async fileToJSON2(fileName: string): Promise<JSON> {
    const buffer = await promisify(readFile)(fileName);
    return JSON.parse(buffer.toString());
  }
  */



  get(fileName: string, method:string='', callback:Function=null){
      if(this[method] instanceof Function){
        return this[method](fileName, callback);
      }
  }

  async fileLoad(fileName: string){
    const res = await fetch(fileName);
    const obj = await res.json();
    return obj;
  }

  fileLoadAsync(fileName: string, callback:Function=null){
    fetch(fileName).then(res => res.json())
    .then(json => {
      this.data = json;
      if(callback !== null)
        callback(this.data);
    });
  }


}
