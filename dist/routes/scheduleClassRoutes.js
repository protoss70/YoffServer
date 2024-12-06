"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ScheduleClass_1 = __importDefault(require("../models/ScheduleClass")); // Adjust the import path
const Teacher_1 = __importDefault(require("../models/Teacher"));
const scheduleUtils_1 = require("../utility/scheduleUtils");
const dates_1 = require("../utility/dates");
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const emailTemplates_1 = require("../services/mail/emailTemplates");
const router = express_1.default.Router();
// Create a Scheduled Class
router.post('/', async (req, res) => {
    const { date, teacherId, userId, language, userLocale } = req.body;
    const isDemoClass = req.query.isDemoClass === "true";
    const userData = res.locals.userData;
    try {
        // Check if valid date string
        if (!(0, dates_1.isValidDate)(date)) {
            return res.status(400).json({ success: false, message: 'Invalid date' });
        }
        const _date = (0, dates_1.processRequestDate)(date);
        // Validate ObjectIds
        if (!mongoose_1.default.Types.ObjectId.isValid(teacherId) || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid teacherId or userId' });
        }
        // Fetch teacher data using the teacherId
        const teacherData = await Teacher_1.default.findById(teacherId);
        // Check if the teacher exists
        if (!teacherData) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found',
            });
        }
        if (!(0, scheduleUtils_1.isDateInTeacherSchedule)(teacherData, _date.toString())) {
            return res.status(400).json({
                success: false,
                message: 'The given date does not exist on the teacher schedule',
            });
        }
        if (!(0, scheduleUtils_1.isLanguageTaughtByTeacher)(teacherData, language)) {
            return res.status(400).json({
                success: false,
                message: 'The language provided is not taught by the teacher',
            });
        }
        // Check if the given date is available
        const isAvailable = await (0, scheduleUtils_1.isDateAvailable)(teacherId, date);
        if (!isAvailable) {
            return res.status(409).json({
                success: false,
                message: 'The date is not available',
            });
        }
        if (isDemoClass && userData.demoClass) {
            return res.status(400).json({
                success: false,
                message: 'The user already used their demo class',
            });
        }
        if (!isDemoClass && userData.credits < 1) {
            return res.status(402).json({
                success: false,
                message: 'Insufficent credits',
            });
        }
        // If this is a demo class, update the user's demoClass field to the current date
        if (isDemoClass) {
            await User_1.default.findByIdAndUpdate(userId, {
                demoClass: new Date(), // Set demoClass to current date
            });
        }
        else {
            // Increment the user's credits by 1 if it's not a demo class
            await User_1.default.findByIdAndUpdate(userId, {
                $inc: { credits: -1 }, // Increment the credits field by 1
            });
        }
        // Create the scheduled class if all validations pass
        const newClass = await ScheduleClass_1.default.create({
            date: _date.toISOString(),
            teacher: teacherId, // Ensure to use 'teacher' here
            user: userId, // Ensure to use 'user' here
            isDemoClass: isDemoClass || false,
            language: language,
        });
        // Send emails to confirm class
        await Promise.all([
            (0, emailTemplates_1.confirmClassToTeacher)({
                email: "info@yoff.academy",
                studentFullname: userData.fullName,
                studentEmail: userData.email,
                language: language,
                teacherFullname: `${teacherData.name} ${teacherData.surname}`,
                date: _date.toISOString(),
                timezone: teacherData.time_zone || "GMT+3"
            }),
            (0, emailTemplates_1.confirmClassToUser)({
                email: userData.email,
                name: userData.fullName,
                language: language,
                teacherFullname: `${teacherData.name} ${teacherData.surname}`,
                date: date,
                timezone: userData.timezone,
                userLocale: userLocale || "en"
            })
        ]);
        res.status(201).json({
            success: true,
            newClass,
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
    const { userId, teacherId, userLocale } = req.body; // Destructure userId and teacherId from the request body
    const { id } = req.params; // Get the class ID from the URL parameter
    const userData = res.locals.userData;
    try {
        // Validate ObjectIds
        if (!mongoose_1.default.Types.ObjectId.isValid(teacherId) || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid teacherId or userId' });
        }
        const teacherData = await Teacher_1.default.findById(teacherId);
        if (!teacherData) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        // Find the scheduled class that matches the user and teacher
        const scheduledClass = await ScheduleClass_1.default.findOne({
            _id: id,
            teacher: teacherId,
            user: userId,
        });
        // Check if the class was found
        if (!scheduledClass) {
            return res.status(404).json({ message: 'Scheduled class not found or does not belong to the user' });
        }
        // Check if the class date is in the past
        if ((0, scheduleUtils_1.isClassInThePast)(scheduledClass.date)) {
            return res.status(400).json({ message: 'The class has already been completed and cannot be deleted' });
        }
        // If the class is a demo class, remove the demoClass date from the user
        if (scheduledClass.isDemoClass) {
            await User_1.default.findByIdAndUpdate(userId, {
                $unset: { demoClass: "" }, // Unset the demoClass field
            });
        }
        else {
            // Increment the user's credits by 1 if it's not a demo class
            await User_1.default.findByIdAndUpdate(userId, {
                $inc: { credits: 1 }, // Increment the credits field by 1
            });
        }
        // Delete the scheduled class
        await ScheduleClass_1.default.findByIdAndDelete(id);
        // Send emails to confirm class
        await Promise.all([
            (0, emailTemplates_1.confirmClassCancellationToTeacher)({
                email: "info@yoff.academy",
                studentFullname: userData.fullName,
                studentEmail: userData.email,
                language: scheduledClass.language,
                teacherFullname: `${teacherData.name} ${teacherData.surname}`,
                date: scheduledClass.date.toISOString(),
                timezone: teacherData.time_zone || "GMT+3",
                userLocale: "en"
            }),
            (0, emailTemplates_1.confirmClassCancellationToStudent)({
                email: userData.email,
                studentEmail: userData.email,
                studentFullname: userData.fullName,
                language: scheduledClass.language,
                teacherFullname: `${teacherData.name} ${teacherData.surname}`,
                date: scheduledClass.date.toISOString(),
                timezone: userData.timezone,
                userLocale: userLocale || "en"
            })
        ]);
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
exports.default = router;
// Get all Scheduled Classes for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params; // Get the userId from the URL parameter
    try {
        // Validate userId
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid userId' });
        }
        // Aggregate scheduled classes for the given userId
        const scheduledClasses = await ScheduleClass_1.default.aggregate([
            {
                $match: { user: new mongoose_1.default.Types.ObjectId(userId) }, // Match classes that belong to the user
            },
            {
                $lookup: {
                    from: 'teachers', // Name of the collection to join
                    localField: 'teacher', // Field from the current collection
                    foreignField: '_id', // Field from the teachers collection
                    as: 'teacherDetails', // Alias for the joined data
                },
            },
            {
                $unwind: '$teacherDetails', // Flatten the teacherDetails array
            },
            {
                $project: {
                    _id: 1,
                    date: 1, // Include the full date object
                    language: 1,
                    isDemoClass: 1,
                    'teacherDetails._id': 1,
                    'teacherDetails.name': 1, // Include teacher's name
                    'teacherDetails.surname': 1, // Include teacher's surname
                },
            },
            {
                $sort: { 'date.date': 1 }, // Sort by the date field inside the `date` object in ascending order
            },
        ]);
        // Return the result
        res.status(200).json({
            success: true,
            scheduledClasses,
        });
    }
    catch (error) {
        console.error('Error fetching scheduled classes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
