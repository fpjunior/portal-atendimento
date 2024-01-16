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
      localStorage.setItem('nickNameUser', 'Usuário');
      communicationService.changeNameUser.subscribe((user: any) => {
        this.userLogged = localStorage.getItem('nickNameUser') ?? '';
      });
      // firebase.initializeApp(config);
    }

  public isLoggedIn(): boolean {
    return this.auth.isAuthenticated;
  }


  exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = 'atendente-room';
    chat.nickname = this.userLogged;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ?? '';
    chat.message = `${this.userLogged} leave the room`;
    chat.type = 'exit';

    const db = getDatabase();
    const chatsRef = ref(db, 'chats/');
    const newMessageRef = push(chatsRef);
    update(newMessageRef, chat);

    const roomusersRef = ref(db, 'roomusers/');
    const roomusersQuery = query(roomusersRef, orderByChild('roomname'), equalTo('atendente-room'));

    get(roomusersQuery).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((userSnapshot) => {
          const user = userSnapshot.val();
          if (user.nickname === chat.nickname) {
            const userRef = ref(db, `roomusers/${userSnapshot.key}`);
            update(userRef, { status: 'offline' });
          }
        });
      }
    });
  }


  logout(): void {
    this.exitChat()
    this.auth.logout()
      .then(() => {
        localStorage.setItem('nickNameUser', 'Usuário');
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
