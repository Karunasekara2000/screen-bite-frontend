import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role:'USER'
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    this.authService.register(this.user).subscribe({
      next: (res) => {
        //alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        //alert('Registration failed');
        console.error(err);
      }
    });
  }
}
