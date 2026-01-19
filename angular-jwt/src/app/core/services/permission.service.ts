import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserPermissions {
  roles: string[];
  permissions: string[];
}

const PERMISSIONS_KEY = 'user_permissions';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissionsSubject = new BehaviorSubject<UserPermissions | null>(null);
  permissions$ = this.permissionsSubject.asObservable();
  private loaded = false;

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  fetchPermissions(): Observable<UserPermissions> {
    if (this.loaded && this.permissionsSubject.value) {
      return of(this.permissionsSubject.value);
    }

    return this.http.get<UserPermissions>(`${environment.apiUrl}/user/permissions`).pipe(
      tap(data => {
        this.permissionsSubject.next(data);
        this.loaded = true;
        localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(data));
      })
    );
  }

  get permissions(): UserPermissions | null {
    return this.permissionsSubject.value;
  }

  hasRole(role: string): boolean {
    return this.permissionsSubject.value?.roles.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  hasPermission(permission: string): boolean {
    return this.permissionsSubject.value?.permissions.includes(permission) ?? false;
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  clear(): void {
    this.permissionsSubject.next(null);
    this.loaded = false;
    localStorage.removeItem(PERMISSIONS_KEY);
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(PERMISSIONS_KEY);
    if (stored) {
      try {
        this.permissionsSubject.next(JSON.parse(stored));
      } catch {
        localStorage.removeItem(PERMISSIONS_KEY);
      }
    }
  }
}
