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

export type GMTOffset = 
  | "GMT+0"
  | "GMT+1"
  | "GMT+2"
  | "GMT+3"
  | "GMT+4"
  | "GMT+5"
  | "GMT+6"
  | "GMT+7"
  | "GMT+8"
  | "GMT+9"
  | "GMT+10"
  | "GMT+11"
  | "GMT+12"
  | "GMT+13"
  | "GMT+14";