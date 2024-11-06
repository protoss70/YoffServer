"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDate = isValidDate;
exports.isDateAvailable = isDateAvailable;
const ScheduleClass_1 = __importDefault(require("../models/ScheduleClass"));
const dates_1 = require("./dates");
// Function to check if a teacher is available on a given day and hour
function isValidDate(teacher, date) {
    // Get the day of the week from the date object
    const dayOfWeek = (0, dates_1.getDay)(new Date(date.date));
    // Check if the day matches
    if (dayOfWeek !== date.day) {
        return false; // The day does not match the actual date
    }
    // Loop through the teacher's schedule to find a matching day and hour
    for (const schedule of teacher.schedule) {
        if (schedule.day === date.day && schedule.hours.includes(date.hour)) {
            return true; // Valid date and hour found
        }
    }
    // If no match is found, return false
    return false;
}
// Function to check if a given date is available for a teacher
async function isDateAvailable(teacherId, date) {
    // Check if there is a scheduled class for the given teacher on the specified day and hour
    console.log("is available content", teacherId, date);
    const scheduledClass = await ScheduleClass_1.default.findOne({
        'date.day': date.day,
        'date.hour': date.hour,
        'date.date': (0, dates_1.getIsoString)(date.date), // Check for the actual date
        teacher: teacherId,
    });
    return scheduledClass === null;
}
