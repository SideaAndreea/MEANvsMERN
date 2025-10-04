import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export interface Product {
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
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  imports: [MatIconModule, MatCardModule, NgIf, MatIcon],
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private router: Router, private cartService: CartService) {}

  handleLearnMore() {
    this.router.navigate(['/product', this.product._id]);
  }

  handleAddToCart() {
    if (this.product.stock <= 0) {
      alert('Stoc epuizat!');
      return;
    }

    this.cartService.addToCart({
      ...this.product,
      quantity: 1,
    });
    console.log('Add to cart clicked!');
  }
}
