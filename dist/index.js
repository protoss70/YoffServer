"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import cors middleware
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const scheduleClassRoutes_1 = __importDefault(require("./routes/scheduleClassRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const teacherRoutes_1 = __importDefault(require("./routes/teacherRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const isAuth_1 = require("./middleware/isAuth");
const checkUserMatch_1 = require("./middleware/checkUserMatch");
const db_1 = __importDefault(require("./database/db")); // Import your connectDB function
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: ['https://yoff.academy', 'http://localhost:5173'], // Allow these origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow credentials
};
// Enable CORS with specified options
app.use((0, cors_1.default)(corsOptions));
// Middleware to parse JSON
app.use(express_1.default.json());
// Default route for "/"
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to my TypeScript REST API' });
});
// Use user routes
app.use('/api/users', isAuth_1.isAuth, userRoutes_1.default);
// Use scheduled class routes
app.use('/api/scheduleClasses', isAuth_1.isAuth, checkUserMatch_1.checkUserMatch, scheduleClassRoutes_1.default);
// Use payment routes
app.use('/api/payments', paymentRoutes_1.default);
// Teacher routes without auth
app.use('/api/teachers', teacherRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next(); // Call next to proceed to the next middleware or route
});
// Custom Error-Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error message:', err.message); // Log error message
    console.error('Stack trace:', err.stack); // Log stack trace
    res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
});
if (process.env.ENVIRONMENT === "DEVELOPMENT") {
    // Teacher routes without auth
    app.use('/api/test', testRoutes_1.default);
}
// Connect to the database and then start the server
const PORT = process.env.PORT || 3000;
console.log('Attempting database connection');
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Port:', process.env.PORT);
(0, db_1.default)().then(() => {
    console.log('Database connection established');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to start the server:', error);
});
