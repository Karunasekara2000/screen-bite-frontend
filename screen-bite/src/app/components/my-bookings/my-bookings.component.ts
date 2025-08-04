import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent {

  bookings: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    if (!email) {
      this.errorMsg = 'Not logged in.';
      this.loading = false;
      return;
    }

    // 1. Get user ID from email
    this.http.get<any>(`http://localhost:8080/user/${email}`, { headers }).subscribe({
      next: (user) => {
        const userId = user.id;
        // 2. Get bookings for this user
        this.http.get<any[]>(`http://localhost:8080/book/${userId}`, { headers }).subscribe({
          next: (data) => {
            this.bookings = data;
            this.loading = false;
          },
          error: (err) => {
            this.errorMsg = 'Failed to load bookings.';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.errorMsg = 'Failed to find user ID.';
        this.loading = false;
      }
    });
  }

  logout() {
    localStorage.clear();  // Or just remove relevant tokens
    // Redirect to login or homepage
    this.router.navigate(['/login']);
  }
}
