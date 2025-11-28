import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService, EventCategory } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  eventForm: FormGroup;
  errorMessage: string = '';
  categories: EventCategory[] = ['Academic', 'Cultural', 'Sports', 'Technical', 'Social', 'Other'];
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
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

    this.eventService.createEvent(this.eventForm.value).subscribe({
      next: () => {
        this.toastService.success('Event created successfully!');
        this.router.navigate(['/my-events']);
      },
      error: (err) => {
        console.error('Error creating event:', err);
        this.errorMessage = err.error?.message || 'Failed to create event. Please try again.';
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
