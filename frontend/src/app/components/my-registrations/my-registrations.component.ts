import { Component, OnInit } from '@angular/core';
import { RegistrationService, Registration } from '../../services/registration.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Event } from '../../services/event.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ToastService } from '../../services/toast.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';

@Component({
    selector: 'app-my-registrations',
    standalone: true,
    imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent],
    templateUrl: './my-registrations.component.html',
    styleUrl: './my-registrations.component.css'
})
export class MyRegistrationsComponent implements OnInit {
    registrations: Registration[] = [];
    loading: boolean = true;
    errorMessage: string = '';

    constructor(
        private registrationService: RegistrationService,
        private router: Router,
        private toastService: ToastService,
        private confirmationService: ConfirmationDialogService
    ) { }

    ngOnInit(): void {
        this.loadMyRegistrations();
    }

    loadMyRegistrations(): void {
        this.loading = true;
        this.registrationService.getMyRegistrations().subscribe({
            next: (registrations) => {
                this.registrations = registrations;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading registrations:', err);
                this.errorMessage = 'Failed to load your registrations';
                this.loading = false;
            }
        });
    }

    onCancelRegistration(registrationId: string): void {
        this.confirmationService.confirm({
            title: 'Cancel Registration',
            message: 'Are you sure you want to cancel this registration?',
            confirmText: 'Yes, Cancel',
            cancelText: 'No, Keep It',
            type: 'warning'
        }).subscribe(confirmed => {
            if (confirmed) {
                this.registrationService.cancelRegistration(registrationId).subscribe({
                    next: () => {
                        this.toastService.success('Registration cancelled successfully');
                        // Remove from local array
                        this.registrations = this.registrations.filter(r => r._id !== registrationId);
                    },
                    error: (err) => {
                        console.error('Error cancelling registration:', err);
                    }
                });
            }
        });
    }

    onViewEventDetails(eventId: string): void {
        this.router.navigate(['/events', eventId]);
    }

    getEvent(registration: Registration): Event | null {
        return typeof registration.event === 'object' ? registration.event : null;
    }
}
