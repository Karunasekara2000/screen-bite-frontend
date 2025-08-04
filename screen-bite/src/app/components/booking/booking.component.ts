import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit{

  currentStep = 1;

  upcomingDays: string[] = [];
  selectedDay: string = '';
  selectedShowTime: string = '';
  selectedTimeRaw: string = ''; // Actual value to send to backend (e.g., 19:00:00)
  foodByCategory: {[category: string]: any[]} = {};
  foodCategories: string[] = [];
  menuItems: any[] = []; // fetched from backend
  selectedTotal: number = 0;
  selectedPaymentMethod = 'Credit Card';
  bookedTableIds: string[] = [];

  showTimes = [
    { label: '12:00 PM', value: '12:00:00' },
    { label: '3:30 PM', value: '15:30:00' },
    { label: '7:00 PM', value: '19:00:00' }
  ];

  tableList = [
    { id: 'T1', seats: 5 }, { id: 'T2', seats: 5 },
    { id: 'T3', seats: 4 }, { id: 'T4', seats: 4 }, { id: 'T5', seats: 4 }, { id: 'T6', seats: 4 },
    { id: 'T7', seats: 4 }, { id: 'T8', seats: 4 }, { id: 'T9', seats: 4 }, { id: 'T10', seats: 4 },
    { id: 'T11', seats: 2 }, { id: 'T12', seats: 2 }, { id: 'T13', seats: 2 }, { id: 'T14', seats: 2 }
  ];

  categoryImages: { [key: string]: string[] } = {
    'Starters & Bites': [
      'assets/images/food/tofu_titans.png',
      'assets/images/food/zucchini_fries.png',
      'assets/images/food/jurassic_bites.png'
    ],
    'Popcorn': [
      'assets/images/food/pop.png',
      'assets/images/food/pop1.png',
      'assets/images/food/pop2.png'
    ],
    'Mains & Signature Plates': [
      'assets/images/food/main1.png',
      'assets/images/food/main2.png',
      'assets/images/food/main3.png'
    ],
    'Director’s Cut – Pasta & fusion Bowls': [
      'assets/images/food/dir1.png',
      'assets/images/food/dir2.png'
    ],
    'Combo Meals': [
      'assets/images/food/combo1.png',
      'assets/images/food/combo2.png',
      'assets/images/food/combo3.png'
    ],
    'Desserts': [
      'assets/images/food/des1.png',
      'assets/images/food/des2.png',
      'assets/images/food/des3.png'
    ],
    'Kids Mini Menu': [
      'assets/images/food/kid1.png',
      'assets/images/food/kid2.png',
      'assets/images/food/kid3.png'
    ],
    'Mocktail Menu': [
      'assets/images/food/mock1.png',
      'assets/images/food/mock2.png',
      'assets/images/food/mock3.png'
    ],
    'Cocktail Menu': [
      'assets/images/food/cock1.png',
      'assets/images/food/cock2.png',
      'assets/images/food/cock3.png'
    ],
    // ...add more categories as needed
  };

  movies: any[] = [];
  selectedMovie: any = null;

  selectedTable: string = '';
  //selectedFood: string[] = [];
  selectedFood: any[] = [];

  // menuItems = [
  //   { name: 'Popcorn', image: 'assets/images/popcorn.jpg' },
  //   { name: 'Coke', image: 'assets/images/coke.jpg' },
  //   { name: 'Nachos', image: 'assets/images/nachos.jpg' },
  //   { name: 'Burger', image: 'assets/images/burger.jpg' }
  // ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.generateUpcomingDays();
    this.fetchFood();
    this.calculateTotal();
  }

  generateUpcomingDays() {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const today = new Date();
    this.upcomingDays = [];

    for (let i = 0; i < 7; i++) {
      const future = new Date(today);
      future.setDate(today.getDate() + i);
      this.upcomingDays.push(days[future.getDay()]);
    }
  }

  selectDay(day: string) {
    this.selectedDay = day;
  }

  selectShowTime(time: any) {
    this.selectedShowTime = time.label;
    this.selectedTimeRaw = time.value;
  }

  fetchMoviesForSlot() {
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>(`http://localhost:8080/movie/${this.selectedTimeRaw}/${this.selectedDay}`, { headers }).subscribe(
      (data) => {
        this.movies = data;
        this.currentStep = 2;
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }


  fetchBookedTables() {
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:8080/book', {headers}).subscribe(bookings => {
      this.bookedTableIds = bookings
        .filter(b =>
          b.day === this.selectedDay &&
          b.showTime === this.selectedTimeRaw // '12:00:00', '15:30:00', etc.
        )
        .map(b => b.tableId);
    });
  }

  // Call this whenever date/movie/time changes **and** when entering table selection step:
  onStepToSelectTable() {
    this.fetchBookedTables();
    this.currentStep = 3;
  }

// To check if a table is booked:
  isTableBooked(tableId: string): boolean {
    return this.bookedTableIds.includes(tableId);
  }

