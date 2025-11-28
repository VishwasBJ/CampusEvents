# CampusEvents Design Document

## Overview

CampusEvents is a full-stack MEAN application that enables students to discover, create, and manage campus events. The system follows a three-tier architecture with Angular frontend, Node.js/Express backend, and MongoDB database.

### Technology Stack

- **Frontend**: Angular 15+ with TypeScript, RxJS for reactive programming
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt for password hashing

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Angular Frontend                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Components  │  │   Services   │  │    Guards    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │ HTTP/HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Express.js Backend                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Routes    │  │ Controllers  │  │  Middleware  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐                                      │
│  │   Models     │                                      │
│  └──────────────┘                                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Database                      │
│  Users Collection │ Events Collection │ Registrations   │
└─────────────────────────────────────────────────────────┘
```

### Frontend Architecture

**Component Structure:**
- App Component (root)
  - Header Component (navigation)
  - Home Component
  - Events List Component
  - Event Details Component
  - Login Component
  - Register Component
  - Dashboard Component
  - Create Event Component
  - Edit Event Component
  - My Events Component
  - My Registrations Component
  - Profile Component
  - About Component

**Service Layer:**
- AuthService: Handle authentication, token management
- EventService: CRUD operations for events
- RegistrationService: Manage event registrations

**Guards:**
- AuthGuard: Protect routes requiring authentication

### Backend Architecture

**API Routes Structure:**
```
/api/auth
  POST /register
  POST /login
  GET /profile (protected)
  PUT /profile (protected)

/api/events
  GET /
  GET /:id
  POST / (protected)
  PUT /:id (protected)
  DELETE /:id (protected)
  GET /my-events (protected)

/api/registrations
  POST / (protected)
  DELETE /:id (protected)
  GET /my-registrations (protected)
```

**Middleware Stack:**
- CORS middleware
- Body parser (JSON)
- JWT authentication middleware
- Error handling middleware

## Components and Interfaces

### Frontend Components

#### 1. Authentication Components

**LoginComponent**
- Template: Email/password form with validation
- Logic: Call AuthService.login(), store JWT token, redirect to dashboard
- Error handling: Display authentication errors

**RegisterComponent**
- Template: Name/email/password form with validation
- Logic: Call AuthService.register(), auto-login after registration
- Validation: Email format, password strength, matching passwords

#### 2. Event Components

**EventsListComponent**
- Template: Grid/list view of events with filters (category, date)
- Logic: Fetch events from EventService, implement search/filter
- Features: Pagination, sorting, category filtering

**EventDetailsComponent**
- Template: Full event information, register/edit buttons
- Logic: Fetch event by ID, handle registration
- Conditional rendering: Show edit/delete for creators, register for others

**CreateEventComponent**
- Template: Form with title, description, date, time, venue, category, banner upload
- Logic: Validate inputs, call EventService.create(), redirect to event details
- File upload: Handle banner image upload

**EditEventComponent**
- Template: Pre-filled form with event data
- Logic: Fetch event, verify ownership, update event, handle errors
- Authorization: Only allow editing if user is creator

**MyEventsComponent**
- Template: List of user's created events with edit/delete actions
- Logic: Fetch user's events, handle delete with confirmation
- Empty state: Message when no events exist

**MyRegistrationsComponent**
- Template: List of registered events with cancel option
- Logic: Fetch user's registrations, handle cancellation
- Display: Show event details for each registration

#### 3. Dashboard Component

**DashboardComponent**
- Template: Overview with created events and registrations
- Logic: Fetch user's events and registrations
- Statistics: Count of created events, registrations

#### 4. Profile Component

**ProfileComponent**
- Template: Display and edit user information
- Logic: Fetch user profile, update name/email, password change option
- Validation: Email format, required fields

#### 5. Static Components

**HomeComponent**
- Template: Hero section, featured events, call-to-action
- Logic: Fetch recent/featured events

**AboutComponent**
- Template: Project information, technology stack, features
- Static content with project details

### Frontend Services

#### AuthService
```typescript
interface AuthService {
  register(name: string, email: string, password: string): Observable<AuthResponse>
  login(email: string, password: string): Observable<AuthResponse>
  logout(): void
  getToken(): string | null
  isAuthenticated(): boolean
  getCurrentUser(): User | null
  updateProfile(data: Partial<User>): Observable<User>
}
```

#### EventService
```typescript
interface EventService {
  getAllEvents(): Observable<Event[]>
  getEventById(id: string): Observable<Event>
  createEvent(event: CreateEventDto): Observable<Event>
  updateEvent(id: string, event: UpdateEventDto): Observable<Event>
  deleteEvent(id: string): Observable<void>
  getMyEvents(): Observable<Event[]>
  searchEvents(query: string): Observable<Event[]>
  filterByCategory(category: string): Observable<Event[]>
}
```

#### RegistrationService
```typescript
interface RegistrationService {
  registerForEvent(eventId: string): Observable<Registration>
  cancelRegistration(registrationId: string): Observable<void>
  getMyRegistrations(): Observable<Registration[]>
  isRegistered(eventId: string): Observable<boolean>
}
```

### Backend Controllers

#### AuthController
- `register`: Validate input, hash password with salt, create user, return JWT
- `login`: Verify credentials, compare password hash, generate JWT
- `getProfile`: Extract user from JWT, return user data
- `updateProfile`: Validate updates, update user record

#### EventController
- `getAllEvents`: Fetch all events with creator population
- `getEventById`: Fetch single event with creator details
- `createEvent`: Validate input, set createdBy, create event
- `updateEvent`: Verify ownership, validate input, update event
- `deleteEvent`: Verify ownership, delete event and related registrations
- `getMyEvents`: Fetch events where createdBy matches authenticated user

#### RegistrationController
- `registerForEvent`: Verify event exists, check not creator, check not duplicate, create registration
- `cancelRegistration`: Verify ownership, delete registration
- `getMyRegistrations`: Fetch registrations for authenticated user with event population

## Data Models

### User Model (MongoDB Schema)

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}

Indexes: email (unique)
```

