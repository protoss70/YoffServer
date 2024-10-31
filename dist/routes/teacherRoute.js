"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Teacher_1 = __importDefault(require("../models/Teacher"));
const router = express_1.default.Router();
// GET /teacher/:id - Get a teacher by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Find the teacher by ID
        const teacher = await Teacher_1.default.findById(id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        // Send the teacher data as a response
        res.json(teacher);
    }
    catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// GET /teacher/cards - Get random teacher cards
router.get('/cards', async (req, res) => {
    try {
        const count = parseInt(req.query.count, 10) || 1;
        // Get random teachers based on the specified count
        const teachers = await Teacher_1.default.aggregate([{ $sample: { size: count } }]);
        res.json(teachers);
    }
    catch (error) {
        console.error('Error fetching teacher cards:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;
