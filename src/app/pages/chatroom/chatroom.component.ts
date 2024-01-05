import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
// import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { equalTo, getDatabase, onValue, orderByChild, push, query, ref, set, update } from "firebase/database";
import { ChatService } from './service/chat.service';
import { Subscription } from 'rxjs';
import { snapshotToArray } from 'src/app/util/functions-export';

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
    public datepipe: DatePipe) {
    this.nickname = localStorage.getItem('nickname') ?? '';
    const database = getDatabase();
    this.roomname = 'atendente-room';
    this.listenToChats();
    this.getOnlineUsers()
  }

  private getOnlineUsers() {
    this.chatService.getOnlineUsers().subscribe(
      (data: any) => {
        this.users = Object.values(data || []).filter((user: any) => user.status === 'online');
      },
      (error: any) => {
        console.error('Error fetching online users:', error);
      }
    );
  }

  private listenToChats() {
    this.chatsSubscription = this.chatService.getChats().subscribe(
      (chats) => {
        this.chats = snapshotToArray(chats);
        this.chats = chats;
        setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
      },
      (error) => {
        console.error('Erro ao obter mensagens:', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.chatsSubscription) {
      this.chatsSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {

    const chat = {
      roomname: this.roomname,
      nickname: this.nickname,
      date: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      type: 'message',
      message: form.message
    };

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
  }

  exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ?? '';
    chat.message = `${this.nickname} leave the room`;
    chat.type = 'exit';
    const database = getDatabase();
    const newMessageRef = push(ref(database, 'chats/'));
    set(newMessageRef, chat);
    const roomUsersRef = ref(database, 'roomusers/');
    const userQuery = query(roomUsersRef, orderByChild('roomname'), equalTo(this.roomname));

    onValue(userQuery, (snapshot) => {
      const roomuser = snapshotToArray(snapshot);
      const user = roomuser.find((x: any) => x.nickname === this.nickname);

      if (user !== undefined) {
        const userRef = ref(database, 'roomusers/' + user.key);
        update(userRef, { status: 'offline' });
      }
    });

    this.router.navigate(['/roomlist']);
  }

}
