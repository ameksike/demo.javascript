/*
 * @author: Antonio Membrides Espinosa
 * @mail: tonykssa@gmail.com
 * @made: 22/12/2019
 * @update: 23/12/2019
 * @description: This is a simple game controller
 * @require: ionic/angular 4.11.7
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  num:number;
  val:number;
  com = '...';
  numSecret: number = 0;
  count: number = 0; 
  best: number = 100;

  constructor() {
    this.reboot();
  }

  randomNumber(a,b){
      return Math.round(Math.random() * (b - a) + parseInt(a, 10));
  }

  reboot(){
    this.num = null;
    this.val = 0;
    this.com = 'distinto de';
    this.numSecret = this.randomNumber(0,100);
    this.count = 0;
  }

  checkNumber(){
    console.log('------------------------------');
    console.log(this.numSecret);
    console.log('------------------------------');
    this.count++;
    this.val = this.num;
    if(this.num){      
      if(this.numSecret < this.num){
        this.com = 'menor que';
      }
      else if(this.numSecret > this.num){
        this.com = 'mayor que';
      }
      else{
        this.com = '';
        this.best = this.best>this.count ? this.count : this.best;
      }
    }
  }
}
