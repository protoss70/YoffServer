import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import CORS middleware
import userRoutes from "./routes/userRoutes";
import scheduleClassRoutes from "./routes/scheduleClassRoute";
import paymentRoutes from "./routes/paymentRoutes";
import teacherRoutes from "./routes/teacherRoute";
import { isAuth } from "./middleware/isAuth";
import { checkUserMatch } from "./middleware/checkUserMatch";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: ["https://yoff.academy", "http://localhost:8080"], // Allowed origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Allow credentials
};

// Enable CORS with specified options
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Default route for "/"
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to my TypeScript REST API" });
});

// Use user routes
app.use("/api/users", isAuth, userRoutes);

// Use scheduled class routes
app.use("/api/scheduledClasses", isAuth, checkUserMatch, scheduleClassRoutes);

// Use payment routes
app.use("/api/payments", isAuth, checkUserMatch, paymentRoutes);

// Teacher routes without authentication
app.use("/api/teacher", teacherRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
