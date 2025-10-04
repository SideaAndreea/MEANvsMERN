import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { ProductDialogComponent } from '../../components/product-dialog/product-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSpinner } from '@angular/material/progress-spinner';
import { NgIf, SlicePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [
    MatSpinner,
    NgIf,
    MatIcon,
    SlicePipe,
    MatTooltip,
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  loading = false;
  displayedColumns = [
    'name',
    'image',
    'category',
    'price',
    'stock',
    'description',
    'isFeatured',
    'actions',
  ];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Eroare la încărcarea produselor!', 'Închide');
      },
    });
  }

  openDialog(product: any = null): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '400px',
      data: product,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Rezultat dialog:', result);
        if (product) {
          // EDITARE
          this.productService.updateProduct(product._id, result).subscribe({
            next: () => {
              this.snackBar.open('Produs actualizat cu succes!', 'Închide', {
                duration: 3000,
              });
              this.fetchProducts();
            },
            error: () => {
              this.snackBar.open('Eroare la actualizare produs', 'Închide', {
                duration: 3000,
              });
            },
          });
        } else {
          // ADAUGARE
          this.productService.addProduct(result).subscribe({
            next: (response) => {
              console.log('Răspuns adăugare produs:', response);
              this.snackBar.open('Produs adăugat cu succes!', 'Închide', {
                duration: 3000,
              });
              this.fetchProducts();
            },
            error: (err) => {
              this.snackBar.open('Refresh la pagină', 'Închide', {
                duration: 3000,
              });
            },
          });
        }
      }
    });
  }

  deleteProduct(productId: string) {
    if (confirm('Sigur doriți să ștergeți produsul?')) {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.snackBar.open('Produs șters cu succes!', 'Închide');
        this.fetchProducts();
      });
    }
  }
}
