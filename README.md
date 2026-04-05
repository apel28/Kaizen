## Kaizen - Hospital Management System

A full-stack hospital management system built with React (front-end), Node.js/Express (back-end), and PostgreSQL (database).

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm

## Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Kaizen
   ```

2. **Database Setup:**
   - Install PostgreSQL and create a database
   - Run the SQL scripts in `server/Database/` to set up tables
   - Update `server/db.js` with your database credentials

3. **Back-end Setup:**
   ```bash
   cd server
   npm install
   # Create .env file with required variables (e.g., GEMINI_API_KEY, ADMIN_REGISTER_SECRET, DB credentials)
   npm start
   ```

4. **Front-end Setup:**
   ```bash
   cd ../front_end
   npm install
   # For local development:
   npm run dev
   ```


