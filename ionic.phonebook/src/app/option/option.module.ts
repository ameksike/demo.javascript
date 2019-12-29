import { AppComponentModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionPageRoutingModule } from './option-routing.module';

import { OptionPage } from './option.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionPageRoutingModule,
    AppComponentModule
  ],
  declarations: [OptionPage]
})
export class OptionPageModule {}
