import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, and Validators
import { AuthService } from '../../services/auth/auth.service'; // Import AuthService
import { Router } from '@angular/router';
import { LoginService } from './service/login.service';
import { ChatService } from '../chatroom/service/chat.service';
import { CommunicationService } from 'src/app/services/auth/comunication.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent  implements OnInit {
  // Declare a FormGroup variable
  loginForm: FormGroup;
  users: any = [];
  userNameModified: string = 'User';
  isValidCodeAttendant: boolean = false;
  public emailPassInvalid = false; // Flag to show an error message if the user enters the wrong email or password
  public isLoading = false; // Flag to show a spinner while the user is logging in
  msgError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private communicationService: CommunicationService
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
    this.chatService.getOnlineUsers().subscribe(
      (data: any) => {
        this.users = Object.values(data || []).filter((user: any) => user.status === 'online');
      },
      (error: any) => {
        console.error('Error fetching online users:', error);
      }
    );
  }

  // onFormSubmit(form: any): void {
  //   this.chatService.login(form).subscribe(
  //     (response: any) => {
  //       if (response.success) {
  //         this.router.navigate(['/header']);
  //       } else {
  //         // Lógica de tratamento adicional, se necessário
  //       }
  //     },
  //     (error) => {
  //       // Lógica de tratamento de erro, se necessário
  //     }
  //   );
  // }

  // Adicione outras funções do componente conforme necessário

  private isAtendente() {
    if (this.loginForm.controls['attendantCode'].value === '000000') {
      localStorage.setItem('nickname', this.loginForm.controls['attendantName'].value)
      this.isValidCodeAttendant = true;
    } else {
      localStorage.setItem('nickname', this.userNameModified)
      this.loginForm.setErrors({ error: 'Invalid'});
      alert('codigo de atendente inválido')
    }
  }

  /**
   * Method to authent a user with the specified username and password
   * @param email
   * @param password
   */
  private userAuth(email: string, password: string) {
    if(this.isValidCodeAttendant || this.loginForm.valid){
      this.authService.login(email, password)
        .then((user) => {
          // Hide the spinner

          if(!this.isValidCodeAttendant){
            localStorage.setItem('nickname', this.loginForm.controls['attendantName'].value)
          }
          this.isLoading = false;
          this.router.navigate(['/header']);

        })
        .catch((error) => {
          localStorage.setItem('nickname', 'Usuário')
          // Check if the user entered the wrong password or the user does not exist
          if (error.code === 'auth/invalid-credential') {
            this.msgError = 'Credencial Invalida'
          }
          if ((error.code === 'auth/wrong-password') || (error.code === 'auth/user-not-found')) {

            // Reset the password field
            this.loginForm.get('password')?.reset();

            // Show an error message
            this.emailPassInvalid = true;

            // Hide the spinner
          }

        });

    }
  }

  /**
   * Method to submit the login form
   */
  submitLoginForm(): void {
    if (this.loginForm.valid) {

      // Show a spinner while the user is logging in
      this.isLoading = true;

      // Get the email and password from the login form
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.userNameModified = email.split('@')[0]
      if (this.loginForm.controls['isAttendant'].value) {
        this.isAtendente();
      } else {
        localStorage.setItem('nickname', this.userNameModified)
        // Call the login method from AuthService

      }
      if(this.isValidCodeAttendant){
        localStorage.setItem('nickname', this.loginForm.controls['attendantName'].value)
      }
      this.userAuth(email, password);
      this.communicationService.emitUserName(email);
    } // End of submitLoginForm()
  }


}
