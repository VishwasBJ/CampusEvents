import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogService, ConfirmationDialogData } from '../../services/confirmation-dialog.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" *ngIf="isVisible" [@fadeAnimation] (click)="onCancel()">
      <div class="dialog-container" [@slideAnimation] (click)="$event.stopPropagation()">
        <div class="dialog-header" [class.dialog-danger]="dialogData?.type === 'danger'"
                                    [class.dialog-warning]="dialogData?.type === 'warning'">
          <h3>{{ dialogData?.title }}</h3>
        </div>
        <div class="dialog-body">
          <p>{{ dialogData?.message }}</p>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" (click)="onCancel()">
            {{ dialogData?.cancelText || 'Cancel' }}
          </button>
          <button class="btn" 
                  [class.btn-danger]="dialogData?.type === 'danger'"
                  [class.btn-warning]="dialogData?.type === 'warning'"
                  [class.btn-primary]="!dialogData?.type || dialogData?.type === 'info'"
                  (click)="onConfirm()">
            {{ dialogData?.confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    }

    .dialog-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
      overflow: hidden;
    }

    .dialog-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .dialog-header.dialog-danger {
      background: #fef2f2;
      border-bottom-color: #fecaca;
    }

    .dialog-header.dialog-warning {
      background: #fffbeb;
      border-bottom-color: #fde68a;
    }

    .dialog-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .dialog-danger h3 {
      color: #dc2626;
    }

    .dialog-warning h3 {
      color: #d97706;
    }

    .dialog-body {
      padding: 24px;
    }

    .dialog-body p {
      margin: 0;
      color: #4b5563;
      line-height: 1.6;
      font-size: 15px;
    }

    .dialog-footer {
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: #f9fafb;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #4a90e2;
      color: white;
    }

    .btn-primary:hover {
      background: #357abd;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-warning {
      background: #f59e0b;
      color: white;
    }

    .btn-warning:hover {
      background: #d97706;
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #d1d5db;
    }

    @media (max-width: 768px) {
      .dialog-container {
        max-width: 100%;
        margin: 0 10px;
      }

      .dialog-footer {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
      }
    }
  `],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'scale(0.9)', opacity: 0 }))
      ])
    ])
  ]
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  isVisible = false;
  dialogData: ConfirmationDialogData | null = null;
  private subscription?: Subscription;

  constructor(private confirmationService: ConfirmationDialogService) {}

  ngOnInit(): void {
    this.subscription = this.confirmationService.dialog$.subscribe(data => {
      this.dialogData = data;
      this.isVisible = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onConfirm(): void {
    this.isVisible = false;
    this.confirmationService.sendResult(true);
  }

  onCancel(): void {
    this.isVisible = false;
    this.confirmationService.sendResult(false);
  }
}
