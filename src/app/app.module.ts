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
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule}  from '@angular/material/divider';

import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressBarModule } from '@angular/material/progress-bar';
// Import Angular Material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { MatListModule } from '@angular/material/list';
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
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
