# IETQ Platform Architecture

## Overview

IETQ (International Educational Testing and Qualifications) is a comprehensive educational platform that provides courses, competitions, quizzes, and certificates for students. The platform supports three distinct user roles:

- **Students**: Can access courses, participate in competitions, take quizzes, and earn certificates
- **Teachers**: Can create and manage courses, competitions, and quizzes
- **Administrators**: Can manage users, content, and certificates across the platform

The application is built as a full-stack JavaScript/TypeScript application with a React frontend and Node.js/Express backend, using PostgreSQL for data storage.

## System Architecture

The system follows a modern client-server architecture with the following components:

### Frontend

- Single-page application (SPA) built with React
- Type-safe using TypeScript
- UI components from Radix UI with Shadcn/UI styling
- Client-side routing with Wouter
- State management and data fetching with TanStack Query (React Query)
- Styling with Tailwind CSS
- Animation using GSAP (GreenSock Animation Platform)

### Backend

- Node.js/Express server for API endpoints
- TypeScript for type safety
- API routes organized by user roles (student, teacher, admin)
- Authentication handled via Supabase
- Vite for development server and frontend bundling

### Database

- PostgreSQL database (via Neon Database's serverless offering)
- Drizzle ORM for type-safe database operations
- Schema defined in TypeScript with enums, tables, and relations

### Authentication & Authorization

- Supabase for authentication services
- Role-based access control (RBAC) for different user types
- JWT-based session management

## Key Components

### Database Schema

The database schema includes the following key entities:

1. **Users**: Core user data with role-based permissions
2. **Courses**: Educational content created by teachers
3. **Course Contents**: Individual components of a course
4. **Competitions**: Competitive events for students
5. **Quizzes**: Assessments with either scheduled or anytime availability
6. **Certificates**: Achievements earned by students

The schema uses PostgreSQL-specific features like enums for strongly typed fields like user roles, approval statuses, and content types.

### Frontend Structure

1. **Routing**: Path-based routing with role-specific routes
2. **Components**:
   - UI components (Shadcn/UI + Radix UI)
   - Layout components (Navbar, Sidebar, Footer)
   - Page-specific components
   - Role-specific dashboards
3. **State Management**:
   - TanStack Query for remote state
   - React hooks for local state
4. **Styling**:
   - Tailwind CSS with custom theme variables
   - Dark mode support
   - Custom animations with GSAP

### Backend Structure

1. **API Routes**: Organized by user role and functionality
2. **Middleware**: Authentication, logging, error handling
3. **Database Access**: Centralized through Drizzle ORM
4. **Services**: Business logic separated from route handlers

### Builder.io Integration

The platform integrates with Builder.io for visual content management, allowing:
- Visual editing of certain UI components
- Dynamic content loading
- Role-based content targeting

## Data Flow

### Authentication Flow

1. User registers/logs in through the frontend UI
2. Authentication request is sent to Supabase
3. Upon success, Supabase returns a JWT token
4. Token is stored and included in subsequent API requests
5. Backend middleware validates the token and retrieves user information
6. User is directed to their role-specific dashboard

### Content Access Flow

1. User navigates to content section (courses, competitions, quizzes)
2. Frontend requests data from the appropriate API endpoint
3. Backend validates the request and user permissions
4. Data is retrieved from the database through Drizzle ORM
5. Response is sent back to the frontend
6. TanStack Query caches the data and manages stale states
7. UI is rendered with the retrieved data

### Content Creation Flow (Teachers/Admins)

1. Teacher/Admin creates new content via the UI
2. Data is validated on the client-side with zod schemas
3. Request is sent to the appropriate API endpoint
4. Backend validates the request, permissions, and data
5. Content is stored in the database
6. Success/error response is returned to the frontend
7. UI updates to reflect the new state

## External Dependencies

### Core Dependencies

- **React**: Frontend UI library
- **Express**: Backend web framework
- **Drizzle ORM**: Database ORM for PostgreSQL
- **TanStack Query**: Data fetching and caching
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server

### Third-party Services

- **Supabase**: Authentication and user management
- **Neon Database**: Serverless PostgreSQL
- **Builder.io**: Visual content management
- **Recharts**: Charting library for data visualization

## Offline Capabilities

The application includes offline support through:
- IndexedDB for local data storage
- Request queueing when offline
- Data synchronization when connection is restored
- Service Worker for caching and offline access

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Build Process**:
   - Frontend: Bundled with Vite
   - Backend: Transpiled with esbuild
   - Combined into a single deployment package

2. **Runtime Environment**:
   - Node.js server serving both the API and the static frontend assets
   - Environment variables for database connection and service API keys

3. **Scaling**:
   - AutoScale deployment target configured in Replit
   - Handles variable load efficiently

4. **Database**:
   - External PostgreSQL database (Neon)
   - Connected via environment variables
   - Migrations handled through Drizzle Kit

5. **Development Workflow**:
   - Local development with hot reloading
   - Database schema migration tools
   - Seed scripts for development data

## Future Extensibility

The architecture supports extensibility through:

1. **Component-based UI**: New features can be added by composing existing components
2. **API Layering**: Clear separation between routes, controllers, and services
3. **Type-safe Database**: Schema changes are reflected in TypeScript types
4. **Role-based Access**: New user roles or permissions can be added with minimal changes
5. **Builder.io Integration**: Content can be managed by non-technical users