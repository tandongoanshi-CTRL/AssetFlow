import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavigationItem {
  id: string;
  label: string;
  iconClass: string;
  isActive: boolean;
}

interface MetricItem {
  label: string;
  value: number;
}

interface ActivityItem {
  id: string;
  type: 'laptop' | 'room' | 'projector';
  boldTitle: string;
  text: string;
  highlightText?: string;
  deptText?: string;
  timestamp: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  SYSTEM_METRICS_STORE: MetricItem[] = [
    { label: 'Available', value: 128 },
    { label: 'Allocated', value: 76 },
    { label: 'Unallocated', value: 4 },
    { label: 'Active Bookings', value: 9 },
    { label: 'Pending Transfers', value: 3 },
    { label: 'Upcoming returns', value: 12 }
  ];

  RECENT_ACTIVITY_STREAM: ActivityItem[] = [
    {
      id: 'act-01',
      type: 'laptop',
      boldTitle: 'Laptop AF-0114',
      text: 'allocated to Priya Shah',
      deptText: 'IT dept',
      timestamp: '2m ago'
    },
    {
      id: 'act-02',
      type: 'room',
      boldTitle: 'Room B2',
      text: 'booking confirmed',
      highlightText: '2:00 to 3:00 PM',
      timestamp: '1h ago'
    },
    {
      id: 'act-03',
      type: 'projector',
      boldTitle: 'Projector AF-0062',
      text: 'maintenance resolved',
      timestamp: '4h ago'
    }
  ];

  SIDEBAR_NAV_CONFIG: NavigationItem[] = [
    { id: 'db', label: 'Dashboard', iconClass: 'icon-dashboard', isActive: true },
    { id: 'org', label: 'Organization setup', iconClass: 'icon-org', isActive: false },
    { id: 'assets', label: 'Assets', iconClass: 'icon-assets', isActive: false },
    { id: 'alloc', label: 'Allocation & Transfer', iconClass: 'icon-transfer', isActive: false },
    { id: 'book', label: 'Resource Booking', iconClass: 'icon-booking', isActive: false },
    { id: 'maint', label: 'Maintenance', iconClass: 'icon-maint', isActive: false },
    { id: 'audit', label: 'Audit', iconClass: 'icon-audit', isActive: false },
    { id: 'rep', label: 'Reports', iconClass: 'icon-reports', isActive: false },
    { id: 'notif', label: 'Notifications', iconClass: 'icon-notif', isActive: false }
  ];

  LOWER_NAV_CONFIG: NavigationItem[] = [
    { id: 'sett', label: 'Settings', iconClass: 'icon-settings', isActive: false },
    { id: 'supp', label: 'Support', iconClass: 'icon-support', isActive: false }
  ];

  ngOnInit(): void {}

  mutateActiveState(selectedIdentifier: string): void {
    this.SIDEBAR_NAV_CONFIG.forEach(item => {
      item.isActive = item.id === selectedIdentifier;
    });
  }

  triggerAction(actionName: string): void {
    console.log(`Action executed: [${actionName}]`);
  }
}