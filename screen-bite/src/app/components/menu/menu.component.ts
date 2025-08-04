import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  menu: any[] = [];
  categories: string[] = [];
  groupedMenu: { [category: string]: any[] } = {};

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {

    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:8080/food',{headers}).subscribe(data => {
      this.menu = data;
      // Group by category
      this.groupedMenu = data.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
      }, {});
      this.categories = Object.keys(this.groupedMenu);
    });
  }


  logout() {
    localStorage.clear();  // Or just remove relevant tokens
    // Redirect to login or homepage
    this.router.navigate(['/login']);
  }
}
