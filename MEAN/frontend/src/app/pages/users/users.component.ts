import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersEditDialogComponent } from '../../components/user-dialog/users-edit-dialog.component';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
    MatIcon,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinner,
  ],
})
export class UsersComponent implements OnInit {
  usersData: any[] = [];
  displayedColumns: string[] = ['_id', 'name', 'role', 'actions'];
  loading = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.loading = true;
    this.http.get<any[]>('/api/users/').subscribe({
      next: (data) => {
        this.usersData = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Eroare la încărcarea utilizatorilor!', '', {
          duration: 3000,
        });
      },
    });
  }

  deleteUser(user: any): void {
    this.loading = true;
    this.http.delete(`/api/users/${user._id}`).subscribe({
      next: () => {
        this.snackBar.open('Utilizator șters cu succes!', '', {
          duration: 3000,
        });
        this.getAllUsers();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Eroare la ștergerea utilizatorului!', '', {
          duration: 3000,
        });
      },
    });
  }

  openEditDialog(user: any): void {
    const dialogRef = this.dialog.open(UsersEditDialogComponent, {
      width: '400px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.getAllUsers();
      }
    });
  }
}
