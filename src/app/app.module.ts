import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MaterialModule, MdListModule } from '@angular/material';
import { SideMenuComponent } from '../components/sidemenu/sidemenu.component';
import { MainTabsComponent } from '../components/maintabs/maintabs.component';

@NgModule({
  imports: [
    BrowserModule, MaterialModule.forRoot(), MdListModule.forRoot()
  ],
  declarations: [
    AppComponent,
    SideMenuComponent,
    MainTabsComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { 

}
