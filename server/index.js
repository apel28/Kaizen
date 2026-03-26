import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import registerRoutes from "./routes/register.route.js"
import authRoutes from "./routes/auth.route.js"
import dashboardRoutes from "./routes/dashboard.route.js"
import profileRoutes from "./routes/profile.route.js"
import appointmentRoutes from "./routes/appointment.route.js"
import experienceRoutes from "./routes/experience.route.js"
import qualificationRoutes from "./routes/qualification.route.js"

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/signup", registerRoutes);
app.use("/api/signin", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/qualification", qualificationRoutes);

app.listen(5001, () => {
    console.log("Server started on node 5001");
});