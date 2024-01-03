import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routedComponents, AppRoutingModule } from './app-routing.module';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { LoginComponent } from './login/login.component';
// import { getFirestore, provideFirestore } from 'firebase/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

const app = initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    routedComponents,
    CustomerSupportComponent,
    LoginComponent,
    // LoginComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
