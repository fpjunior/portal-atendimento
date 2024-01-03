import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  public emailPassInvalid = false; // Flag to show an error message if the user enters the wrong email or password
  public isLoading = false; // Flag to show a spinner while the user is logging in

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  } // End of constructor()


  // Method to submit the login form
  submitLoginForm(): void {
    if (this.loginForm.valid) {

      // Show a spinner while the user is logging in
      this.isLoading = true;

      // Get the email and password from the login form
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      // Call the login method from AuthService
      this.authService.login(email, password)
        .then((user: any) => {

          // Log the user object
          console.log('User logged in:', user);

          // Hide the spinner
          this.isLoading = false;

          // Navigate to a different page or show a success message
          this.router.navigate(['/home']); // Replace '/dashboard' with the desired route
        })
        .catch((error: any) => {
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
  } // End
}
