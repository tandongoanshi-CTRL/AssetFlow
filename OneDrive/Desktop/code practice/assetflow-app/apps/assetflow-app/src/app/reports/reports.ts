import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/* ==========================================================================
   TYPE DEFINITIONS
   ========================================================================== */

// One bar in the "Utilization by department" chart
interface DepartmentUtilization {
  department: string;
  utilizationPercent: number; // 0–100, drives bar height
}

// One point in the "Maintenance Frequency" line chart
interface MaintenancePoint {
  month: string;
  count: number;
}

// A row in the "Most used assets" / "Idle assets" cards
interface AssetUsageRow {
  id: string;
  tag: string;
  name: string;
  subLabel: string; // right-aligned stat, e.g. "34 bookings this month"
  tone: 'neutral' | 'warning' | 'danger'; // controls text color of subLabel
}

// A row in the "Assets due for maintenance / nearing retirement" card
type MaintenanceIconType = 'wrench' | 'laptop';

interface MaintenanceDueRow {
  id: string;
  tag: string;
  name: string;
  icon: MaintenanceIconType;
  detail: string;
  actionLabel: string;
  actionStyle: 'danger' | 'outline';
}

/**
 * Reports & Analytics page.
 * Shows utilization/maintenance charts, most-used and idle asset lists,
 * and a maintenance/retirement alert list with an export action.
 */
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
})
export class ReportsComponent {
  /* ------------------------------------------------------------------------
     MOCK DATA
     In a real app this would come from a service/API call instead of being
     hardcoded on the component.
     ------------------------------------------------------------------------ */

  utilizationData: DepartmentUtilization[] = [
    { department: 'IT', utilizationPercent: 62 },
    { department: 'Ops', utilizationPercent: 78 },
    { department: 'HR', utilizationPercent: 45 },
    { department: 'Mkt', utilizationPercent: 90 },
    { department: 'Eng', utilizationPercent: 70 },
    { department: 'Sales', utilizationPercent: 55 },
  ];

  maintenanceFrequency: MaintenancePoint[] = [
    { month: 'Jan', count: 3 },
    { month: 'Feb', count: 5 },
    { month: 'Mar', count: 4 },
    { month: 'Apr', count: 6 },
    { month: 'May', count: 9 },
    { month: 'Jun', count: 8 },
    { month: 'Jul', count: 10 },
    { month: 'Aug', count: 11 },
  ];

  mostUsedAssets: AssetUsageRow[] = [
    { id: 'mu-1', tag: 'Room B2', name: 'High-capacity Conference Hall', subLabel: '34 bookings this month', tone: 'neutral' },
    { id: 'mu-2', tag: 'Van AF-343', name: 'Logistics Fleet', subLabel: '21 trips this month', tone: 'neutral' },
    { id: 'mu-3', tag: 'Projector AF-335', name: 'AV Equipment', subLabel: '18 uses', tone: 'neutral' },
  ];

  idleAssets: AssetUsageRow[] = [
    { id: 'idle-1', tag: 'Camera AF-0301', name: 'Photography Kit #3', subLabel: 'unused 60+ days', tone: 'danger' },
    { id: 'idle-2', tag: 'Chair AF-0410', name: 'Ergonomic Task Seat', subLabel: 'unused 45 days', tone: 'warning' },
  ];

  maintenanceDueRows: MaintenanceDueRow[] = [
    { id: 'due-1', tag: 'Forklift AF-0087', name: '', icon: 'wrench', detail: 'Hydraulic system service due in 5 days', actionLabel: 'Schedule', actionStyle: 'danger' },
    { id: 'due-2', tag: 'Laptop AF-0020', name: '', icon: 'laptop', detail: '4 years old : nearing retirement', actionLabel: 'Lifecycle Review', actionStyle: 'outline' },
  ];

  /* ------------------------------------------------------------------------
     CHART GEOMETRY HELPERS
     Used in the template to compute simple inline-SVG bar/line charts
     without pulling in a charting library.
     ------------------------------------------------------------------------ */

  private readonly chartWidth = 420;
  private readonly chartHeight = 160;

  /** Height (in px) of a single utilization bar, scaled to chartHeight. */
  barHeight(utilizationPercent: number): number {
    return (utilizationPercent / 100) * this.chartHeight;
  }

  /** Y position (top offset) for a bar of the given height, so bars sit on the baseline. */
  barY(utilizationPercent: number): number {
    return this.chartHeight - this.barHeight(utilizationPercent);
  }

  /** X position for the nth bar, evenly spaced across chartWidth. */
  barX(index: number): number {
    const barSlotWidth = this.chartWidth / this.utilizationData.length;
    const barWidth = barSlotWidth * 0.5;
    return index * barSlotWidth + (barSlotWidth - barWidth) / 2;
  }

  barWidth(): number {
    return (this.chartWidth / this.utilizationData.length) * 0.5;
  }

  /** Builds the SVG polyline "points" attribute for the maintenance frequency line chart. */
  get linePoints(): string {
    const maxCount = Math.max(...this.maintenanceFrequency.map((p) => p.count));
    const slotWidth = this.chartWidth / (this.maintenanceFrequency.length - 1);

    return this.maintenanceFrequency
      .map((point, index) => {
        const x = index * slotWidth;
        const y = this.chartHeight - (point.count / maxCount) * this.chartHeight;
        return `${x},${y}`;
      })
      .join(' ');
  }

  /** Returns [x, y] for a single data point circle marker on the line chart. */
  linePointCoords(index: number): { x: number; y: number } {
    const maxCount = Math.max(...this.maintenanceFrequency.map((p) => p.count));
    const slotWidth = this.chartWidth / (this.maintenanceFrequency.length - 1);
    const point = this.maintenanceFrequency[index];
    return {
      x: index * slotWidth,
      y: this.chartHeight - (point.count / maxCount) * this.chartHeight,
    };
  }

  /**
   * Maps an AssetUsageRow's tone to its corresponding CSS modifier class,
   * used in the template via [ngClass].
   */
  toneClass(tone: AssetUsageRow['tone']): string {
    switch (tone) {
      case 'warning':
        return 'sublabel-warning';
      case 'danger':
        return 'sublabel-danger';
      default:
        return 'sublabel-neutral';
    }
  }

  /* ------------------------------------------------------------------------
     EVENT HANDLERS
     ------------------------------------------------------------------------ */

  onNewAsset(): void {
    console.log('Action: open "New Asset" form');
  }

  onAddResource(): void {
    console.log('Action: open "Add Resource" form');
  }

  onExportReport(): void {
    console.log('Action: export analytics report');
  }

  onScheduleMaintenance(row: MaintenanceDueRow): void {
    console.log(`Action: schedule maintenance for ${row.tag}`);
  }

  onLogout(): void {
    console.log('Action: log out current user');
  }

  /**
   * Placeholder for sidebar nav clicks. If your app already has a shared
   * layout/shell component handling navigation, delete the sidebar markup
   * from reports.html entirely and remove this method.
   */
  onNavClick(page: string): void {
    console.log(`Navigated to: ${page}`);
  }
}