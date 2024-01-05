import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataSnapshot, child, equalTo, get, getDatabase, orderByChild, push, query, ref, set } from 'firebase/database';
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

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) {
              }

  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      'roomname' : [null, Validators.required]
    });
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
