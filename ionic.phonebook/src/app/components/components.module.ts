/*
 * @author: Antonio Membrides Espinosa
 * @mail: tonykssa@gmail.com
 * @made: 24/12/2019
 * @update: 25/12/2019
 * @description: loader for custom componets 
 * @require: ionic/angular 4.11.7
 */
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListSimplePersonComponent } from './list-simple-person/list-simple-person.component';
import { ListMenuComponent } from './list-menu/list-menu.component';
import { NewsComponent } from './news/news.component';

@NgModule({
    declarations: [
      ListSimplePersonComponent,
      ListMenuComponent,
      NewsComponent
    ],
    exports: [
      ListSimplePersonComponent,
      ListMenuComponent,
      NewsComponent
    ],
    imports: [
      CommonModule,
      IonicModule
    ]
})
export class AppComponentModule {}