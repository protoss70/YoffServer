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