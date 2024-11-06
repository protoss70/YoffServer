"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDay = getDay;
exports.getIsoString = getIsoString;
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
