import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Explicit type union matching architectural constraints
export type TabKey = 'Departments' | 'Categories' | 'Employee';

export interface Department {
  id: string;
  name: string;
  head: string;
  parentDept: string;
  status: 'Active' | 'Inactive';
}

interface NavigationItem {
  id: string;
  label: string;
  iconClass: string;
  routePath: string;
}

@Component({
  selector: 'app-organization-setup',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './organization.html',
  styleUrls: ['./organization.css']
})
export class OrganizationSetupComponent implements OnInit {

  // Current Active UI State Trackers
  currentActiveTab: TabKey = 'Departments';

  // Strongly typed array rendering the data grids dynamically
  DEPARTMENT_DATA_STORE: Department[] = [
    { id: 'dept-01', name: 'Engineering', head: 'aditi rao', parentDept: '--', status: 'Active' },
    { id: 'dept-02', name: 'Facilities', head: 'rohan mehta', parentDept: '--', status: 'Active' },
    { id: 'dept-03', name: 'Field ops (east)', head: 'sana iqbal', parentDept: 'Field Ops', status: 'Inactive' }
  ];

  // Layout Configuration arrays to render cohesive structures
  SIDEBAR_NAV_CONFIG: NavigationItem[] = [
    { id: 'db', label: 'Dashboard', iconClass: 'icon-dashboard', routePath: '/dashboard' },
    { id: 'org', label: 'Organization setup', iconClass: 'icon-org', routePath: '/organization-setup' },
    { id: 'assets', label: 'Assets', iconClass: 'icon-assets', routePath: '/assets' },
    { id: 'alloc', label: 'Allocation & Transfer', iconClass: 'icon-transfer', routePath: '/transfer' },
    { id: 'book', label: 'Resource Booking', iconClass: 'icon-booking', routePath: '/booking' },
    { id: 'maint', label: 'Maintenance', iconClass: 'icon-maint', routePath: '/maintenance' },
    { id: 'audit', label: 'Audit', iconClass: 'icon-audit', routePath: '/audit' },
    { id: 'rep', label: 'Reports', iconClass: 'icon-reports', routePath: '/reports' },
    { id: 'notif', label: 'Notifications', iconClass: 'icon-notif', routePath: '/notifications' }
  ];

  LOWER_NAV_CONFIG: NavigationItem[] = [
    { id: 'sett', label: 'Settings', iconClass: 'icon-settings', routePath: '/settings' },
    { id: 'supp', label: 'Support', iconClass: 'icon-support', routePath: '/support' }
  ];

  ngOnInit(): void {}

  // Handles switching top management sub-views
  switchTab(selectedTab: TabKey): void {
    this.currentActiveTab = selectedTab;
    console.log(`Switched layout focus target state context to: [${selectedTab}]`);
  }

  // Action engine placeholders for UI events
  triggerAddNew(): void {
    console.log('Action Executed: Triggered opening overlay form [+ Add New].');
  }

  triggerEditAction(departmentId: string, departmentName: string): void {
    console.log(`Action Executed: Triggered workflow item transformation editing path row target -> ID: ${departmentId} (${departmentName})`);
  }
}