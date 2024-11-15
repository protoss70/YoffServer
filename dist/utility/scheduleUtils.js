"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateInTeacherSchedule = isDateInTeacherSchedule;
exports.isDateAvailable = isDateAvailable;
exports.isLanguageTaughtByTeacher = isLanguageTaughtByTeacher;
const ScheduleClass_1 = __importDefault(require("../models/ScheduleClass"));
const dates_1 = require("./dates");
function isDateInTeacherSchedule(teacher, date) {
    // Convert the provided date to GMT+0 (UTC) and remove seconds and milliseconds
    const dateGMT0 = new Date(date);
    dateGMT0.setSeconds(0, 0);
    // Extract the day, month, year, hour, and minute of the given date
    const targetDay = dateGMT0.getUTCDate();
    const targetMonth = dateGMT0.getUTCMonth();
    const targetYear = dateGMT0.getUTCFullYear();
    const targetHour = dateGMT0.getUTCHours();
    const targetMinute = dateGMT0.getUTCMinutes();
    // Loop through the teacher's schedule and check if the date exists
    const teacherScheduleDates = (0, dates_1.getNext3WeeksDates)(teacher.schedule, teacher.time_zone);
    console.log("teacher schedule", teacherScheduleDates);
    for (const scheduleDateString of teacherScheduleDates) {
        // Convert each schedule date to a Date object and ensure it's in GMT+0
        const scheduleDate = new Date(scheduleDateString);
        scheduleDate.setSeconds(0, 0); // Remove seconds and milliseconds
        // Extract the day, month, year, hour, and minute of the schedule date
        const scheduleDay = scheduleDate.getUTCDate();
        const scheduleMonth = scheduleDate.getUTCMonth();
        const scheduleYear = scheduleDate.getUTCFullYear();
        const scheduleHour = scheduleDate.getUTCHours();
        const scheduleMinute = scheduleDate.getUTCMinutes();
        // Check if the target date matches the schedule date (ignoring seconds and smaller units)
        if (targetDay === scheduleDay &&
            targetMonth === scheduleMonth &&
            targetYear === scheduleYear &&
            targetHour === scheduleHour &&
            targetMinute === scheduleMinute) {
            return true; // Found a match
        }
    }
    return false; // No match found
}
// Function to check if a given ISO string date is available for a teacher
async function isDateAvailable(teacherId, isoDate) {
    console.log("is available content", teacherId, isoDate);
    // Convert isoDate to an ISO string if it isn't already
    const dateToCheck = new Date(isoDate).toISOString();
    // Check if there is a scheduled class for the given teacher on the exact date
    const scheduledClass = await ScheduleClass_1.default.findOne({
        date: dateToCheck, // Directly compare the ISO string date
        teacher: teacherId,
    });
    // If scheduledClass is null, the date is available
    return scheduledClass === null;
}
// Utility function to check if a teacher teaches a specific language
function isLanguageTaughtByTeacher(teacher, language) {
    return teacher.languages.includes(language);
}
