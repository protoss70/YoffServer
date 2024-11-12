import mongoose, { Document, Schema } from 'mongoose';
import { GMTOffset } from '../utility/types';

// Define the structure for the schedule
interface ISchedule {
  day: string;
  hours: string[];
}

// Define the Teacher interface
export interface ITeacher extends Document {
  email: string;
  name: string;
  surname: string;
  origin: string;
  hobbies: string[];
  bio: string;
  education: string;
  languages: string[];
  schedule: ISchedule[];
  time_zone: GMTOffset;
}

// Create the Teacher schema
const TeacherSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
  },
  origin: {
    type: String,
    required: true,
    trim: true,
  },
  hobbies: {
    type: [String],
    required: false,
  },
  bio: {
    type: String,
    required: true,
    trim: true,
  },
  education: {
    type: String,
    required: true,
    trim: true,
  },
  languages: {
    type: [String],
    required: false,
  },
  schedule: {
    type: [
      {
        day: { type: String, required: true },
        hours: { type: [String], required: true },
      },
    ],
    required: false,
    default: [],
  },
  time_zone: {
    type: String,
    required: false,
    default: "GMT+3"
  }
});

// Create the Teacher model
const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);

export default Teacher;
