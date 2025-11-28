import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  recentEvents: any[] = [];
  loading = false;
  error = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadRecentEvents();
  }

  loadRecentEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        // Get the 3 most recent events
        this.recentEvents = events
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load recent events';
        this.loading = false;
      }
    });
  }
}
