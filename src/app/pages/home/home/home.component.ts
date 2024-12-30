import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  products = [
    { name: 'Producto 1', image: 'car1.jpg' },
    { name: 'Producto 2', image: 'car2.jpg' },
    { name: 'Producto 3', image: 'car3.jpg' },
    { name: 'Producto 4', image: 'car4.jpg' }
  ];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}
