import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit{

 @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  constructor(private router: Router) {}


  movies = [
    { title: 'Jumanji', image: 'assets/images/movies/jumanji.png' },
    { title: 'Deadpool & Wolverine', image: 'assets/images/movies/deadpool.png' },
    { title: 'Top Gun', image: 'assets/images/movies/topgun.png' },
    { title: 'Avengers', image: 'assets/images/movies/venom.png' },
    { title: 'Inception', image: 'assets/images/movies/do_patti.png' },
    { title: 'Batman', image: 'assets/images/movies/garfield.png' },
    // Add more as needed
  ];

  featuredMenu = [
      {
        name: 'Fried Rice & Spring Rolls with Iced Tea',
        image: 'assets/images/food/fried_rice.png'
      },
      {
        name: 'Spicy Chicken Nachos',
        image: 'assets/images/food/spicy_chicken_nachos.png'
      },
      {
        name: 'Mint Lime Mocktail',
        image: 'assets/images/food/mintmocktail.png'
      },
      {
        name: 'Cashew Nut Ice Cream Delight',
        image: 'assets/images/food/icecream.png'
      },
      {
        name: 'Whiskey Old Fashioned',
        image: 'assets/images/food/oldfashioned.png'
      }
  ];

  ngAfterViewInit(): void {
    this.autoScroll();
  }

  scrollLeft(): void {
    this.carousel.nativeElement.scrollBy({ left: -220, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.carousel.nativeElement.scrollBy({ left: 220, behavior: 'smooth' });
  }

  autoScroll(): void {
    setInterval(() => {
      this.scrollRight();
    }, 3000); // scroll every 3 seconds
  }

  logout() {
    localStorage.clear();  // Or just remove relevant tokens
    // Redirect to login or homepage
    this.router.navigate(['/login']);
  }

}
