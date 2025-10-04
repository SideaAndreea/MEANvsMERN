import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  get cartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(item: CartItem) {
    const items = [...this.cartItems]; // clone array
    const existingIndex = items.findIndex((p) => p._id === item._id);
    if (existingIndex > -1) {
      const existing = items[existingIndex];
      items[existingIndex] = { ...existing, quantity: existing.quantity + 1 };
    } else {
      items.push({ ...item, quantity: 1 });
    }
    this.cartItemsSubject.next(items);
  }

  updateQuantity(id: string, quantity: number) {
    const updated = this.cartItems.map((item) =>
      item._id === id ? { ...item, quantity } : item
    );
    this.cartItemsSubject.next(updated);
  }

  removeItem(id: string) {
    const filtered = this.cartItems.filter((item) => item._id !== id);
    this.cartItemsSubject.next(filtered);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }
}
