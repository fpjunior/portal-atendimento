import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
// import { getFirestore, provideFirestore } from 'firebase/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// Import Angular Material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { MatListModule } from '@angular/material/list';
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { getAuth } from 'firebase/auth';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ChatroomComponent } from './pages/chatroom/chatroom.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AddroomComponent } from './pages/addroom/addroom.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxCaptchaModule } from 'ngx-captcha';

const config = {
  apiKey: "AIzaSyAULJTS4sToIBUzTd55xHTCpGJ3L-jCcog",
  authDomain: "angularchat-68855.firebaseapp.com",
  databaseURL: "https://angularchat-68855-default-rtdb.firebaseio.com",
  projectId: "angularchat-68855",
  storageBucket: "angularchat-68855.appspot.com",
  messagingSenderId: "177451814229",
  appId: "1:177451814229:web:3b04f9d7d45d807f5873dc"
};

const app = initializeApp(config);
// Initialize Firebase

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

@NgModule({
  declarations: [
    AppComponent,
    CustomerSupportComponent,
    LoginPageComponent,
    NotfoundPageComponent,
    RegisterPageComponent,
    HeaderComponent,
    ChatroomComponent,
    AddroomComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatStepperModule,
    MatProgressBarModule,
    MatListModule,
    MatTabsModule,
    MatSidenavModule,
    MatSnackBarModule,
    HttpClientModule,
    MatCheckboxModule,
    NgxCaptchaModule,
    provideFirestore(() => getFirestore()),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
