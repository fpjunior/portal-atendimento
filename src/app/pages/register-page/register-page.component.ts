import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, and Validators
import { AuthService } from '../../services/auth/auth.service'; // Import AuthService

import { ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {

@ViewChild('stepper', { static: false }) stepper!: MatStepper;

  public isLoading = false;
  

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _formBuilder: FormBuilder
  ) {} // End of constructor()

  registerForm = this._formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  verifyForm = this._formBuilder.group({
    verifyCode: ['', Validators.required],
  });

  submitRegisterForm(): void {
    if (this.registerForm.valid) {
      const name = this.registerForm.get('name')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;

      // Check if the email, password and name are not null
      if (email && password && name)
      {
        this.isLoading = true;
        this.authService.createUser(email, password, name)
        .then((user) => {
          this.isLoading = false;
          console.log('User created:', user);
          if (this.stepper.selected) {
            this.stepper.selected.completed = true;
          }
          this.stepper.next();
          // Show a success message or navigate to the next step
          
        })
        .catch((error) => {
          this.isLoading = false;
          console.error('Error during user creation:', error);
          if (this.stepper.selected) {
            this.stepper.selected.completed = false;
          }
          // Show an error message
          
        });
      }
      else
      {
        this.isLoading = false;
        console.log('Email and/or password is null');
        if (this.stepper.selected) {
          this.stepper.selected.completed = false;
        }
        // Throw an error or show an error message
        
      }
      
    }
  } // End of submitRegisterForm()

  submitVerifyForm(): void {
    if (this.stepper.selected) {
      this.stepper.selected.completed = true;
    }
    this.stepper.next();
  }

}
