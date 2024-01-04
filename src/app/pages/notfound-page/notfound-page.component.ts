import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notfound-page',
  templateUrl: './notfound-page.component.html',
  styleUrls: ['./notfound-page.component.scss']
})
export class NotfoundPageComponent {
  attemptedUrl: string;

  constructor(private location: Location, private router: Router, private route: ActivatedRoute) {
    // Get the URL from the ActivatedRoute snapshot
    this.attemptedUrl = this.route.snapshot.url.join('/');
  }

  // Go back to the previous page
  goBack(): void {
    this.location.back();
  }
}
