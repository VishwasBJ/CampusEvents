# Requirements Document

## Introduction

CampusEvents is a full-stack web application built using the MEAN stack (MongoDB, Express.js, Angular, and Node.js) that enables students to discover campus events, register for events, and create/manage their own events. The system provides secure authentication, personal dashboards, and comprehensive event management capabilities with role-based access control.

## Glossary

- **CampusEvents System**: The complete web application including frontend, backend, and database components
- **User**: A registered student who can view, create, and register for campus events
- **Event**: A campus activity with details including title, description, date, time, venue, category, and banner
- **Registration**: A record linking a User to an Event they plan to attend
- **JWT**: JSON Web Token used for secure authentication
- **Event Creator**: The User who created a specific Event
- **Dashboard**: A personalized page showing a User's created events and event registrations
- **Protected Route**: An API endpoint or page that requires authentication to access
- **CRUD Operations**: Create, Read, Update, and Delete operations for data management

## Requirements

### Requirement 1

**User Story:** As a student, I want to register for an account with my name, email, and password, so that I can access the platform's features

#### Acceptance Criteria

1. WHEN a student submits valid registration information, THE CampusEvents System SHALL create a new User record with name, email, passwordHash, salt, and timestamps
2. WHEN a student submits a registration with an email that already exists, THE CampusEvents System SHALL reject the registration and return an error message
3. THE CampusEvents System SHALL hash the password with a unique salt before storing it in the database
4. WHEN a User record is created, THE CampusEvents System SHALL store the creation timestamp and last update timestamp
5. THE CampusEvents System SHALL validate that the email follows a valid email format before creating the User record

### Requirement 2

**User Story:** As a registered student, I want to log in securely using my email and password, so that I can access my personalized dashboard and protected features

#### Acceptance Criteria

1. WHEN a User submits valid login credentials, THE CampusEvents System SHALL authenticate the User and return a JWT token
2. WHEN a User submits invalid credentials, THE CampusEvents System SHALL reject the login attempt and return an authentication error
3. THE CampusEvents System SHALL verify the password against the stored passwordHash and salt during authentication
4. WHEN authentication succeeds, THE CampusEvents System SHALL include the User's ID and email in the JWT token payload
5. THE CampusEvents System SHALL set a reasonable expiration time for the JWT token to maintain security

### Requirement 3

**User Story:** As any visitor, I want to view a list of all campus events without logging in, so that I can discover what events are happening on campus

#### Acceptance Criteria

1. THE CampusEvents System SHALL display all Events on the Events List page without requiring authentication
2. WHEN a visitor accesses the Events List page, THE CampusEvents System SHALL retrieve all Event records from the database
3. THE CampusEvents System SHALL display each Event with its title, date, time, venue, category, and banner image
4. THE CampusEvents System SHALL allow visitors to navigate to individual Event Details pages without authentication
5. THE CampusEvents System SHALL sort Events by date in ascending order on the Events List page

### Requirement 4

**User Story:** As any visitor, I want to view detailed information about a specific event, so that I can learn more about events that interest me

#### Acceptance Criteria

1. WHEN a visitor selects an Event from the list, THE CampusEvents System SHALL display the complete Event details including title, description, date, time, venue, category, and banner
2. THE CampusEvents System SHALL display the Event Details page without requiring authentication
3. WHEN an Event has a creator, THE CampusEvents System SHALL display the creator's name on the Event Details page
4. IF a User is logged in and viewing an Event they created, THEN THE CampusEvents System SHALL display edit and delete options
5. IF a User is logged in and viewing an Event created by another User, THEN THE CampusEvents System SHALL display a registration option

### Requirement 5

**User Story:** As a logged-in student, I want to access my personal dashboard, so that I can view my created events and events I've registered for

#### Acceptance Criteria

1. WHEN an authenticated User accesses the Dashboard, THE CampusEvents System SHALL display all Events created by that User
2. WHEN an authenticated User accesses the Dashboard, THE CampusEvents System SHALL display all Events the User has registered for
3. THE CampusEvents System SHALL require a valid JWT token to access the Dashboard page
4. WHEN an unauthenticated visitor attempts to access the Dashboard, THE CampusEvents System SHALL redirect them to the Login page
5. THE CampusEvents System SHALL display the User's profile information on the Dashboard

### Requirement 6

**User Story:** As a logged-in student, I want to create a new campus event, so that I can share events with other students

#### Acceptance Criteria

1. WHEN an authenticated User submits a new Event with valid information, THE CampusEvents System SHALL create an Event record with title, description, date, time, venue, category, banner URL, createdBy reference, and timestamps
2. THE CampusEvents System SHALL require a valid JWT token to access the Create Event functionality
3. THE CampusEvents System SHALL set the createdBy field to the authenticated User's ID when creating an Event
4. THE CampusEvents System SHALL validate that all required fields (title, description, date, time, venue, category) are provided before creating the Event
5. WHEN an Event is successfully created, THE CampusEvents System SHALL redirect the User to the Event Details page or My Events page

### Requirement 7

**User Story:** As a logged-in student, I want to edit events that I created, so that I can update event information when details change

#### Acceptance Criteria

1. WHEN an authenticated User who created an Event submits updated information, THE CampusEvents System SHALL update the Event record with the new information
2. THE CampusEvents System SHALL verify that the authenticated User's ID matches the Event's createdBy field before allowing updates
3. IF a User attempts to edit an Event they did not create, THEN THE CampusEvents System SHALL reject the request and return an authorization error
4. THE CampusEvents System SHALL update the Event's timestamp when modifications are saved
5. THE CampusEvents System SHALL require a valid JWT token to access the Edit Event functionality

