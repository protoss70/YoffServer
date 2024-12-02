import mongoose, { Document, Schema } from 'mongoose';
import { GMTOffset } from '../utility/types';

// Define the User interface
export interface IUser extends Document {
  email: string;
  credits: number;
  emailVerified: boolean;
  demoClass?: Date; // Optional field
  timezone: GMTOffset;
  fullName?: string; 
}

// Create the User schema
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  credits: {
    type: Number,
    required: true,
    default: 0, // Optional: default credits value
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  demoClass: {
    type: Date,
    required: false, // Optional: can be undefined
  },
  timezone: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: false,
  }
});

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
