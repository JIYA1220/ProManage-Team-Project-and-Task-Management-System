# ProManage: Team Project and Task Management System

ProManage is a full-stack project management solution built on the MERN stack. It enables teams to organize complex projects, distribute workloads through task assignments, and monitor real-time progress through an intuitive Kanban interface and data-driven analytics.

## Core Capabilities

### Project and Team Orchestration
Users can establish dedicated project workspaces with unique titles and descriptions. The system supports multi-member collaboration where project owners can invite team members via email and manage access levels.

### Dynamic Task Lifecycle
Tasks are managed within projects or on a global board. Features include:
*   Priority Categorization: High, Moderate, and Low priority tiers.
*   Interactive Checklists: Granular progress tracking within individual task cards.
*   Status Workflows: Seamless transition between Backlog, To-Do, In-Progress, and Done.
*   Deadline Management: Automatic detection and visual highlighting of overdue items.

### Role-Based Access Control (RBAC)
The application enforces strict yet flexible permission sets:
*   Administrators: Full oversight of project creation, member management, and task distribution.
*   Members: Focused access to assigned projects and tasks with permission to update status and checklists.

### Data Analytics Dashboard
A centralized dashboard provides a quantitative overview of organizational productivity, tracking total task counts, completion rates, and urgency metrics across all active projects.

## Technical Architecture

### Frontend
*   React: Component-based user interface.
*   Redux Toolkit: Centralized state management for authentication and project data.
*   React Router: Client-side navigation and protected routing logic.
*   Vite: High-performance build tooling.

### Backend
*   Node.js and Express.js: Scalable RESTful API architecture.
*   MongoDB and Mongoose: NoSQL document storage with structured schema modeling.
*   JWT (JSON Web Tokens): Secure, stateless authentication mechanism.
*   Bcrypt: Industry-standard password hashing.

## Local Development and Setup

### Prerequisites
*   Node.js (Version 18 or higher)
*   Access to a MongoDB instance (Local or Atlas)

### Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5173
   PORT=3000
   JWT_SECRET=your_secure_secret_key
   ```
4. Initialize the server:
   ```bash
   npm start
   ```

### Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```
4. Start the development environment:
   ```bash
   npm run dev
   ```

## Production Deployment
The application is architected for deployment on cloud platforms such as Railway, Render, or Vercel. Ensure all environment variables are correctly mapped in the production environment settings.

## License
This project is licensed under the MIT License.
