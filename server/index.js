import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import registerRoutes from "./routes/register.route.js"
import authRoutes from "./routes/auth.route.js"
import dashboardRoutes from "./routes/dashboard.route.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/signup", registerRoutes);
app.use("/api/signin", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(5001, () => {
    console.log("Server started on node 5001");
});