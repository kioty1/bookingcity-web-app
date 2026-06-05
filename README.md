# BookingCity Web App

BookingCity is a web application for browsing, creating, managing and booking accommodation listings.
The project includes user authentication, role-based access, property management, image upload, booking requests and an admin panel.

## Project Overview

The application allows users to browse available stays, search listings by city and view detailed information about each property.

Registered users can create their own listings, edit them, upload photos and manage their bookings.
Property owners can manage booking requests for their own listings.
Administrators can manage users, property statuses and all bookings in the system.

## Main Features

* User registration and login
* Role-based navigation and access control
* Public property listing page
* Search by city
* Property details page
* Image carousel for property photos
* Add new listing
* Edit existing listing
* Upload and delete property images
* Listing status system:

  * active
  * pending
  * blocked
* Booking system with start and end dates
* My bookings page for clients
* Booking requests page for property owners
* All bookings page for administrators
* Admin panel for managing users and property statuses
* Status filtering for listings and bookings

## User Roles

### Client

A client can:

* browse active listings
* view listing details
* create booking requests
* view their own bookings
* cancel their own bookings

### Owner

An owner can:

* create property listings
* edit their own listings
* manage their own listings
* view booking requests for their listings
* confirm or cancel booking requests

### Administrator

An administrator can:

* access the admin panel
* manage property statuses
* view all users and their properties
* view all bookings
* confirm or cancel booking requests
* create and manage listings

## Technologies Used

### Frontend

* React
* TypeScript
* Vite
* CSS
* Fetch API

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* JWT authentication
* bcrypt password hashing
* multer for image upload

### Database

* Microsoft SQL Server

## Project Structure

```text
bookingcity-web-app
├── backend
│   ├── prisma
│   ├── src
│   │   ├── middleware
│   │   ├── routes
│   │   ├── prisma.ts
│   │   └── server.ts
│   ├── uploads
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── auth
│   │   ├── components
│   │   ├── enums
│   │   ├── pages
│   │   ├── styles
│   │   ├── types
│   │   └── App.tsx
│   └── package.json
│
└── README.md
```



## Validation and Security

The project includes both frontend and backend validation.

Frontend validation checks:

- required name, email and password fields
- email format using a regular expression
- minimum password length

Backend validation checks:

- required registration and login fields
- email format using a regular expression
- minimum password length
- duplicate email registration

Passwords are not stored as plain text.  
Before saving a user to the database, the backend hashes the password using bcrypt.

Authentication is implemented using JWT.  
After successful login, the token is stored in an HTTP-only cookie.

Security-related technologies:

- Regular expressions for email validation
- bcrypt for password hashing
- JWT for authentication

## Prerequisites

Before running the project, make sure the following software and access are available:

* Node.js 18 or newer
* npm
* Git
* Access to Microsoft SQL Server database
* Valid database username and password
* University VPN connection, if the database server is not available from the current network

Check Node.js and npm versions:

```bash
node --version
npm --version
```

The backend and frontend must be started in two separate terminals.


## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/kioty1/bookingcity-web-app.git
cd bookingcity-web-app
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=3000
DATABASE_URL="sqlserver://mail.vk.edu.ee:1433;database=db_BookingCity;schema=dbo;user=YOUR_UNIID;password=YOUR_PASSWORD;encrypt=true;trustServerCertificate=true"
JWT_SECRET="your_secret_key"
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Start backend server

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

### 6. Install frontend dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 7. Start frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:8080
```

## Important API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Properties

```text
GET    /api/properties
GET    /api/properties/:id
POST   /api/properties
PUT    /api/properties/:id
PATCH  /api/properties/admin/:id/status
DELETE /api/properties/:id
DELETE /api/properties/images/:imageId
```

### Bookings

```text
GET /api/bookings
GET /api/bookings/my
GET /api/bookings/owner
POST /api/bookings
PUT /api/bookings/:id/status
```

## Booking Flow

1. A user opens a property details page.
2. The user selects a start date and an end date.
3. The system creates a booking request with pending status.
4. The property owner can confirm or cancel the request.
5. The client can see the booking status in My bookings.
6. The administrator can view and manage all bookings.

## Listing Flow

1. A logged-in user creates a new listing.
2. The listing is created with pending status.
3. The administrator reviews the listing.
4. The administrator can set the listing as active, pending or blocked.
5. Only active listings are shown on the public home page.

## Test Users

Example test users can be used for development:

```text
admin@example.com
maria@example.com
ivan@example.com
testklient@example.com
```

Test password:

```text
Password123!
```

## Notes

* The `.env` file must not be committed to GitHub.
* Uploaded images are stored in the backend `uploads` folder.
* Old test users without passwords must have a valid bcrypt password hash before login.
* Only active properties are visible on the main listing page.

## AI Usage

AI was used for the following purposes:

* explaining TypeScript, React and Express errors
* suggesting possible frontend and backend structure
* generating example code snippets for pages, routes and components
* helping with Prisma and SQL Server related errors
* improving form validation and user interface logic
* describing role-based functionality and project workflows

Example prompts used during development:

```text
How can I add multiple image upload to a React form and show image previews?
```

```text
Why does my React button not open the details page when property id is 0?
```

```text
How can I create a property details page in React and load data from an Express backend?
```

```text
How can I send FormData with images from React to an Express backend using multer?
```

```text
How can I update a listing and automatically change its status back to pending?
```

```text
How can I create a booking system with start date and end date validation?
```

```text
How can I allow a property owner to confirm or cancel booking requests?
```

```text
How can I add role-based navigation for client, owner and administrator users?
```

```text
How can I filter listings and bookings by status in React?
```



## Author
Maksim Ljubimov
