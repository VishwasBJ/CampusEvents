import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Event {
    _id: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    venue: string;
    category: EventCategory;
    bannerUrl: string;
    createdBy: any;
    createdAt: Date;
    updatedAt: Date;
}

export type EventCategory = 'Academic' | 'Cultural' | 'Sports' | 'Technical' | 'Social' | 'Other';

export interface CreateEventDto {
    title: string;
    description: string;
    date: Date;
    time: string;
    venue: string;
    category: EventCategory;
    bannerUrl?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = `${environment.apiUrl}/events`;

    constructor(private http: HttpClient) { }

    getAllEvents(): Observable<Event[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(response => response.events || response)
        );
    }

    getEventById(id: string): Observable<Event> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.event || response)
        );
    }

    createEvent(event: CreateEventDto): Observable<Event> {
        return this.http.post<any>(this.apiUrl, event).pipe(
            map(response => response.event || response)
        );
    }

    updateEvent(id: string, event: UpdateEventDto): Observable<Event> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, event).pipe(
            map(response => response.event || response)
        );
    }

    deleteEvent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getMyEvents(): Observable<Event[]> {
        return this.http.get<any>(`${this.apiUrl}/my-events`).pipe(
            map(response => response.events || response)
        );
    }

    searchEvents(query: string): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}?search=${query}`);
    }

    filterByCategory(category: string): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}?category=${category}`);
    }
}
