"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ScheduleClass_1 = __importDefault(require("../models/ScheduleClass")); // Adjust the import path
const router = express_1.default.Router();
// Create a Scheduled Class
router.post('/', async (req, res) => {
    const { date, teacher, user } = req.body;
    try {
        const scheduledClass = await ScheduleClass_1.default.create({
            date,
            teacher,
            user,
        });
        res.status(201).json({
            success: true,
            scheduledClass,
        });
    }
    catch (error) {
        console.error('Error creating scheduled class:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Delete a Scheduled Class
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedClass = await ScheduleClass_1.default.findByIdAndDelete(id);
        if (!deletedClass) {
            return res.status(404).json({ message: 'Scheduled class not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Scheduled class deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting scheduled class:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Update a Scheduled Class
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { date, teacher, user, isCompleted } = req.body;
    try {
        const updatedClass = await ScheduleClass_1.default.findByIdAndUpdate(id, {
            date,
            teacher,
            user,
            isCompleted,
        }, { new: true } // Return the updated document
        );
        if (!updatedClass) {
            return res.status(404).json({ message: 'Scheduled class not found' });
        }
        res.status(200).json({
            success: true,
            updatedClass,
        });
    }
    catch (error) {
        console.error('Error updating scheduled class:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Export the router
exports.default = router;
