import { Routes } from '@angular/router';
import { AppComponent } from './login-1/login';
import { SignupComponent } from './signup/signup';
import { AuditComponent } from './audit/audit';
import { ReportsComponent } from './reports/reports';
import { NotificationsComponent } from './notifications/notifications';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'reports',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'organization-setup',
    loadComponent: () => import('./organization/organization').then(m => m.OrganizationSetupComponent)
  },
  {
    path: 'assets',
    loadComponent: () => import('./assets/assets').then(m => m.AssetsComponent)
  },
  {
    path: 'transfer',
    loadComponent: () => import('./allocation/allocation').then(m => m.AllocationComponent)
  },
  { path: 'notifications', component: NotificationsComponent },
  {
    path: 'booking',
    loadComponent: () => import('./booking/booking').then(m => m.BookingComponent)
  },
  {
    path: 'maintenance',
    loadComponent: () => import('./maintenance/maintenance').then(m => m.MaintenanceComponent)
  },
  { path: 'audit', component: AuditComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'login', component: AppComponent },
  { path: 'signup', component: SignupComponent }
];