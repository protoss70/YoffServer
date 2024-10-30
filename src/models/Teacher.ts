import mongoose, { Document, Schema } from 'mongoose';

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
});

// Create the Teacher model
const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);

export default Teacher;
