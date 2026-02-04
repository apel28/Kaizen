import express from 'express';
import cors from 'cors';

import registerRoutes from "./routes/register.route.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/register", registerRoutes);

app.listen(5001, () => {
    console.log("Server started on node 5001");
});