import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { CommunicationService } from './services/auth/comunication.service';
import { DatePipe } from '@angular/common';
import { Validators } from '@angular/forms';
import { ref, child, get, push, set, getDatabase, update, equalTo, onValue, orderByChild, query } from 'firebase/database';
import { of } from 'rxjs';
import { snapshotToArray } from './util/functions-export';

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
  database = getDatabase();

  constructor(
    public auth: AuthService,
    private router: Router,
    public datepipe: DatePipe,
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


  exitChat() {
    const chat: any = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = 'atendente'
    chat.nickname = 'fpsjunior87';
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${chat.nickname} deixou a conversa`;
    chat.type = 'exit';

    const db = getDatabase();
    const roomUsersRef = ref(db, 'roomusers/');

    // Cria uma consulta para encontrar o usuário pelo nome do quarto e apelido
    const roomUsersQuery = query(roomUsersRef, orderByChild('roomname'), equalTo(chat.roomname));

    // Adiciona um listener para escutar as alterações na consulta
    onValue(roomUsersQuery, (snapshot: any) => {
      const roomusers = snapshot.val();

      // Verifica se encontrou usuários no quarto
      if (roomusers) {
        const users = Object.values(roomusers);

        // Encontra o usuário pelo apelido
        const user: any = users.find((x: any) => x.nickname === chat.nickname);

        // Verifica se encontrou o usuário
        if (user) {
          // Atualiza o status para 'offline'
          const userRef = ref(db, `roomusers/${user.key}`);
          update(userRef, { status: 'offline' });
        }
      }
    });

    return of({ success: true });

  }

  logout(): void {
    this.auth.logout()
      .then(() => {
        this.exitChat()
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
