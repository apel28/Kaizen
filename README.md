# Kaizen - Hospital Management System

A full-stack hospital management system built with React (front-end), Node.js/Express (back-end), and PostgreSQL (database).

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn
- Cloudflare account (for tunneling, optional)

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
   # For production with Cloudflare tunnel:
   VITE_API_URL=https://your-tunnel-url.com npm run dev
   ```

## Cloudflare Tunneling (Optional)

To expose the back-end securely:

1. Install cloudflared: `brew install cloudflare/cloudflare/cloudflared`
2. Login: `cloudflared tunnel login`
3. Create tunnel: `cloudflared tunnel create kaizen-tunnel`
4. Run tunnel: `cloudflared tunnel run kaizen-tunnel --url http://localhost:5001`
5. Set DNS or use the provided URL in `VITE_API_URL`

## Features

- User authentication (patients, doctors, admins)
- Appointment management
- Medical records and reports
- Billing system
- AI-powered diagnosis notifications

## API Endpoints

- `/api/signin` - User login
- `/api/signup` - User registration
- `/api/dashboard` - User dashboard
- `/api/patient-data/*` - Patient data access
- And more...

## License

ISC