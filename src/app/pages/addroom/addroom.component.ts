import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataSnapshot, child, equalTo, get, getDatabase, orderByChild, push, query, ref, set } from 'firebase/database';
import { ChatService } from '../chatroom/service/chat.service';
import { CommunicationService } from 'src/app/services/auth/comunication.service';
// import * as firebase from 'firebase';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-addroom',
  templateUrl: './addroom.component.html',
  styleUrls: ['./addroom.component.css']
})
export class AddroomComponent implements OnInit {

  roomForm!: FormGroup;
  nickname = '';
  roomname = '';
  database = getDatabase();
  ref = ref(this.database, 'rooms/');
  matcher = new MyErrorStateMatcher();
  users: any = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private chatService: ChatService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private communicationService: CommunicationService) {
              }

  ngOnInit(): void {
    this.getOnlineUsers();
    this.roomForm = this.formBuilder.group({
      'roomname' : [null, Validators.required]
    });
  }

  handleUserClick(user: any): void {
    this.communicationService.emitUserClick(user);
    this.communicationService.changeScrol();
  }

  getStatusClass(status: string): string {
    return status === 'online' ? 'online' : 'offline';
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

  onFormSubmit(form: any) {
    const room = form;
    const roomsRef = ref(this.database, 'rooms/');
    const roomRef = child(roomsRef, room.roomname);

    get(roomRef).then((snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        this.snackBar.open('Room name already exists!');
      } else {
        const newRoomRef = push(roomsRef);
        set(newRoomRef, room);
        this.router.navigate(['/roomlist']);
      }
    });
  }

}
