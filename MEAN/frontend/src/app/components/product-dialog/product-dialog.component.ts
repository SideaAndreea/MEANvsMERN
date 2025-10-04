import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  standalone: true,
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class ProductDialogComponent {
  form: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      price: [data?.price || '', Validators.required],
      image: [data?.image || '', Validators.required],
      stock: [data?.stock || '', Validators.required],
      description: [data?.description || '', Validators.required],
      category: [data?.category || '', Validators.required],
      isFeatured: [data?.isFeatured || false],
    });
  }

  submit() {
    if (this.form.invalid) return;

    const productData = { ...this.form.value };
    if (!this.isEditMode) {
      delete productData._id;
    }

    const request = this.isEditMode
      ? this.productService.updateProduct(this.data._id, productData)
      : this.productService.addProduct(productData);

    request.subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: (err) => console.error('Eroare la salvare produs:', err),
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
