import "./loadEnv.js";
import app from "./app.js";

// Start server for local development
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});