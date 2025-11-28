import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { MyRegistrationsComponent } from './components/my-registrations/my-registrations.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutComponent } from './components/about/about.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Public routes
    { path: '', component: HomeComponent, title: 'Home - CampusEvents' },
    { path: 'login', component: LoginComponent, title: 'Login - CampusEvents' },
    { path: 'register', component: RegisterComponent, title: 'Register - CampusEvents' },
    { path: 'events', component: EventListComponent, title: 'Events - CampusEvents' },
    { path: 'events/:id', component: EventDetailComponent, title: 'Event Details - CampusEvents' },
    { path: 'about', component: AboutComponent, title: 'About - CampusEvents' },
    
    // Protected routes (require authentication)
    { 
        path: 'dashboard', 
        component: DashboardComponent, 
        canActivate: [authGuard],
        title: 'Dashboard - CampusEvents'
    },
    { 
        path: 'create-event', 
        component: CreateEventComponent, 
        canActivate: [authGuard],
        title: 'Create Event - CampusEvents'
    },
    { 
        path: 'edit-event/:id', 
        component: EditEventComponent, 
        canActivate: [authGuard],
        title: 'Edit Event - CampusEvents'
    },
    { 
        path: 'my-events', 
        component: MyEventsComponent, 
        canActivate: [authGuard],
        title: 'My Events - CampusEvents'
    },
    { 
        path: 'my-registrations', 
        component: MyRegistrationsComponent, 
        canActivate: [authGuard],
        title: 'My Registrations - CampusEvents'
    },
    { 
        path: 'profile', 
        component: ProfileComponent, 
        canActivate: [authGuard],
        title: 'Profile - CampusEvents'
    },
    
    // Wildcard route - redirect to home
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