### Event Model (MongoDB Schema)

```javascript
{
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Academic', 'Cultural', 'Sports', 'Technical', 'Social', 'Other']
  },
  bannerUrl: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}

Indexes: createdBy, date, category
```

### Registration Model (MongoDB Schema)

```javascript
{
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}

Indexes: 
  - Compound unique index on (event, user)
  - user
  - event
```

### TypeScript Interfaces (Frontend)

```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: EventCategory;
  bannerUrl: string;
  createdBy: User | string;
  createdAt: Date;
  updatedAt: Date;
}

type EventCategory = 'Academic' | 'Cultural' | 'Sports' | 'Technical' | 'Social' | 'Other';

interface Registration {
  _id: string;
  event: Event | string;
  user: User | string;
  registeredAt: Date;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface CreateEventDto {
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: EventCategory;
  bannerUrl?: string;
}

interface UpdateEventDto extends Partial<CreateEventDto> {}
```

## Error Handling

### Frontend Error Handling

**HTTP Interceptor:**
- Intercept all HTTP requests to add JWT token in Authorization header
- Intercept all HTTP responses to handle errors globally
- On 401 Unauthorized: Clear token, redirect to login
- On 403 Forbidden: Show "Access Denied" message
- On 404 Not Found: Show "Resource not found" message
- On 500 Server Error: Show generic error message
- Display user-friendly error messages using toast/snackbar notifications

**Form Validation:**
- Client-side validation for all forms
- Display inline error messages
- Disable submit button until form is valid
- Show validation errors on blur and submit

### Backend Error Handling

**Error Middleware:**
```javascript
- Catch all errors from routes and controllers
- Log errors with stack traces
- Return appropriate HTTP status codes
- Send structured error responses: { success: false, message: string, error?: any }
- Handle MongoDB validation errors
- Handle JWT errors (invalid, expired)
- Handle duplicate key errors
```

**Validation:**
- Validate request body using express-validator
- Return 400 Bad Request with validation errors

**Authorization Checks:**
- Verify JWT token in protected routes
- Check resource ownership before update/delete
- Return 403 Forbidden for unauthorized actions

**Database Error Handling:**
- Handle connection errors
- Handle query errors
- Implement retry logic for transient failures
- Return 500 Internal Server Error for database failures

## Testing Strategy

For a college project, focus on basic manual testing:
- Test user registration and login
- Test creating, editing, and deleting events
- Test event registration and cancellation
- Test all forms with valid and invalid data
- Test authorization (users can only edit/delete their own events)

## Security Considerations

### Authentication & Authorization

- Store passwords as bcrypt hashes with unique salts
- Use strong JWT secret (environment variable)
- Set reasonable JWT expiration (24 hours)
- Implement token refresh mechanism
- Verify resource ownership before modifications
- Protect all sensitive routes with JWT middleware

### Input Validation

- Validate all inputs on backend
- Use parameterized queries (Mongoose handles this)

### CORS Configuration

- Configure CORS to allow frontend origin

### Environment Variables

- Store sensitive data in .env file
- Never commit .env to version control
- Use different configs for dev/prod
- Required variables:
  - MONGODB_URI
  - JWT_SECRET
  - PORT
  - FRONTEND_URL
  - NODE_ENV

## Deployment

### Development Environment

- Frontend: `ng serve` on localhost:4200
- Backend: `nodemon server.js` on localhost:3000
- Database: Local MongoDB instance or MongoDB Atlas

### Production (Optional)

**Frontend:**
- Build: `ng build --configuration production`
- Deploy: Static hosting (Netlify, Vercel, Heroku)

**Backend:**
- Host: Node.js hosting (Heroku, Render)
- Database: MongoDB Atlas (free tier)
