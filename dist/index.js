"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import cors middleware
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const scheduleClassRoute_1 = __importDefault(require("./routes/scheduleClassRoute"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const teacherRoute_1 = __importDefault(require("./routes/teacherRoute"));
const isAuth_1 = require("./middleware/isAuth");
const checkUserMatch_1 = require("./middleware/checkUserMatch");
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: ['https://yoff.academy', 'http://localhost:8080'], // Allow these origins
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
app.use('/api/scheduledClasses', isAuth_1.isAuth, checkUserMatch_1.checkUserMatch, scheduleClassRoute_1.default);
// Use payment routes
app.use('/api/payments', isAuth_1.isAuth, checkUserMatch_1.checkUserMatch, paymentRoutes_1.default);
// Teacher routes without auth
app.use('/api/teacher', teacherRoute_1.default);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
