import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  codeAdmin: string = '';
  constructor(
    private router: Router,
    private appComponent: AppComponent,
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    if (this.username == 'pda123' && this.password == '123456') {
      if (this.codeAdmin && this.codeAdmin == '000000') {
        this.appComponent.updateLoginStatus(true);
        this.router.navigate(['/header']);
        this.router.navigate(['/home']);
      }
    } else {
      alert('usuário ou senha inválido');
    }
    // Implemente a lógica de login aqui
    console.log('Login clicked');
  }

}
