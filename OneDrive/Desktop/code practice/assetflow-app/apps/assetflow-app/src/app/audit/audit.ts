import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/* ==========================================================================
   TYPE DEFINITIONS
   ========================================================================== */

// Verification result an audited asset can have
type VerificationResult = 'Verified' | 'Missing' | 'Damaged';

// Which icon to show next to the asset name in the table
type AssetIconType = 'laptop' | 'chair' | 'monitor';

// Shape of a single row in the verification checklist
interface AuditRow {
  id: string;
  tag: string;
  name: string;
  icon: AssetIconType;
  expectedLocation: string;
  verification: VerificationResult;
}

/**
 * Asset Audit page.
 * Shows the current audit cycle context, a verification checklist table,
 * an auto-generated discrepancy count, and actions to close/discard the cycle.
 */
@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit.html',
  styleUrls: ['./audit.css'],
})
export class AuditComponent {
  /* ------------------------------------------------------------------------
     MOCK DATA
     In a real app this would come from a service/API call instead of being
     hardcoded on the component.
     ------------------------------------------------------------------------ */
  auditRows: AuditRow[] = [
    { id: 'row-1', tag: 'AF-003', name: 'Dell laptop', icon: 'laptop', expectedLocation: 'Desk E12', verification: 'Verified' },
    { id: 'row-2', tag: 'AF-9921', name: 'Office chair', icon: 'chair', expectedLocation: 'Desk E14', verification: 'Missing' },
    { id: 'row-3', tag: 'AF-9838', name: 'Monitor', icon: 'monitor', expectedLocation: 'Desk E15', verification: 'Damaged' },
  ];

  /**
   * Number of rows that were NOT verified (i.e. flagged as a discrepancy).
   * Used to build the "X assets flagged..." banner text and to decide
   * whether to show the banner at all.
   */
  get discrepancyCount(): number {
    return this.auditRows.filter((row) => row.verification !== 'Verified').length;
  }

  get discrepancyText(): string {
    const count = this.discrepancyCount;
    return `${count} asset${count === 1 ? '' : 's'} flagged – discrepancy report generated automatically`;
  }

  /**
   * Maps a VerificationResult to its corresponding CSS modifier class,
   * used in the template via [ngClass].
   */
  verificationClass(result: VerificationResult): string {
    switch (result) {
      case 'Verified':
        return 'status-verified';
      case 'Missing':
        return 'status-missing';
      case 'Damaged':
        return 'status-damaged';
    }
  }

  /* ------------------------------------------------------------------------
     EVENT HANDLERS
     Wired up via (click) bindings in audit.html.
     ------------------------------------------------------------------------ */

  onNewAsset(): void {
    console.log('Action: open "New Asset" form');
  }

  onExportResults(): void {
    console.log('Action: export audit results');
  }

  onDiscardDraft(): void {
    const confirmed = confirm('Discard this audit draft? This cannot be undone.');
    if (confirmed) {
      console.log('Action: audit draft discarded');
    }
  }

  onCloseAudit(): void {
    const confirmed = confirm('Close this audit cycle? Flagged assets will move to their reported status.');
    if (confirmed) {
      console.log('Action: audit cycle closed');
    }
  }

  /**
   * Placeholder for sidebar nav clicks. If your app already has a shared
   * layout/shell component handling navigation, you can delete the sidebar
   * markup from audit.html entirely and remove this method — see the note
   * at the bottom of my reply.
   */
  onNavClick(page: string): void {
    console.log(`Navigated to: ${page}`);
  }
}