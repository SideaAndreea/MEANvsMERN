import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [NgIf],
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data) => (this.product = data),
        error: (err) => console.error('Eroare la încărcare produs:', err),
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
