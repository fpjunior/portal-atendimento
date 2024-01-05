import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, and Validators
import { AuthService } from '../../services/auth/auth.service'; // Import AuthService
import { Router } from '@angular/router';
import { LoginService } from './service/login.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  // Declare a FormGroup variable
  loginForm: FormGroup;

  public emailPassInvalid = false; // Flag to show an error message if the user enters the wrong email or password
  public isLoading = false; // Flag to show a spinner while the user is logging in

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private chatService: LoginService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  } // End of constructor()

  onFormSubmit(form: any): void {
    this.chatService.login(form).subscribe(
      (response: any) => {
        if (response.success) {
          this.router.navigate(['/header']);
        } else {
          // Lógica de tratamento adicional, se necessário
        }
      },
      (error) => {
        // Lógica de tratamento de erro, se necessário
      }
    );
  }

  // Adicione outras funções do componente conforme necessário


  // Method to submit the login form
  submitLoginForm(): void {
    if (this.loginForm.valid) {

      // Show a spinner while the user is logging in
      this.isLoading = true;

      // Get the email and password from the login form
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
       localStorage.setItem('nickname', email.split('@')[0])
      // Call the login method from AuthService
      this.authService.login(email, password)
        .then((user) => {

          // Log the user object
          console.log('User logged in:', user);

          // Hide the spinner
          this.isLoading = false;

          // Navigate to a different page or show a success message
          // this.router.navigate(['/home']); // Replace '/dashboard' with the desired route
          this.router.navigate(['/header']); // Replace '/dashboard' with the desired route

        })
        .catch((error) => {
          // Check if the user entered the wrong password or the user does not exist
          if ((error.code === 'auth/wrong-password')||(error.code === 'auth/user-not-found')) {

            // Reset the password field
            this.loginForm.get('password')?.reset();

            // Show an error message
            this.emailPassInvalid = true;

            // Hide the spinner
            this.isLoading = false;
          }

        });
    }
  } // End of submitLoginForm()

}
