import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout-app',
  templateUrl: './layout-app.component.html',
  styleUrls: ['./layout-app.component.css'],
  standalone: true,
  imports: [RouterModule, MatIcon, MatToolbarModule, HttpClientModule, NgIf],
})
export class LayoutAppComponent implements OnInit {
  cartItemsCount = 0;
  username = 'Utilizator';
  role = 'user';

  private cartSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const user = JSON.parse(auth);
        this.role = user.role;
        this.username = user.name;
      }

      this.cartSubscription = this.cartService.cartItems$.subscribe(
        (items: CartItem[]) => {
          this.cartItemsCount = items.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
        }
      );
    }
  }
  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth');
    }
    this.router.navigate(['/login']);
    this.cartService.clearCart();
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
