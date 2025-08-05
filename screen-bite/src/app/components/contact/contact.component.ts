import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  constructor(private router: Router) {}
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  submitted = false;

  submitForm() {
    this.submitted = true;
    // TODO: Integrate with backend or email service here if needed
    setTimeout(() => {
      this.submitted = false;
      this.formData = { name: '', email: '', subject: '', message: '' };
    }, 3000);
  }


  logout() {
    localStorage.clear();  // Or just remove relevant tokens
    // Redirect to login or homepage
    this.router.navigate(['/login']);
  }

}
