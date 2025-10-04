import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-users-edit-dialog',
  templateUrl: './users-edit-dialog.component.html',
  styleUrls: ['./users-edit-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class UsersEditDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UsersEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      role: [data.role, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.http.put(`/api/users/${this.data._id}`, this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Modificări salvate!', '', { duration: 3000 });
          this.dialogRef.close('updated');
        },
        error: () => {
          this.snackBar.open('Eroare la salvare!', '', { duration: 3000 });
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
