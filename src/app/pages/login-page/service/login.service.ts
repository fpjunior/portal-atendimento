import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { URL_DEFAULT } from 'src/app/util/constant-url';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  constructor(private http: HttpClient) {}

  login(form: any): Observable<any> {
    const login = form;
    const usersUrl = `${URL_DEFAULT}/users.json`;

    return this.http.get(usersUrl).pipe(
      switchMap((data: any) => {
        const userExists = Object.values(data).some((user: any) => user.nickname === login.nickname);

        if (userExists) {
          localStorage.setItem('nickname', login.nickname);
          return of({ success: true });
        } else {
          const newUserUrl = `${URL_DEFAULT}/users.json`;
          return this.http.post(newUserUrl, { ...login, userId: null }).pipe(
            catchError((error: any) => {
              alert('Erro ao criar usuário' + error);
              throw error;
            })
          );
        }
      }),
      catchError((error: any) => {
        console.error('Error checking user:', error);
        throw error;
      })
    );
  }
}
