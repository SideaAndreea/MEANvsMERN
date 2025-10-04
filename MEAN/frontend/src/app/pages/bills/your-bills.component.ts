import { Component, OnInit } from '@angular/core';
import { BillsService } from '../../services/bills.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BillDetailsDialogComponent } from '../../components/bill-dialog/bill-details-dialog.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { PurchasedService } from '../../services/purchased.service';

@Component({
  selector: 'app-your-bills',
  templateUrl: './your-bills.component.html',
  styleUrls: ['./your-bills.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatIcon,
    MatSpinner,
    MatTableModule,
  ],
})
export class YourBillsComponent implements OnInit {
  billsData: any[] = [];
  loading = false;
  purchasedItems: any[] = [];

  displayedColumns: string[] = [
    '_id',
    'customerName',
    'customerPhone',
    'customerAddress',
    'subTotal',
    'tax',
    'totalAmount',
    'actions',
  ];

  constructor(
    private billsService: BillsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private purchasedService: PurchasedService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.getUserBills();
    } else {
    }
  }
  getUserBills(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const authStr = localStorage.getItem('auth');
      if (!authStr) {
        console.warn('Nu există date de autentificare în localStorage');
        return;
      }

      let authData;
      try {
        authData = JSON.parse(authStr);
      } catch (e) {
        console.error('Datele din localStorage nu pot fi parsate', e);
        return;
      }

      const token = authData.token;
      const userId = authData.id;

      if (!token || !userId) {
        console.warn('Token-ul sau userId nu au fost găsite.');
        return;
      }

      const decodedToken: any = jwtDecode(token);
      const decodedUserId = decodedToken.id;

      if (userId !== decodedUserId) {
        console.warn(
          'UserId-ul din localStorage nu se potrivește cu cel din token.'
        );
        return;
      }

      this.loading = true;

      this.billsService.getBillsByUserId(decodedUserId).subscribe({
        next: (data) => {
          this.billsData = data;
          const allItems = data.flatMap((bill: any) => bill.cartItems || []);
          this.purchasedItems = allItems;
          this.purchasedService.setItems(allItems);
          this.loading = false;
        },
        error: (err) => {
          this.snackBar.open('Eroare la obținerea facturilor!', 'Închide', {
            duration: 3000,
          });
          console.error(err);
          this.loading = false;
        },
      });
    } else {
      console.warn('localStorage nu este disponibil.');
    }
  }

  showBillDetails(bill: any): void {
    this.dialog.open(BillDetailsDialogComponent, {
      width: '400px',
      data: bill,
    });
  }

  deleteBill(bill: any): void {
    this.billsService.deleteBill(bill._id).subscribe({
      next: () => {
        this.snackBar.open('Factura a fost ștearsă cu succes!', 'OK', {
          duration: 3000,
        });

        this.purchasedItems = this.purchasedItems.filter(
          (item) =>
            !bill.cartItems.some((cartItem: any) => cartItem._id === item._id)
        );

        this.getUserBills();
      },
      error: (err) => {
        this.snackBar.open('Eroare la ștergerea facturii!', 'Închide', {
          duration: 3000,
        });
        console.error(err);
      },
    });
  }
}
