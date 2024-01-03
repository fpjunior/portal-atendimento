import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { DemoComponent } from './demo/demo.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
{ path: '', pathMatch: 'full', redirectTo: 'home' },
{ path: 'login', component: LoginComponent },
{ path: 'home', component: HomeComponent },
{ path: 'demo', component: DemoComponent  },
{ path: 'demo/chat-with-support-bot', component: CustomerSupportComponent  }]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [
  HeaderComponent,
  HomeComponent  ,
  DemoComponent,
  HeaderComponent,
  LoginComponent
]
