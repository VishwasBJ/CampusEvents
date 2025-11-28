import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../../services/event.service';
import { RegistrationService, Registration } from '../../services/registration.service';
import { AuthService, User } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { slideUpAnimation, listAnimation } from '../../animations';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [slideUpAnimation, listAnimation]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  myEvents: Event[] = [];
  registrations: Registration[] = [];
  loading = true;

  constructor(
    private eventService: EventService,
    private registrationService: RegistrationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    forkJoin({
      events: this.eventService.getMyEvents(),
      registrations: this.registrationService.getMyRegistrations()
    }).subscribe({
      next: (data) => {
        this.myEvents = data.events;
        this.registrations = data.registrations;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });
  }

  getEvent(registration: Registration): Event | null {
    return typeof registration.event === 'object' ? registration.event : null;
  }
}
