import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { CommunicationService } from './services/auth/comunication.service';

const config = {
  apiKey: 'AIzaSyAULJTS4sToIBUzTd55xHTCpGJ3L-jCcog',
  databaseURL: 'https://angularchat-68855-default-rtdb.firebaseio.com'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Portal';
  toolbarTitle = 'Portal de Atendimento';
  userLogged = '';

  constructor(
    public auth: AuthService,
    private router: Router,
    private communicationService: CommunicationService
    ) {
      localStorage.setItem('nickname', 'Usuário');
      communicationService.changeNameUser.subscribe((user: any) => {
        this.userLogged = localStorage.getItem('nickname') ?? '';
      });
      // firebase.initializeApp(config);
    }

  public isLoggedIn(): boolean {
    return this.auth.isAuthenticated;
  }

  logout(): void {
    this.auth.logout()
      .then(() => {
        localStorage.setItem('nickname', 'Usuário');
        // handle successful logout, e.g., navigate to the login page
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        // handle error during logout
        console.error('Error during logout:', error);
      });
  }

  toggleMenu() {
    // Implement your menu toggle logic here
  }
}
