import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bill-dialog',
  templateUrl: './bill-dialog.component.html',
  styleUrls: ['./bill-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDialogModule,
  ],
})
export class BillDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.form = this.fb.group({
      userId: [this.data?.userId || '', Validators.required],
      customerName: [this.data?.customerName || '', Validators.required],
      customerPhone: [this.data?.customerPhone || '', Validators.required],
      customerAddress: [this.data?.customerAddress || '', Validators.required],
      subTotal: [
        this.data?.subTotal || 0,
        [Validators.required, Validators.min(0)],
      ],
      tax: [this.data?.tax || 0, [Validators.required, Validators.min(0)]],
      totalAmount: [
        this.data?.totalAmount || 0,
        [Validators.required, Validators.min(0)],
      ],
      paymentMethod: [this.data?.paymentMethod || '', Validators.required],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
