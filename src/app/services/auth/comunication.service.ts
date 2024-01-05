// communication.service.ts
import { Injectable, EventEmitter, ElementRef, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  userClicked = new EventEmitter<any>();
  scrool = new EventEmitter<any>();

  @ViewChild('chatcontent') chatcontent!: ElementRef;
  scrolltop: number = 0;


  emitUserClick(user: any): void {
    this.userClicked.emit(user);
  }

  changeScrol(){
    this.userClicked.emit(
      setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500)
    );
  }
}
