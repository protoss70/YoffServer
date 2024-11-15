import ScheduledClass from "../models/ScheduleClass";
import { GMTOffset } from "./types";
import { Types } from "mongoose";

// Function to get the day of the week from a Date object
export function getDay(date: Date): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay(); // getDay() returns an index from 0 (Sunday) to 6 (Saturday)
    return daysOfWeek[dayIndex];
}

export function getIsoString(date: string): string {
    const dateObject = new Date(date);
    return dateObject.toISOString();
}

export function isValidDate(dateString: string): boolean {
    return !isNaN(Date.parse(dateString));
  }

// Function to get all the classes that are scheduled within the next 3 weeks for a specific teacher
export async function getNext3WeeksOccupiedClasses(teacherId: Types.ObjectId): Promise<any[]> {
  // Get the current UTC date and time
  const today = new Date();
  
  // Get the date 3 weeks later in UTC
  const threeWeeksLater = new Date(today);
  threeWeeksLater.setDate(today.getUTCDate() + 21); // Set the date 3 weeks later
  
  // Set the time portion to the start of the day (00:00:00 UTC) for accurate comparison
  today.setUTCHours(0, 0, 0, 0);
  threeWeeksLater.setUTCHours(23, 59, 59, 999); // Set time to end of the day (23:59:59 UTC)
  
  // Fetch scheduled classes for the teacher within the next 3 weeks based on the `date` field
  const occupiedClasses = await ScheduledClass.find(
    {
      teacher: teacherId,
      date: {
        $gte: today,
        $lte: threeWeeksLater,
      },
    },
    { date: 1, _id: 0 } // Project only the `date` field
  );

  return occupiedClasses; // Return the array of occupied classes within the next 3 weeks
}

// Function to get all dates for the schedule over the next 3 weeks
export function getNext3WeeksDates(
    schedule: { day: string, hours: string[] }[],
    timezone: GMTOffset
  ): string[] {
    const result: string[] = [];
    const timezoneOffset = parseInt(timezone.slice(4), 10); // Extract offset in hours from "GMT+X"
  
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

  export function processRequestDate(isoDate: string): Date {
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

  export const isValidGMTOffset = (timezone: string): timezone is GMTOffset => {
    const validOffsets: GMTOffset[] = [
      "GMT+0", "GMT+1", "GMT+2", "GMT+3", "GMT+4", "GMT+5", "GMT+6", "GMT+7",
      "GMT+8", "GMT+9", "GMT+10", "GMT+11", "GMT+12", "GMT+13", "GMT+14"
    ];
    return validOffsets.includes(timezone as GMTOffset);
  };