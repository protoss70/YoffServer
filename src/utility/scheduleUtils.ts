import { ITeacher } from '../models/Teacher'; // Update the path accordingly
import ScheduledClass from '../models/ScheduleClass';
import { Types } from 'mongoose'; 
import { getDay, getIsoString } from './dates';

// Define the interface for the date object
interface IDate {
  day: string;
  hour: string;
  date: string; // dd/mm/yyyy
}

// Function to check if a teacher is available on a given day and hour
export function isValidDate(teacher: ITeacher, date: IDate): boolean {
  // Get the day of the week from the date object
  const dayOfWeek = getDay(new Date(date.date));

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
export async function isDateAvailable(teacherId: Types.ObjectId, date: IDate): Promise<boolean> {
    // Check if there is a scheduled class for the given teacher on the specified day and hour
    console.log("is available content", teacherId, date);

    const scheduledClass = await ScheduledClass.findOne({
      'date.day': date.day,
      'date.hour': date.hour,
      'date.date': getIsoString(date.date), // Check for the actual date
      teacher: teacherId,
    });
    // TODO not working
    console.log("bool", scheduledClass === null);
    console.log('found class', scheduledClass)
    return scheduledClass === null;
  }

// New function to check if a scheduled class exists for a given teacher ID, date, and user ID
export async function doesScheduledClassExists(
    teacherId: Types.ObjectId,
    userId: Types.ObjectId,
    date: IDate
  ): Promise<boolean> {
    const scheduledClass = await ScheduledClass.findOne({
      teacher: teacherId,
      user: userId,
      'date.day': date.day,
      'date.hour': date.hour,
      'date.date': date.date,
    });
  
    // If a scheduled class is found, return true (exists)
    return scheduledClass !== null;
  }
