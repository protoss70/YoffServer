"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Teacher_1 = __importDefault(require("../models/Teacher"));
const dates_1 = require("../utility/dates");
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
// GET /teacher/cards - Get random teacher cards
router.get('/cards', async (req, res) => {
    try {
        const count = parseInt(req.query.count, 10) || 1;
        const random = req.query.random === '1' || false; // Check if random query param is 1 or 0
        let teachers;
        if (random) {
            // If random=1, get random teachers
            teachers = await Teacher_1.default.aggregate([
                { $sample: { size: count } },
                {
                    $project: {
                        name: 1,
                        surname: 1,
                        _id: 1,
                        origin: 1,
                        hobbies: 1,
                        languages: 1,
                    },
                },
            ]);
        }
        else {
            // If random=0, return documents in original order
            teachers = await Teacher_1.default.find({})
                .limit(count)
                .select('name surname _id origin hobbies languages');
        }
        res.json(teachers);
    }
    catch (error) {
        console.error('Error fetching teacher cards:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// GET /teacher/:id - Get a teacher by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Find the teacher by ID
        const teacher = await Teacher_1.default.findById(id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        // Get the next 3 weeks of available dates
        const scheduleDates = (0, dates_1.getNext3WeeksDates)(teacher.schedule, teacher.time_zone);
        // Get the next 3 weeks of occupied class dates for the teacher
        const occupiedClassDates = await (0, dates_1.getNext3WeeksOccupiedClasses)(new mongoose_1.Types.ObjectId(id));
        // Include scheduleDates in the response
        const teacherWithSchedule = {
            ...teacher.toObject(),
            scheduleDates,
            occupiedClassDates
        };
        // Send the teacher data along with scheduleDates as a response
        res.json(teacherWithSchedule);
    }
    catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// POST /teacher - Create a new teacher
router.post('/', async (req, res) => {
    try {
        // Extract teacher data from the request body
        const teacherData = req.body;
        // Create a new teacher instance
        const newTeacher = new Teacher_1.default(teacherData);
        // Save the teacher to the database
        await newTeacher.save();
        // Send a success response with the created teacher
        res.status(201).json(newTeacher);
    }
    catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;
