import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutAppComponent } from './components/layout/layout-app.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutAppComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./pages/product-details/product-details.component').then(
            (m) => m.ProductDetailsComponent
          ),
      },
      {
        path: 'bills',
        loadComponent: () =>
          import('./pages/bills/bills.component').then((m) => m.BillsComponent),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/customers/customers.component').then(
            (m) => m.CustomersComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./pages/cart/cart.component').then((m) => m.CartComponent),
      },
      {
        path: 'your-bills',
        loadComponent: () =>
          import('./pages/bills/your-bills.component').then(
            (m) => m.YourBillsComponent
          ),
      },
      {
        path: 'purchased',
        loadComponent: () =>
          import('./pages/products/purchased.component').then(
            (m) => m.PurchasedComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
