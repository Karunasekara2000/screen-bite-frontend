import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        localStorage.setItem('access_token', res.access_token);
        // alert('Login successful!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert('Login failed');
        console.error(err);
      }
    });
  }

}
