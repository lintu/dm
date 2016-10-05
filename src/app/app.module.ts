import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MaterialModule, MdListModule } from '@angular/material';
@NgModule({
  imports: [
    BrowserModule, MaterialModule.forRoot(), MdListModule.forRoot()
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
