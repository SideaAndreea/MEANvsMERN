import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, HttpClientModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      userId: ['', Validators.required],
      password: ['', Validators.required],
    });

    // ✅ Verificare că rulează în browser
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('auth');
      if (auth) {
        this.router.navigate(['/']);
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;

    this.http
      .post<any>('/api/users/register', this.registerForm.value)
      .subscribe({
        next: () => {
          this.loading = false;
          alert('Utilizator înregistrat cu succes!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          alert('Eroare la înregistrare!');
          console.error(err);
        },
      });
  }
}
