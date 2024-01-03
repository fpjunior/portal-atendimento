import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private appComponent: AppComponent ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  login(): void {
    this.isLoggedIn = true;
    this.appComponent.updateLoginStatus(true);
  }

  // Método para simular o logout
  logout(): void {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
    this.appComponent.updateLoginStatus(false);
  }

  checkLoginStatus(): void {
    this.appComponent.updateLoginStatus(this.router.url !== '/login');
  }


}
