import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerDialogComponent } from '../../components/customer-dialog/customer-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Customer {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

@Component({
  standalone: true,
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  imports: [
    HttpClientModule,
    MatIcon,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    MatSpinner,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatIcon,
  ],
})
export class CustomersComponent implements OnInit {
  customersData = new MatTableDataSource<Customer>([]);
  displayedColumns: string[] = [
    '_id',
    'customerName',
    'customerPhone',
    'customerAddress',
    'actions',
  ];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  loading = false;

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.loading = true;
    this.http.get<Customer[]>('/api/customers/getcustomers').subscribe({
      next: (data) => {
        this.customersData.data = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Eroare la încărcarea clienților', 'Închide', {
          duration: 3000,
        });
      },
    });
  }

  deleteCustomer(id: string) {
    this.http.delete(`/api/customers/deletecustomer/${id}`).subscribe({
      next: () => {
        this.snackBar.open('Client șters cu succes!', 'Închide', {
          duration: 3000,
        });
        this.getAllCustomers();
      },
      error: () =>
        this.snackBar.open('Eroare la ștergerea clientului', 'Închide', {
          duration: 3000,
        }),
    });
  }

  openDialog(customer?: Customer) {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      width: '400px',
      data: customer ? { ...customer } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (customer) {
          // EDITARE
          this.http
            .put(`/api/customers/updatecustomer/${customer._id}`, result)
            .subscribe({
              next: () => {
                this.snackBar.open('Client actualizat cu succes!', 'Închide', {
                  duration: 3000,
                });
                this.getAllCustomers();
              },
              error: () => {
                this.snackBar.open('Eroare la actualizare', 'Închide', {
                  duration: 3000,
                });
              },
            });
        } else {
          // ADAUGARE
          this.http.post(`/api/customers/addcustomer`, result).subscribe({
            next: () => {
              this.snackBar.open('Client adăugat cu succes!', 'Închide', {
                duration: 3000,
              });
              this.getAllCustomers();
            },
            error: () => {
              this.snackBar.open('Eroare la adăugare', 'Închide', {
                duration: 3000,
              });
            },
          });
        }
      }
    });
  }
}
