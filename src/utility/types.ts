export type Days = "Monday" | "Tuesday" | "Thursday" | "Wednesday" | "Friday" | "Saturday" | "Sunday";

export type ScheduledClassType = {
    _id: string,
    date: string,
    language: string,
    isDemoClass: boolean,
    teacherDetails: {
      name: string,
      surname: string,
      _id: string
    }
  }