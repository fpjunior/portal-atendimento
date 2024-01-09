// communication.service.ts
import { Injectable, EventEmitter, ElementRef, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  userClicked = new EventEmitter<any>();
  changeNameUser = new EventEmitter<any>();
  scrool = new EventEmitter<any>();

  @ViewChild('chatcontent') chatcontent!: ElementRef;
  scrolltop: number = 0;
  nomeAtendente: string = '';


  emitUserClick(user: any): void {
    this.userClicked.emit(user);
  }

  emitUserName(user: any): void {
    if(localStorage.getItem('nickNameAtendente')){
      this.nomeAtendente = localStorage.getItem('nickNameAtendente') ?? '';
      user = localStorage.getItem('nickNameAtendente')
    } else {
      user = localStorage.getItem('nickNameUser')
    }
    this.changeNameUser.emit(user);
  }

  changeScrol(){
    this.userClicked.emit(
      setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500)
    );
  }
}
