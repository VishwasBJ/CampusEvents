import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../../services/event.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ToastService } from '../../services/toast.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent implements OnInit {
  events: Event[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private eventService: EventService,
    private router: Router,
    private toastService: ToastService,
    private confirmationService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    this.loadMyEvents();
  }

  loadMyEvents(): void {
    this.loading = true;
    this.eventService.getMyEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.errorMessage = 'Failed to load your events';
        this.loading = false;
      }
    });
  }

  onEdit(eventId: string): void {
    this.router.navigate(['/edit-event', eventId]);
  }

  onDelete(eventId: string): void {
    this.confirmationService.confirm({
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event? This action cannot be undone and will also remove all registrations for this event.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.eventService.deleteEvent(eventId).subscribe({
          next: () => {
            this.toastService.success('Event deleted successfully');
            // Remove from local array
            this.events = this.events.filter(e => e._id !== eventId);
          },
          error: (err) => {
            console.error('Error deleting event:', err);
          }
        });
      }
    });
  }

  onViewDetails(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }
}
