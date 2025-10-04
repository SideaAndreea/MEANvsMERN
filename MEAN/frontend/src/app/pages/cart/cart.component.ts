import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [
    HttpClientModule,
    NgIf,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIcon,
    MatIconModule,
  ],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subTotal = 0;
  billForm: FormGroup;
  billPopupVisible = false;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private http: HttpClient,
    public router: Router
  ) {
    this.billForm = this.fb.group({
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required],
      customerAddress: ['', Validators.required],
      paymentMethod: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.subTotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    });
  }

  increment(item: CartItem) {
    this.cartService.updateQuantity(item._id, item.quantity + 1);
  }

  decrement(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item._id, item.quantity - 1);
    }
  }

  delete(item: CartItem) {
    this.cartService.removeItem(item._id);
  }

  openBillPopup() {
    this.billPopupVisible = true;
  }

  closeBillPopup() {
    this.billPopupVisible = false;
  }

  generateBill() {
    if (this.billForm.invalid) return;

    const user = JSON.parse(localStorage.getItem('auth')!);
    if (!user?.id) {
      alert('Utilizator neautentificat.');
      return;
    }

    const tax = +(this.subTotal * 0.1).toFixed(2);
    const totalAmount = +(this.subTotal + tax).toFixed(2);

    const billData = {
      ...this.billForm.value,
      cartItems: this.cartItems,
      subTotal: this.subTotal,
      tax,
      totalAmount,
      userId: user.id,
    };

    this.http.post('/api/bills/addbills', billData).subscribe({
      next: () => {
        alert('Factură generată cu succes!');
        this.cartService.clearCart();
        this.closeBillPopup();
        this.router.navigate(
          user.role === 'admin' ? ['/bills'] : ['/your-bills']
        );
      },
      error: (err) => {
        alert(err?.error?.message || 'Eroare la generarea facturii');
      },
    });
  }
}
