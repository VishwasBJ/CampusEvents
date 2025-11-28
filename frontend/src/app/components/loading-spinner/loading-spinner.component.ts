import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" *ngIf="loading">
      <div class="spinner" [class.spinner-small]="size === 'small'" [class.spinner-large]="size === 'large'">
        <div class="spinner-circle"></div>
      </div>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      position: relative;
    }

    .spinner-small {
      width: 30px;
      height: 30px;
    }

    .spinner-large {
      width: 70px;
      height: 70px;
    }

    .spinner-circle {
      width: 100%;
      height: 100%;
      border: 4px solid rgba(74, 144, 226, 0.2);
      border-top-color: var(--primary-color, #4a90e2);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .spinner-message {
      margin-top: 1rem;
      color: var(--text-secondary, #777);
      font-size: 0.9rem;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() loading: boolean = true;
  @Input() message: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
