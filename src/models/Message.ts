import mongoose, { Schema, Document } from "mongoose";

// Define the interface for TypeScript
interface IMessage extends Document {
  senderMail: string;
  senderFullName: string;
  senderId?: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  message: string;
  sentAt: Date;
}

// Define the schema
const MessageSchema: Schema = new Schema<IMessage>({
  senderMail: { type: String, required: true },
  senderFullName: { type: String, required: true },
  senderId: { type: mongoose.Types.ObjectId, ref: "User", required: false },
  receiverId: { type: mongoose.Types.ObjectId, ref: "Teacher", required: false },
  message: { type: String, required: true },
  sentAt: { type: Date, required: true, default: Date.now },
});

// Create the model
const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
