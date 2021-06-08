import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavParams } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';


import { HomePageRoutingModule } from './home-routing.module';
import { StoreModule } from '@ngrx/store';
import { mediaStateReducer } from '../providers/store/store';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      appState: mediaStateReducer
    }),
  ],
  providers: [NavParams],
  declarations: [HomePage]
})
export class HomePageModule {}
