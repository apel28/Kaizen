import "../server/loadEnv.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import registerRoutes from "../server/routes/register.route.js";
import authRoutes from "../server/routes/auth.route.js";
import dashboardRoutes from "../server/routes/dashboard.route.js";
import profileRoutes from "../server/routes/profile.route.js";
import appointmentRoutes from "../server/routes/appointment.route.js";
import experienceRoutes from "../server/routes/experience.route.js";
import qualificationRoutes from "../server/routes/qualification.route.js";
import availabilityRoutes from "../server/routes/availability.route.js";
import prescriptionRoutes from "../server/routes/prescription.route.js";
import patientDataRoutes from "../server/routes/patientData.route.js";
import testOrderRoutes from "../server/routes/testOrder.route.js";
import notificationRoutes from "../server/routes/notification.route.js";
import testReportRoutes from "../server/routes/testReport.route.js";
import adminRoutes from "../server/routes/admin.route.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/signup", registerRoutes);
app.use("/api/signin", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/qualification", qualificationRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/patient-data", patientDataRoutes);
app.use("/api/test-orders", testOrderRoutes);
app.use("/api/test-reports", testReportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("API Error:", error);
  res.status(error.status || 500).json({
    error: error.message || "Internal Server Error",
  });
});

export default app;
