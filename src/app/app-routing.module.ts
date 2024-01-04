import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Import the AuthGuard
import { AuthGuard } from './guards/auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HeaderComponent } from './header/header.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard],},
  { path: 'login', component: LoginPageComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'header/chat-with-support-bot', component: CustomerSupportComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotfoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
