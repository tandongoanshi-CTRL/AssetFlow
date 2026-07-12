import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Asset {
  tag: string;
  name: string;
  category: string;
  status: 'Allocated' | 'Maintenance' | 'Available';
  location: string;
}

interface NavigationItem {
  id: string;
  label: string;
  iconClass: string;
  routePath: string;
}

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assets.html',
  styleUrls: ['./assets.css']
})
export class AssetsComponent implements OnInit {

  // Dynamic Array rendering the asset matrix perfectly
  ASSET_DATA_STORE: Asset[] = [
    { tag: 'AF-0012', name: 'Dell Laptop', category: 'Electronics', status: 'Allocated', location: 'bengaluru' },
    { tag: 'AF-0062', name: 'Projector', category: 'Electronics', status: 'Maintenance', location: 'HQ floor 2' },
    { tag: 'AF-0201', name: 'Office chair', category: 'Furniture', status: 'Available', location: 'Warehouse' },
    { tag: 'AF-0344', name: 'Apple iPad Pro', category: 'Electronics', status: 'Available', location: 'HQ floor 3' },
    { tag: 'AF-0412', name: 'Logitech MX Mouse', category: 'Peripherals', status: 'Allocated', location: 'London Office' }
  ];

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

  triggerSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    console.log(`Searching asset indexes for parameter values: "${query}"`);
  }

  triggerExport(): void {
    console.log('Action Executed: Fired dynamic compilation generation pipeline -> Exporting CSV structure bundle.');
  }

  triggerRegisterAsset(): void {
    console.log('Action Executed: Opening register asset modular configuration view modal.');
  }

  triggerClearFilters(): void {
    console.log('Action Executed: Clearing dropdown filter constraints states.');
  }

  changePage(pageNumber: number): void {
    console.log(`Paginating data catalog view model target layer index: Page ${pageNumber}`);
  }
}