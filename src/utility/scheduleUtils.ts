import { ITeacher } from '../models/Teacher'; // Update the path accordingly
import ScheduledClass from '../models/ScheduleClass';
import { Types } from 'mongoose'; 
import { getDay, getIsoString } from './dates';
import { getNext3WeeksDates } from './dates';

export function isDateInTeacherSchedule(teacher: ITeacher, date: string): boolean {
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
  const teacherScheduleDates = getNext3WeeksDates(teacher.schedule, teacher.time_zone);
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
    if (
      targetDay === scheduleDay &&
      targetMonth === scheduleMonth &&
      targetYear === scheduleYear &&
      targetHour === scheduleHour &&
      targetMinute === scheduleMinute
    ) {
      return true; // Found a match
    }
  }

  return false; // No match found
}

// Function to check if a given ISO string date is available for a teacher
export async function isDateAvailable(teacherId: Types.ObjectId, isoDate: string): Promise<boolean> {
  console.log("is available content", teacherId, isoDate);

  // Convert isoDate to an ISO string if it isn't already
  const dateToCheck = new Date(isoDate).toISOString();

  // Check if there is a scheduled class for the given teacher on the exact date
  const scheduledClass = await ScheduledClass.findOne({
    date: dateToCheck, // Directly compare the ISO string date
    teacher: teacherId,
  });

  // If scheduledClass is null, the date is available
  return scheduledClass === null;
}


// Utility function to check if a teacher teaches a specific language
export function isLanguageTaughtByTeacher(teacher: ITeacher, language: string): boolean {
  return teacher.languages.includes(language);
}