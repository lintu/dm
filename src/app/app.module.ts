import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';
import { MaterialModule, MdListModule } from '@angular/material';
import { SideMenuComponent } from '../components/sidemenu/sidemenu.component';
import { MainTabsComponent } from '../components/maintabs/maintabs.component';
import { UploadComponent } from '../components/upload/upload.component';
import { LoginComponent } from '../components/login/login.component';
import { UserData } from '../services/user-data.service';
import { UploadService} from '../services/upload.service';

const myFirebaseConfig = {
  apiKey: "AIzaSyDFPln30pb_nGg5z9dyjqLhxFRQO9CCZRo",
  authDomain: "doubletrap-e1fb4.firebaseapp.com",
  databaseURL: "https://doubletrap-e1fb4.firebaseio.com",
  storageBucket: "doubletrap-e1fb4.appspot.com",
}

const myFirebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
}

@NgModule({
  imports: [
    BrowserModule, MaterialModule.forRoot(), MdListModule.forRoot(),
    AngularFireModule.initializeApp(myFirebaseConfig, myFirebaseAuthConfig)
  ],
  declarations: [
    AppComponent,
    SideMenuComponent,
    MainTabsComponent,
    UploadComponent,
    LoginComponent
  ],
  providers: [UserData, UploadService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
