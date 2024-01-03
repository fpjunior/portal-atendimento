import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword , User, signOut, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth functions and User type
import { BehaviorSubject } from 'rxjs'; // Import BehaviorSubject

import { getFirestore, doc, setDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(); // Initialize Firebase Authentication
  private authState = new BehaviorSubject<boolean>(false);
  public authState$ = this.authState.asObservable();

  private db = getFirestore();

  constructor() {
    // Listen for auth state changes
    onAuthStateChanged(this.auth, (user: any) => {
      if (user) {
        // User is signed in
        this.authState.next(true);
      } else {
        // User is signed out
        this.authState.next(false);
      }
    });
  }

  // Login with email and password
  login(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential: any) => {
        // Signed in
        const user = userCredential.user;
        return user;
      })
      .catch((error: any) => {
        // Handle error
        console.error('Error during login:', error);
        throw error;
      });
  }

  // Logout
  logout(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error: any) => {
        // An error happened.
        console.error('Error during logout:', error);
        throw error;
      });
  }

  // Check if user is logged in
  public get isAuthenticated(): boolean {
    return this.authState.value;
  }

  // Create a new user with email and password
  createUser(email: string, password: string, name: string): Promise<User> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential: any) => {
        // Signed in
        const user = userCredential.user;

        // Add user's data to Firestore
        this.addUserDataToFirestore(user.uid, { name });

        return user;
      })
      .catch((error: any) => {
        // Handle error
        console.error('Error during user creation:', error);
        throw error;
      });
    }


    // Add user data to Firestore
    private async addUserDataToFirestore(uid: string, data: { name: string }): Promise<void> {
      try {
        const userDocRef = doc(this.db, 'users', uid);
        await setDoc(userDocRef, data);
      } catch (error) {
        console.error('Error adding user data to Firestore:', error);
        throw error;
      }
    }
}
