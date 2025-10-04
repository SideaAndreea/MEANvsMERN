import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  description: string;
  stock: number;
}

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [ProductCardComponent, NgFor, HttpClientModule],
})
export class HomeComponent implements OnInit {
  productData: Product[] = [];
  selectedCategory: string = 'Canon';

  categories = [
    {
      name: 'Canon',
      imageUrl:
        'https://i.pinimg.com/originals/fc/bc/3c/fcbc3cb041bcbfdbef21aeb370517801.png',
    },
    {
      name: 'Nikon',
      imageUrl:
        'https://w7.pngwing.com/pngs/1013/525/png-transparent-nikon-d40-logo-camera-text-photography-logo.png',
    },
    {
      name: 'Sony',
      imageUrl:
        'https://e7.pngegg.com/pngimages/262/162/png-clipart-sony-sony.png',
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<Product[]>('http://localhost:5000/api/products/getproducts')
      .subscribe({
        next: (data) => {
          console.log(data);
          this.productData = data;
        },
      });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  get filteredProducts(): Product[] {
    return this.productData.filter((p) => p.category === this.selectedCategory);
  }
}
