import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the ScheduledClass interface
export interface IScheduleClass extends Document {
  date: string;
  scheduledAt: Date;
  teacher: Types.ObjectId; // Reference to a teacher's ObjectId
  user: Types.ObjectId;    // Reference to a user's ObjectId
  isCompleted: boolean;
  isDemoClass?: boolean;
}

// Create the ScheduledClass schema
const ScheduleClassSchema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher', // Model name for the Teacher schema
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Model name for the User schema
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  language: {
    type: String,
    required: true
  },
  isDemoClass: {
    type: Boolean,
    required: false,
    default: false
  }
});

// Create the ScheduledClass model
const ScheduledClass = mongoose.model<IScheduleClass>('ScheduledClass', ScheduleClassSchema);

export default ScheduledClass;
