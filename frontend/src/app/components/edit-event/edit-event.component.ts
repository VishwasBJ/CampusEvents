import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { EventService, EventCategory } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  eventForm: FormGroup;
  eventId: string | null = null;
  errorMessage: string = '';
  categories: EventCategory[] = ['Academic', 'Cultural', 'Sports', 'Technical', 'Social', 'Other'];
  minDate: string;
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      time: ['', Validators.required],
      venue: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      bannerUrl: ['']
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    
    if (!this.eventId) {
      this.router.navigate(['/events']);
      return;
    }

    this.loadEvent();
  }

  loadEvent(): void {
    if (!this.eventId) return;

    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        // Verify user is the creator
        const currentUser = this.authService.getCurrentUser();
        const creatorId = typeof event.createdBy === 'string' 
          ? event.createdBy 
          : event.createdBy._id;
        
        if (!currentUser || currentUser._id !== creatorId) {
          this.toastService.error('You are not authorized to edit this event');
          this.router.navigate(['/events', this.eventId]);
          return;
        }

        // Format date for input type="date"
        const date = new Date(event.date).toISOString().split('T')[0];
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          date: date,
          time: event.time,
          venue: event.venue,
          category: event.category,
          bannerUrl: event.bannerUrl
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.errorMessage = 'Could not load event details';
        this.loading = false;
      }
    });
  }

  futureDateValidator(control: any) {
    if (!control.value) return null;
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.markFormGroupTouched(this.eventForm);
      return;
    }

    if (!this.eventId) return;

    this.eventService.updateEvent(this.eventId, this.eventForm.value).subscribe({
      next: () => {
        this.toastService.success('Event updated successfully!');
        this.router.navigate(['/events', this.eventId]);
      },
      error: (err) => {
        console.error('Error updating event:', err);
        this.errorMessage = err.error?.message || 'Failed to update event. Please try again.';
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['pastDate']) return 'Event date must be in the future';
    }
    return '';
  }
}