### Requirement 8

**User Story:** As a logged-in student, I want to delete events that I created, so that I can remove cancelled or outdated events

#### Acceptance Criteria

1. WHEN an authenticated User who created an Event requests deletion, THE CampusEvents System SHALL remove the Event record from the database
2. THE CampusEvents System SHALL verify that the authenticated User's ID matches the Event's createdBy field before allowing deletion
3. IF a User attempts to delete an Event they did not create, THEN THE CampusEvents System SHALL reject the request and return an authorization error
4. WHEN an Event is deleted, THE CampusEvents System SHALL also remove all Registration records associated with that Event
5. THE CampusEvents System SHALL require a valid JWT token to access the Delete Event functionality

### Requirement 9

**User Story:** As a logged-in student, I want to register for events created by other students, so that I can attend events that interest me

#### Acceptance Criteria

1. WHEN an authenticated User registers for an Event, THE CampusEvents System SHALL create a Registration record with event reference, user reference, and registeredAt timestamp
2. THE CampusEvents System SHALL prevent a User from registering for an Event they created
3. THE CampusEvents System SHALL prevent duplicate registrations by checking if a Registration already exists for the User and Event combination
4. WHEN a duplicate registration is attempted, THE CampusEvents System SHALL return an error message indicating the User is already registered
5. THE CampusEvents System SHALL require a valid JWT token to register for Events

### Requirement 10

**User Story:** As a logged-in student, I want to view all events I have created, so that I can manage my events in one place

#### Acceptance Criteria

1. WHEN an authenticated User accesses the My Events page, THE CampusEvents System SHALL display all Events where the createdBy field matches the User's ID
2. THE CampusEvents System SHALL display each Event with options to edit or delete
3. THE CampusEvents System SHALL require a valid JWT token to access the My Events page
4. THE CampusEvents System SHALL sort the User's Events by creation date in descending order
5. WHEN the User has no created Events, THE CampusEvents System SHALL display a message indicating no events exist

### Requirement 11

**User Story:** As a logged-in student, I want to view all events I have registered for, so that I can keep track of events I plan to attend

#### Acceptance Criteria

1. WHEN an authenticated User accesses the My Registrations page, THE CampusEvents System SHALL display all Events linked through Registration records for that User
2. THE CampusEvents System SHALL display each registered Event with its details including title, date, time, and venue
3. THE CampusEvents System SHALL require a valid JWT token to access the My Registrations page
4. THE CampusEvents System SHALL provide an option to cancel registration for each Event
5. WHEN the User has no registrations, THE CampusEvents System SHALL display a message indicating no registrations exist

### Requirement 12

**User Story:** As a logged-in student, I want to view and update my profile information, so that I can keep my account details current

#### Acceptance Criteria

1. WHEN an authenticated User accesses the Profile page, THE CampusEvents System SHALL display the User's name and email
2. THE CampusEvents System SHALL allow the User to update their name and email
3. THE CampusEvents System SHALL require a valid JWT token to access the Profile page
4. WHEN a User updates their profile, THE CampusEvents System SHALL validate the new information before saving
5. THE CampusEvents System SHALL update the User's timestamp when profile modifications are saved

### Requirement 13

**User Story:** As any visitor, I want to view information about the CampusEvents project, so that I can understand the purpose and features of the platform

#### Acceptance Criteria

1. THE CampusEvents System SHALL display an About Project page without requiring authentication
2. THE CampusEvents System SHALL include information about the project's purpose, features, and technology stack on the About Project page
3. THE CampusEvents System SHALL provide navigation to the About Project page from the main navigation menu
4. THE CampusEvents System SHALL display the MEAN stack technologies used in the project
5. THE CampusEvents System SHALL include contact or support information on the About Project page

### Requirement 14

**User Story:** As a developer, I want the backend to expose RESTful APIs with proper HTTP methods, so that the frontend can perform all necessary operations

#### Acceptance Criteria

1. THE CampusEvents System SHALL provide RESTful API endpoints for all CRUD operations on Events
2. THE CampusEvents System SHALL provide RESTful API endpoints for user authentication (register and login)
3. THE CampusEvents System SHALL provide RESTful API endpoints for Registration management (create and delete)
4. THE CampusEvents System SHALL use appropriate HTTP methods (GET, POST, PUT, DELETE) for each operation
5. THE CampusEvents System SHALL return appropriate HTTP status codes for success and error responses

### Requirement 15

**User Story:** As a developer, I want protected routes to require valid JWT tokens, so that only authenticated users can access restricted functionality

#### Acceptance Criteria

1. WHEN a request is made to a protected API endpoint without a JWT token, THE CampusEvents System SHALL reject the request and return an authentication error
2. WHEN a request is made to a protected API endpoint with an invalid or expired JWT token, THE CampusEvents System SHALL reject the request and return an authentication error
3. THE CampusEvents System SHALL validate the JWT token signature before processing protected requests
4. THE CampusEvents System SHALL extract the User ID from the validated JWT token for authorization checks
5. THE CampusEvents System SHALL protect all endpoints for creating, editing, deleting Events and managing Registrations

### Requirement 16

**User Story:** As a system administrator, I want the database to maintain referential integrity, so that data relationships remain consistent

#### Acceptance Criteria

1. THE CampusEvents System SHALL store User references in the Events collection using the User's ID
2. THE CampusEvents System SHALL store Event and User references in the Registrations collection using their respective IDs
3. WHEN an Event is deleted, THE CampusEvents System SHALL remove all associated Registration records
4. THE CampusEvents System SHALL validate that referenced Users and Events exist before creating Registration records
5. THE CampusEvents System SHALL use MongoDB ObjectId format for all reference fields
