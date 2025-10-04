import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BillsService } from '../../services/bills.service';
import { BillDialogComponent } from '../../components/bill-dialog/bill-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSpinner } from '@angular/material/progress-spinner';

export interface Bills {
  _id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  subTotal: number;
  tax: number;
  paymentMethod: string;
}

@Component({
  standalone: true,
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css'],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    FormsModule,
    MatSpinner,
  ],
})
export class BillsComponent implements OnInit {
  bills: any[] = [];
  loading = false;
  editBill: boolean = false;
  billForm!: FormGroup;
  selectedBillId: string | null = null;

  displayedColumns = [
    '_id',
    'customerName',
    'customerPhone',
    'customerAddress',
    'subTotal',
    'tax',
    'totalAmount',
    'paymentMethod',
    'actions',
  ];

  constructor(
    private billsService: BillsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchBills();
  }

  initializeForm() {
    this.billForm = this.fb.group({
      userId: ['', Validators.required],
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required],
      customerAddress: ['', Validators.required],
      subTotal: [0, Validators.required],
      tax: [0, Validators.required],
      totalAmount: [0, Validators.required],
      paymentMethod: ['', Validators.required],
    });
  }

  fetchBills() {
    this.loading = true;
    this.billsService.getBills().subscribe({
      next: (data) => {
        this.bills = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Eroare la încărcarea facturilor!', 'Închide');
      },
    });
  }

  submitBill() {
    const billData = this.billForm.value;

    if (this.editBill && this.selectedBillId) {
      this.billsService
        .updateBill(this.selectedBillId, billData)
        .subscribe(() => {
          this.snackBar.open('Factura actualizată!', 'OK');
          this.fetchBills();
          this.billForm.reset();
          this.editBill = false;
          this.selectedBillId = null;
        });
    } else {
      this.billsService.addBill(billData).subscribe(() => {
        this.snackBar.open('Factura adăugată!', 'OK');
        this.fetchBills();
        this.billForm.reset();
      });
    }
  }

  editExistingBill(bill: any) {
    this.editBill = true;
    this.selectedBillId = bill._id;
    this.billForm.patchValue(bill);
  }

  openDialog(bills?: Bills) {
    const dialogRef = this.dialog.open(BillDialogComponent, {
      width: '500px',
      data: bills ? { ...bills } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return; // dacă dialogul s-a închis fără rezultat, ieșim

      if (bills) {
        // EDITARE
        this.billsService.updateBill(bills._id, result).subscribe({
          next: () => {
            this.snackBar.open('Factură actualizată cu succes!', 'Închide', {
              duration: 3000,
            });
            this.fetchBills();
          },
          error: () => {
            this.snackBar.open('Eroare la actualizarea facturii', 'Închide', {
              duration: 3000,
            });
          },
        });
      } else {
        // ADAUGARE
        this.billsService.addBill(result).subscribe({
          next: () => {
            this.snackBar.open('Factură adăugată cu succes!', 'Închide', {
              duration: 3000,
            });
            this.fetchBills();
          },
          error: () => {
            this.snackBar.open('Eroare la adăugarea facturii', 'Închide', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  deleteBill(_id: string) {
    if (confirm('Sigur doriți să ștergeți factura?')) {
      this.billsService.deleteBill(_id).subscribe(() => {
        this.snackBar.open('Factura a fost ștearsă!', 'Închide');
        this.fetchBills();
      });
    }
  }
}
