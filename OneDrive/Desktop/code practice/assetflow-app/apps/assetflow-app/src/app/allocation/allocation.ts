import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface HistoryEvent {
  date: string;
  type: 'allocated' | 'returned';
  mainText: string;
  boldText: string;
  extraText: string;
  highlightText?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  iconClass: string;
  routePath: string;
}

@Component({
  selector: 'app-allocation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './allocation.html',
  styleUrls: ['./allocation.css']
})
export class AllocationComponent implements OnInit {

  // Form Model States
  assetName: string = 'AF-0114 – Dell laptop';
  currentOwner: string = 'Priya Shah';
  targetEmployee: string = '';
  transferReason: string = '';

  employeesList: string[] = [
    'Arjun Nair',
    'Sarah Jenkins',
    'Michael Chang'
  ];

  // Dynamic Timeline Events Array
  allocationHistory: HistoryEvent[] = [
    {
      date: 'MAR 12, 2024',
      type: 'allocated',
      mainText: 'Allocated to ',
      boldText: 'Priya Shah',
      extraText: ' – Engineering'
    },
    {
      date: 'JAN 04, 2024',
      type: 'returned',
      mainText: 'Returned by ',
      boldText: 'Arjun Nair',
      extraText: ' – condition: ',
      highlightText: 'good'
    }
  ];

  // Cohesive Sidebar Layout Mapping
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

  ngOnInit(): void {}

  onSubmitTransfer(): void {
    console.log('Transfer Request Action Triggered:', {
      asset: this.assetName,
      from: this.currentOwner,
      to: this.targetEmployee,
      reason: this.transferReason
    });
  }
}