// Modify selectTable to prevent selection of booked tables:
  selectTable(tableId: string) {
    if (this.isTableBooked(tableId)) return; // Ignore clicks if booked
    this.selectedTable = tableId;
  }

  selectMovie(movie: any) {
    this.selectedMovie = movie;
  }

  // selectTable(table: string) {
  //   this.selectedTable = table;
  // }

  toggleFood(item: any) {
    const idx = this.selectedFood.findIndex(f => f.id === item.id);
    if (idx !== -1) {
      this.selectedFood.splice(idx, 1);
      this.selectedFood = [...this.selectedFood];
    } else {
      this.selectedFood.push(item);
    }
    this.calculateTotal();
  }

  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  nextStep() {
    if (this.currentStep < 6) this.currentStep++;
    //this.onStepToSelectTable();
  }

  confirmBooking() {
    const email = localStorage.getItem('email');
    if (!email) {
      alert('Email not found. Please log in again.');
      return;
    }
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // Step 1: Get customerId from backend
    this.http.get<any>(`http://localhost:8080/user/${email}`, { headers }).subscribe(
      (userRes) => {
        // Suppose backend returns: { id: 101, ... }
        const customerId = userRes.id;

        // Step 2: Prepare order items
        const orderItem = (this.selectedFood || []).map(f => ({
          customerId: customerId,
          category: f.category,
          name: f.name,
          itemPrice: f.price
        }));

        const todayStr = new Date().toISOString().slice(0, 10);

        // Step 3: Prepare booking object
        const booking = {
          customerId: customerId,
          tableId: this.selectedTable,
          movieId: this.selectedMovie?.id,
          date: todayStr,
          day: this.selectedDay,
          showTime: this.to24Hour(this.selectedShowTime) ,
          prepaid: this.selectedPaymentMethod === 'Credit Card',
          paymentMethod: this.selectedPaymentMethod,
          totalAmount: this.getSelectedFoodTotal(),
          orderItem
        };

        // Step 4: Send booking to backend
        this.http.post('http://localhost:8080/book', booking, { headers }).subscribe(
          (res) => {
            this.currentStep = 6
            //alert('Booking successful!');
            // Optionally route to confirmation page
          },
          (err) => {
            //alert('Booking failed: ' + (err.error?.message || 'Unknown error'));
          }
        );
      },
      (err) => {
        alert('Failed to fetch user details: ' + (err.error?.message || 'Unknown error'));
      }
    );
  }


  resetBooking() {
    this.currentStep = 1;
    this.selectedDay = '';
    this.selectedShowTime = '';
    this.selectedTimeRaw = '';
    this.movies = [];
    this.selectedMovie = null;
    this.selectedTable = '';
    this.selectedFood = [];
  }

  getTablePosition(table: string): any {
    const positions: any = {
      // First row: 2 big tables (5 seats)
      T1: {top: '14%', left: '28%'},
      T2: {top: '14%', right: '29%'},
      // Second row: 4 medium tables (4 seats)
      T3: {top: '34.5%', left: '14%'},
      T4: {top: '34.5%', left: '45%'},
      T5: {top: '34.5%', right: '17%'},
      T6: {top: '43%', left: '28%'},
      // Third row: 4 medium tables (4 seats)
      T7: {top: '43%', right: '32%'},
      T8: {top: '51%', left: '16.5%'},
      T9: {top: '51%', left: '41%'},
      T10: {top: '51%', right: '19.5%'},
      // Last row: 4 small tables (2 seats)
      T11: {top: '67.4%', left: '14%'},
      T12: {top: '67.4%', left: '30%'},
      T13: {top: '67.4%', left: '62%'},
      T14: {top: '67.4%', left: '78%'}
    };
    return positions[table] || {};
  }


  fetchFood() {

    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:8080/food',{headers}).subscribe(
      (data) => {
        this.menuItems = data;
        this.organizeFoodByCategory();
      },
      (err) => {
        console.error('Failed to fetch food:', err);
      }
    );
  }

  organizeFoodByCategory() {
    // Group food by their categories
    this.foodByCategory = {};
    this.foodCategories = [];
    for (let item of this.menuItems) {
      if (!this.foodByCategory[item.category]) {
        this.foodByCategory[item.category] = [];
        this.foodCategories.push(item.category);
      }
      this.foodByCategory[item.category].push(item);
    }
  }

  isFoodSelected(item: any): boolean {
    return this.selectedFood.some(f => f.id === item.id);
  }


  calculateTotal() {
    this.selectedTotal = this.selectedFood
      .map(item => item.price)
      .reduce((sum, price) => sum + price, 0);
  }

  selectedFoodNames(): string {
    if (!this.selectedFood || this.selectedFood.length === 0) {
      return 'None selected';
    }
    return this.selectedFood.map(f => f.name).join(', ');
  }

  getSelectedFoodTotal(): number {
    return this.selectedFood?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;
  }


  to24Hour(time12h: string): string {
    // Example input: "12:00 PM"
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }

  logout() {
    localStorage.clear();  // Or just remove relevant tokens
    // Redirect to login or homepage
    this.router.navigate(['/login']);
  }

}
