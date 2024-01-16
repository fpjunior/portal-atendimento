import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { DatePipe } from '@angular/common';
import { getDatabase, ref, push, set, query, orderByChild, equalTo, onValue, update } from 'firebase/database';
import { snapshotToArray } from '../util/functions-export';
import { ChatService } from '../pages/chatroom/service/chat.service';
import { CommunicationService } from '../services/auth/comunication.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  database = getDatabase();
  nickname = '';
  displayedColumns: string[] = ['roomname'];
  rooms = [];
  isLoadingResults = true;
  users: any = [];
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  constructor(
    private router: Router,
    private chatService: ChatService,
    public datepipe: DatePipe,
    private communicationService: CommunicationService) {
    // communicationService.userClicked.subscribe((user: any) => {
    //   this.ativarChatRoomTab()
    // });
  }



  ngOnInit(): void {
    // this.checkLoginStatus();
    // this.enterChatRoom('atendente-room');

    this.getOnlineUsers();
  }

  ativarChatRoomTab(): void {
    this.tabGroup.selectedIndex = 1; // Índice 1 corresponde ao segundo tab (índices começam em 0)
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

    // this.chatService.getOnlineUsers().subscribe(
    //   (data: any) => {
    //     this.users = Object.values(data || []).filter((user: any) => user.status === 'online');
    //   },
    //   (error: any) => {
    //     console.error('Error fetching online users:', error);
    //   }
    // );
  }

  // private getOnlineUsers() {
  //   this.chatService.getOnlineUsers().subscribe(
  //     (data: any) => {
  //       this.users = Object.values(data || []).filter((user: any) => user.status === 'online');
  //     },
  //     (error: any) => {
  //       console.error('Error fetching online users:', error);
  //     }
  //   );
  // }

  login(): void {
    this.isLoggedIn = true;
    // this.appComponent.updateLoginStatus(true);
  }

  // Método para simular o logout
  logout(): void {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
    // this.appComponent.updateLoginStatus(false);
  }

  // checkLoginStatus(): void {
  //   // this.appComponent.updateLoginStatus(this.router.url !== '/login');
  // }

  // teste(){
  //     alert('chegou')
  // }
  // enterChatRoom(roomname: string) {
  //   const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
  //   chat.roomname = roomname;
  //   chat.nickname = this.nickname;
  //   chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss', 'pt') ?? '';
  //   chat.message = `${this.nickname} enter the room`;
  //   chat.type = 'join';

  //   const db = getDatabase();
  //   const newMessageRef = push(ref(db, 'chats/'));
  //   set(newMessageRef, chat);

  //   const roomUsersQuery = query(ref(db, 'roomusers/'), orderByChild('roomname'), equalTo(roomname));
  //   onValue(roomUsersQuery, (snapshot) => {
  //     const roomuser = snapshotToArray(snapshot);
  //     const user = roomuser.find((x: any) => x.nickname === this.nickname);
  //     if (user !== undefined) {
  //       const userRef = ref(db, 'roomusers/' + user.key);
  //       set(userRef, { status: 'online' });
  //     } else {
  //       const newroomuser = { roomname: '', nickname: '', status: '' };
  //       newroomuser.roomname = roomname;
  //       newroomuser.nickname = this.nickname;
  //       newroomuser.status = 'online';
  //       const newRoomUserRef = push(ref(db, 'roomusers/'));
  //       set(newRoomUserRef, newroomuser);
  //     }
  //   });

  //   this.router.navigate(['header/chatroom', roomname]);
  // }


}
