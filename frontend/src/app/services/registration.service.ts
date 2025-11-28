import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Event } from './event.service';
import { User } from './auth.service';

export interface Registration {
    _id: string;
    event: Event | string;
    user: User | string;
    registeredAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {
    private apiUrl = `${environment.apiUrl}/registrations`;

    constructor(private http: HttpClient) { }

    registerForEvent(eventId: string): Observable<Registration> {
        return this.http.post<any>(this.apiUrl, { eventId }).pipe(
            map(response => response.registration || response)
        );
    }

    cancelRegistration(registrationId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${registrationId}`);
    }

    getMyRegistrations(): Observable<Registration[]> {
        return this.http.get<any>(`${this.apiUrl}/my-registrations`).pipe(
            map(response => response.registrations || response)
        );
    }
}
