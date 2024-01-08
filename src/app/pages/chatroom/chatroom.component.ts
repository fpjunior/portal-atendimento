import { Component, OnInit, ElementRef, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
// import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { child, equalTo, get, getDatabase, onValue, orderByChild, push, query, ref, set, update } from "firebase/database";
import { ChatService } from './service/chat.service';
import { Subscription, of } from 'rxjs';
import { snapshotToArray } from 'src/app/util/functions-export';
import { CommunicationService } from 'src/app/services/auth/comunication.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit, OnDestroy {

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

  private chatsSubscription: Subscription | undefined;

  constructor(private router: Router,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private communicationService: CommunicationService,
    private zone: NgZone,
    public datepipe: DatePipe) {
    this.nickname = localStorage.getItem('nickname') ?? '';
    const database = getDatabase();
    this.roomname = 'atendente-room';
    // Adiciona um ouvinte para alterações no nó 'chats/'
    const chatRef = ref(database, 'chats/');

    onValue(chatRef, (snapshot) => {
      const newChats = snapshot.val();
      if (newChats) {
        this.chats = snapshotToArray(newChats);
        setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
      }
    }, (error) => {
      console.error(error);
    });

    // firebase.database().ref('chats/').on('value', resp => {
    //   this.chats = [];
    //   this.chats = snapshotToArray(resp);
    //   setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
    // });
  }

  ngOnInit(): void {
    this.getOnlineUsers()
    // this.listenToChats();
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });
  }


  private getOnlineUsers() {
    const chatRef = ref(this.database, 'roomusers/')
    onValue(chatRef, (snapshot) => {
      const newChats = snapshot.val();
      if (newChats) {
        this.users = snapshotToArray(newChats).filter((user: any) => user.status === 'online');
      }
    },
    )
  }

  handleUserClick(user: any): void {
     this.scrolltop = this.chatcontent.nativeElement.scrollHeight
  }

  // private listenToChats() {
  //   const chatRef = ref(this.database, 'chats/')
  //       // Adiciona um ouvinte para alterações no nó 'chats/'
  //       onValue(chatRef, (snapshot) => {
  //         const newChats = snapshot.val();
  //         if (newChats) {
  //           // Atualize sua variável this.chats com os novos dados
  //           this.chats = snapshotToArray(snapshot);
  //           // Execute a lógica adicional, como a atualização da interface do usuário
  //           setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
  //         }
  //       },
  //       )
  // }

  ngOnDestroy() {
    if (this.chatsSubscription) {
      this.chatsSubscription.unsubscribe();
    }
  }



  onFormSubmit(form: any) {
    const chat = {
      roomname: this.roomname,
      nickname: localStorage.getItem('nickname'),
      date: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      type: 'message',
      message: form.message
    };
    const roomsRef = ref(this.database, 'chats/');
    const roomRef = child(roomsRef, chat.roomname);
    get(roomRef).then((snapshot: any) => {
      const newRoomRef = push(roomsRef);
      set(newRoomRef, chat);
      // this.router.navigate(['/roomlist']);
    });

    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });

    return of({ success: true });

  }

  exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ?? '';
    chat.message = `${this.nickname} deixou a sala`;
    chat.type = 'exit';

    this.chatService.sendMessage(chat).subscribe(
      (response) => {
        console.log('Mensagem enviada com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao enviar mensagem:', error);
      }
    );

    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });

    // const newMessageRef = push(ref(database, 'chats/'));
    const database = getDatabase();
    // set(newMessageRef, chat);
    const roomUsersRef = ref(database, 'roomusers/');
    const userQuery = query(roomUsersRef, orderByChild('roomname'), equalTo(this.roomname));

    this.chatService.getUsers().subscribe((roomUsers) => {

      const userArray = snapshotToArray(roomUsers);
      const user = userArray.find((x: any) => x.nickname === this.nickname);

      if (user !== undefined) {
        // Chame o método updateUserStatus() para atualizar o status do usuário para offline
        this.chatService.updateUserStatus(user.key).subscribe(() => {
          console.log('Status do usuário atualizado para offline.');
          this.router.navigate(['/login']);
        });
      }
    });

  }

}
