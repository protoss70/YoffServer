import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the Payment interface
export interface IPayment extends Document {
  user: Types.ObjectId;    // Reference to the user who made the payment
  paymentDate: Date;       // Date when the payment was made
  amount: number;          // Amount of the payment
  isPaid: boolean;         // Indicates if the payment has been made
}

// Create the Payment schema
const PaymentSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now, // Automatically set to the current date if not provided
  },
  amount: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false, // Default to false
  },
});

// Create the Payment model
const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;