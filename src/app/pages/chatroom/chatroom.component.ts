import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
// import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { equalTo, getDatabase, onValue, orderByChild, push, query, ref, set, update } from "firebase/database";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const snapshotToArray = (snapshot: any) => {
  const returnArr: any = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  @ViewChild('chatcontent') chatcontent!: ElementRef;
  scrolltop: number = 0;

  chatForm!: FormGroup;
  nickname: string = '';
  roomname: string = '';
  message: string = '';
  users: any = [];
  chats: any = [];
  matcher = new MyErrorStateMatcher();
  database = getDatabase();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe) {
    this.nickname = localStorage.getItem('nickname') ?? '';
    const database = getDatabase();
    this.roomname = this.route.snapshot.params['roomname'];
    onValue(ref(database, 'chats/'), (snapshot: any) => {
      this.chats = [];
      this.chats = snapshotToArray(snapshot);
      setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
    });
    onValue(ref(database, 'roomusers/'), (snapshot) => {
      const roomUsers = snapshotToArray(snapshot);
      this.users = roomUsers.filter((user: any) => user.status === 'online');
    });
  }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';

    const database = getDatabase();
    const chatsRef = ref(database, 'chats/');

    // Criar uma nova mensagem
    const newMessageRef = push(chatsRef);

    // O ID exclusivo gerado para a nova mensagem
    const newMessageId = newMessageRef.key;

    // Defina os detalhes da mensagem no novo nó
    set(newMessageRef, chat);

    // Reinicialize o formulário
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });
  }

  exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ?? '';
    chat.message = `${this.nickname} leave the room`;
    chat.type = 'exit';

    const database = getDatabase();

    // Criar uma nova mensagem
    const newMessageRef = push(ref(database, 'chats/'));

    // Defina os detalhes da mensagem no novo nó
    set(newMessageRef, chat);

    // Atualizar status para 'offline' no nó roomusers
    const roomUsersRef = ref(database, 'roomusers/');
    const userQuery = query(roomUsersRef, orderByChild('roomname'), equalTo(this.roomname));

    // Obter dados dos usuários da sala
    onValue(userQuery, (snapshot) => {
      const roomuser = snapshotToArray(snapshot);
      const user = roomuser.find((x: any) => x.nickname === this.nickname);

      if (user !== undefined) {
        const userRef = ref(database, 'roomusers/' + user.key);
        update(userRef, { status: 'offline' });
      }
    });

    // Redirecionar para '/roomlist'
    this.router.navigate(['/roomlist']);
  }

}
