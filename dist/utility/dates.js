"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidGMTOffset = void 0;
exports.getDay = getDay;
exports.getIsoString = getIsoString;
exports.isValidDate = isValidDate;
exports.getNext3WeeksDates = getNext3WeeksDates;
exports.processRequestDate = processRequestDate;
// Function to get the day of the week from a Date object
function getDay(date) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay(); // getDay() returns an index from 0 (Sunday) to 6 (Saturday)
    return daysOfWeek[dayIndex];
}
function getIsoString(date) {
    const dateObject = new Date(date);
    return dateObject.toISOString();
}
function isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
}
// Function to get all dates for the schedule over the next 3 weeks
function getNext3WeeksDates(schedule, timezone) {
    const result = [];
    const timezoneOffset = parseInt(timezone.slice(4), 10); // Extract offset in hours from "GMT+X"
    console.log("teacher zone", timezone);
    schedule.forEach((entry) => {
        const targetDayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(entry.day);
        const currentDate = new Date();
        // Find the first target day that matches the specified day of the week
        currentDate.setUTCDate(currentDate.getUTCDate() + ((targetDayIndex - currentDate.getUTCDay() + 7) % 7));
        currentDate.setUTCHours(0, 0, 0, 0); // Reset to midnight UTC
        // Loop over the next 3 weeks
        for (let week = 0; week < 3; week++) {
            entry.hours.forEach((hour) => {
                const [hours, minutes] = hour.split(':').map(Number);
                const date = new Date(currentDate);
                date.setUTCDate(date.getUTCDate() + week * 7); // Move to the correct week
                date.setUTCHours(hours - timezoneOffset, minutes, 0, 0); // Set hour in UTC accounting for the timezone offset
                date.setSeconds(0, 0);
                result.push(date.toISOString());
            });
        }
    });
    return result;
}
function processRequestDate(isoDate) {
    // Sets the given date time zone to GMT+0 and removes seconds/miliseconds
    // Create a new Date object from the ISO string
    const date = new Date(isoDate);
    // Convert the date to GMT+0 (UTC)
    const gmt0Date = new Date(date.toISOString());
    // Remove seconds and milliseconds
    gmt0Date.setSeconds(0, 0);
    // Return the Date object in GMT+0 (UTC) with time truncated to the minute
    return gmt0Date;
}
const isValidGMTOffset = (timezone) => {
    const validOffsets = [
        "GMT+0", "GMT+1", "GMT+2", "GMT+3", "GMT+4", "GMT+5", "GMT+6", "GMT+7",
        "GMT+8", "GMT+9", "GMT+10", "GMT+11", "GMT+12", "GMT+13", "GMT+14"
    ];
    return validOffsets.includes(timezone);
};
exports.isValidGMTOffset = isValidGMTOffset;
