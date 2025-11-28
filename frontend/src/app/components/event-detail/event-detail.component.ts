import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService, Event } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { RegistrationService } from '../../services/registration.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  message: string = '';
  isLoggedIn: boolean = false;
  currentUserId: string | null = null;
  isCreator: boolean = false;
  isRegistered: boolean = false;
  registrationId: string | null = null;
  checkingRegistration: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    public authService: AuthService,
    private registrationService: RegistrationService,
    private router: Router,
    private toastService: ToastService,
    private confirmationService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isLoggedIn = this.authService.isAuthenticated();
    
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.currentUserId = user?._id || null;
    }

    if (id) {
      this.loadEvent(id);
    }
  }

  loadEvent(id: string): void {
    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.event = data;
        // Check if current user is the creator
        if (this.currentUserId && this.event.createdBy) {
          const creatorId = typeof this.event.createdBy === 'string' 
            ? this.event.createdBy 
            : this.event.createdBy._id;
          this.isCreator = this.currentUserId === creatorId;
        }
        
        // Check registration status if logged in and not creator
        if (this.isLoggedIn && !this.isCreator) {
          this.checkRegistrationStatus(id);
        }
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.message = 'Failed to load event details';
      }
    });
  }

  checkRegistrationStatus(eventId: string): void {
    this.checkingRegistration = true;
    this.registrationService.getMyRegistrations().subscribe({
      next: (registrations) => {
        const registration = registrations.find(r => {
          const regEventId = typeof r.event === 'string' ? r.event : r.event._id;
          return regEventId === eventId;
        });
        
        if (registration) {
          this.isRegistered = true;
          this.registrationId = registration._id;
        }
        this.checkingRegistration = false;
      },
      error: (err) => {
        console.error('Error checking registration status:', err);
        this.checkingRegistration = false;
      }
    });
  }

  onEdit(): void {
    if (this.event) {
      this.router.navigate(['/edit-event', this.event._id]);
    }
  }

  onDelete(): void {
    if (!this.event) return;

    this.confirmationService.confirm({
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed && this.event) {
        this.eventService.deleteEvent(this.event._id).subscribe({
          next: () => {
            this.toastService.success('Event deleted successfully');
            this.router.navigate(['/my-events']);
          },
          error: (err) => {
            console.error('Error deleting event:', err);
            this.message = 'Failed to delete event';
          }
        });
      }
    });
  }

  onRegister(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.event) return;

    this.registrationService.registerForEvent(this.event._id).subscribe({
      next: (registration) => {
        this.toastService.success('Successfully registered for the event!');
        this.isRegistered = true;
        this.registrationId = registration._id;
      },
      error: (err) => {
        console.error('Error registering for event:', err);
      }
    });
  }

  onCancelRegistration(): void {
    if (!this.registrationId) return;

    this.confirmationService.confirm({
      title: 'Cancel Registration',
      message: 'Are you sure you want to cancel your registration for this event?',
      confirmText: 'Yes, Cancel',
      cancelText: 'No, Keep It',
      type: 'warning'
    }).subscribe(confirmed => {
      if (confirmed && this.registrationId) {
        this.registrationService.cancelRegistration(this.registrationId).subscribe({
          next: () => {
            this.toastService.success('Registration cancelled successfully');
            this.isRegistered = false;
            this.registrationId = null;
          },
          error: (err) => {
            console.error('Error cancelling registration:', err);
          }
        });
      }
    });
  }
}
