import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, and Validators
import { AuthService } from '../../services/auth/auth.service'; // Import AuthService
import { Router } from '@angular/router';
import { LoginService } from './service/login.service';
import { ChatService } from '../chatroom/service/chat.service';
import { CommunicationService } from 'src/app/services/auth/comunication.service';
import { child, equalTo, get, getDatabase, onValue, orderByChild, push, query, ref, set, update } from 'firebase/database';
import { snapshotToArray } from 'src/app/util/functions-export';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  // Declare a FormGroup variable
  loginForm: FormGroup;
  users: any = [];
  nickNameUser: string = 'User';
  nickNameAtendente: string = 'Atendente';
  isValidCodeAttendant: boolean = false;
  public emailPassInvalid = false; // Flag to show an error message if the user enters the wrong email or password
  public isLoading = false; // Flag to show a spinner while the user is logging in
  msgError: string = '';
  database = getDatabase();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private communicationService: CommunicationService,
    public datepipe: DatePipe,
  ) {
    this.communicationService.emitUserName('Usuário');
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      isAttendant: [false],
      attendantCode: [''],
      attendantName: [''],
    });
  }

  ngOnInit(): void {
    this.getOnlineUsers();
  }

  private getOnlineUsers() {

    const chatRef = ref(this.database, 'roomusers/')
    onValue(chatRef, (snapshot) => {
      const newChats = snapshot.val();
      if (newChats) {
        this.users = snapshotToArray(newChats).filter((user: any) => user.status === 'online');;
      }
    },
    )
  }

  /**
   * Essa função verifica se o usuário é atendente
   */
  private isAtendente() {
    if (this.loginForm.controls['attendantCode'].value === '000000') {
      localStorage.setItem('nickNameAtendente', this.nickNameAtendente)
      this.isValidCodeAttendant = true;
    } else {
      localStorage.setItem('nickNameUser', this.nickNameUser)
      this.loginForm.setErrors({ error: 'Invalid' });
      alert('codigo de atendente inválido')
    }
  }

  updateStatusUser(objForm: any) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = 'atendente-room';
    chat.nickname = this.nickNameUser;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ?? '';
    chat.message = `${this.nickNameUser} enter the room`;
    chat.type = 'join';

    const roomsRefChat = ref(this.database, 'chats/');
    const roomRefChat = child(roomsRefChat, chat.roomname);

    get(roomRefChat).then((snapshot: any) => {
      const newRoomRef = push(roomsRefChat);
      set(newRoomRef, chat);
    });

    const roomUsersRef = ref(this.database, 'roomusers/');
    const usersQuery = query(roomUsersRef, orderByChild('nickname'), equalTo(chat.roomname));

    get(usersQuery).then((snapshot) => {
      const roomUsers = snapshotToArray(snapshot);
      const user = roomUsers.find(x => x.nickname === this.nickNameUser);

      if (user !== undefined) {
        const userRef = ref(this.database, `roomusers/${user.key}`);
        update(userRef, { status: 'online' });
      } else {
        const newRoomUser = push(roomUsersRef);
        const newRoomUserKey = newRoomUser.key;

        const newRoomUserUpdate: any = {};
        newRoomUserUpdate[`${newRoomUserKey}/roomname`] = chat.roomname;
        newRoomUserUpdate[`${newRoomUserKey}/nickname`] = this.nickNameUser;
        newRoomUserUpdate[`${newRoomUserKey}/status`] = 'online';

        const userRef = ref(this.database, `roomusers/${user.key}`);
        update(userRef, newRoomUserUpdate);
      }
    }).catch((error) => {
      console.error(error);
    });

    // this.router.navigate(['/chatroom', roomname]);
  }

  enterChatRoom(roomname: string) {
    const chat = {
      roomname: '',
      nickname: '',
      message: '',
      date: '',
      type: ''
    };

    chat.roomname = roomname;
    chat.nickname = this.nickNameUser;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ?? '';
    chat.message = `${this.nickNameUser} enter the room`;
    chat.type = 'join';

    const db = getDatabase();

    // Add new chat message
    const chatsRef = ref(db, 'chats/');
    const newMessageRef = push(chatsRef);
    update(newMessageRef, chat);

    // Update roomusers
    const roomusersRef = ref(db, 'roomusers/');

    const roomusers = query(roomusersRef, orderByChild('roomname'), equalTo('atendente-room'));

    get(roomusers).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((userSnapshot) => {
          const user = userSnapshot.val();
          if (user.nickname === chat.nickname) {
            const userRef = ref(db, `roomusers/${userSnapshot.key}`);
            update(userRef, { status: 'online' });
          } else {
            const newroomuser = { roomname: '', nickname: '', status: '' };
            newroomuser.roomname = roomname;
            newroomuser.nickname = this.nickNameUser;
            newroomuser.status = 'online';

            const newRoomUserRef = push(roomusersRef);
            update(newRoomUserRef, newroomuser);
          }
        });
      }
    });

  }


  /**
   * Essa função é complemento da função userAuth, ela salva um usuário no banco caso ele não exista
   */
  saveUser(userName: any) {
    const db = getDatabase();
    const usersRef = ref(db, '/users');
    const usersQuery = query(usersRef, orderByChild('nickname'), equalTo(userName));
    // const roomRef = child(roomsRef, chat.roomname);
    get(usersQuery).then((snapshot: any) => {
      if (snapshot.exists()) {
        localStorage.setItem('nickNameUser', userName);
      } else {
        const newUserRef = push(usersRef);
        set(newUserRef, {nickname: userName});
        localStorage.setItem('nickNameUser', userName);
        this.updateStatusUser(this.loginForm)

      }
    });
  }

  /**
   * Essa função realiza a autenticação do usuário a partir do email e senha
   * @param email
   * @param password
   */
  private userAuth(email: string, password: string) {
    if (this.isValidCodeAttendant || this.loginForm.valid) {
      this.authService.login(email, password)
        .then((user) => {
          // Hide the spinner
          this.saveUser(this.nickNameUser)
          this.enterChatRoom('atendente-room')
          this.isLoading = false;
          this.router.navigate(['/header']);

        })
        .catch((error) => {
          localStorage.setItem('nickNameUser', 'Usuário')
          // Check if the user entered the wrong password or the user does not exist
          if (error.code === 'auth/invalid-credential') {
            this.msgError = 'Usuário não cadastrado'
          }
          if ((error.code === 'auth/wrong-password') || (error.code === 'auth/user-not-found')) {

            // Reset the password field
            this.loginForm.get('password')?.reset();

            // Show an error message
            this.emailPassInvalid = true;

          }
          this.isLoading = false;
        });
      }
  }

  /**
   * Essa função trata os dados do form do login
   */
  submitLoginForm(): void {
    if (this.loginForm.valid) {

      // Show a spinner while the user is logging in
      this.isLoading = true;

      // Get the email and password from the login form
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.nickNameUser = email.split('@')[0]
      if (this.loginForm.controls['isAttendant'].value) {
        this.nickNameAtendente = this.loginForm.controls['attendantName'].value
        this.isAtendente();
      } else {
        localStorage.setItem('nickNameUser', this.nickNameUser)
        // Call the login method from AuthService
      }
      // if (this.isValidCodeAttendant) {
      //   localStorage.setItem('nickname', this.loginForm.controls['attendantName'].value)
      // }
      this.userAuth(email, password);
      this.communicationService.emitUserName(email);
    }
  }


  }
