# CampusEvents - MEAN Stack Application

A full-stack web application built using the MEAN stack (MongoDB, Express.js, Angular, and Node.js) that enables students to discover campus events, register for events, and create/manage their own events.

## Project Structure

```
campusevents/
├── backend                 # Node.js/Express backend
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware (auth, validation)
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables (not in git)
│   ├── .env.example       # Example environment file
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server entry point
│
└── frontend/              # Angular frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/    # Angular components
    │   │   ├── services/      # HTTP services
    │   │   ├── guards/        # Route guards
    │   │   └── app.routes.ts  # Route configuration
    │   └── environments/      # Environment configs
    ├── angular.json           # Angular CLI config
    └── package.json          # Frontend dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Angular CLI (`npm install -g @angular/cli`)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/campusevents
     JWT_SECRET=your_secure_secret_key
     FRONTEND_URL=http://localhost:4200
     NODE_ENV=development
     ```

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update environment configuration (if needed):
   - Edit `src/environments/environment.ts` for development
   - Edit `src/environments/environment.prod.ts` for production

4. Start the Angular development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)
- `GET /api/events/my-events` - Get user's events (protected)

### Registrations
- `POST /api/registrations` - Register for event (protected)
- `DELETE /api/registrations/:id` - Cancel registration (protected)
- `GET /api/registrations/my-registrations` - Get user's registrations (protected)

## Features

- User authentication with JWT
- Create, edit, and delete events
- Browse and search events
- Register for events
- Personal dashboard
- User profile management
- Role-based access control

## Technology Stack

- **Frontend**: Angular 19, TypeScript, RxJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: express-validator

## Development

- Backend runs on port 5000 with nodemon for auto-reload
- Frontend runs on port 4200 with Angular CLI dev server
- MongoDB runs on default port 27017

## License

ISC
