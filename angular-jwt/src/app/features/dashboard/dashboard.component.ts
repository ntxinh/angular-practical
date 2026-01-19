import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  protectedData: string = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  fetchProtectedData(): void {
    this.loading = true;
    this.error = '';

    this.http.get<{ message: string }>(`${environment.apiUrl}/protected`).subscribe({
      next: (response) => {
        this.protectedData = response.message;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to fetch protected data';
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
