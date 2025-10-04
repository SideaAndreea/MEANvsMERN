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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, HttpClientModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
    });

    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('auth');
      if (auth) {
        this.router.navigate(['/']);
      }
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;

    this.http.post<any>('/api/users/login', this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        alert('Utilizator autentificat cu succes!');
        localStorage.setItem(
          'auth',
          JSON.stringify({
            token: res.token,
            role: res.user.role,
            id: res.user.id,
            name: res.user.name,
          })
        );
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        alert('Eroare la autentificare!');
        console.error(err);
      },
    });
  }
}
