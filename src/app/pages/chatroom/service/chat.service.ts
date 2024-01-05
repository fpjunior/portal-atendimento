import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { URL_DEFAULT } from 'src/app/util/constant-url';
import { snapshotToArray } from 'src/app/util/functions-export';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  constructor(private http: HttpClient) {}

  sendMessage(chat: any) {
    return this.http.post(`${URL_DEFAULT}/chats.json`, chat);
  }

  getOnlineUsers(): Observable<any[]> {
    const roomUsersUrl = `${URL_DEFAULT}/roomusers.json`;

    return this.http.get<any[]>(roomUsersUrl);
  }

  getChats(): Observable<any[]> {
    return this.http.get(`${URL_DEFAULT}/chats.json`)
      .pipe(
        map(
          (data: any) =>
          snapshotToArray(data)
          )
      );
  }
}
