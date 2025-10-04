import { Component, OnInit } from '@angular/core';
import { PurchasedService } from '../../services/purchased.service';
import { MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { MatSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.css'],
  imports: [
    MatTableModule,
    NgIf,
    MatSpinner,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
})
export class PurchasedComponent implements OnInit {
  purchasedItems: any[] = [];
  displayedColumns: string[] = ['name', 'image', 'price', 'quantity', 'total'];
  loading = false;

  constructor(private purchasedService: PurchasedService) {}

  ngOnInit(): void {
    this.purchasedItems = this.purchasedService.getItems();
  }

  getTotal(item: any): string {
    return `€ ${(item.price * item.quantity).toFixed(2)}`;
  }
}
