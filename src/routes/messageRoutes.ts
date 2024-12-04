import express, { Request, Response } from "express";
import Message from "../models/Message"; // Adjust path as needed
import { isAuth } from "../middleware/isAuth";
import { checkUserMatch } from "../middleware/checkUserMatch";
import Teacher from "../models/Teacher";
import { sendMessageToTeacher } from "../services/mail/emailTemplates";

const router = express.Router();


router.post("/contact-us", async (req: Request, res: Response) => {
  const { email, fullName, message } = req.body;

  if (!email || !fullName || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newMessage = new Message({
      senderMail: email,
      senderFullName: fullName,
      message,
      sentAt: new Date(),
    });

    await sendMessageToTeacher({
      email: "info@yoff.academy", 
      studentFullname: fullName, 
      studentEmail: email,
      studentMessage: message,
      teacherFullname: "Caner / Deniz"
    })

    await newMessage.save();

    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

router.post(
    "/message-teacher",
    isAuth,
    checkUserMatch,
    async (req: Request, res: Response) => {
      try {
        const { message, teacherID } = req.body;
  
        if (!message || !teacherID) {
          return res.status(400).json({ error: "Message and teacherID are required." });
        }
        
        // Fetch the teacher with the provided teacherID
        const teacher = await Teacher.findById(teacherID);
      
        if (!teacher) {
          return res.status(404).json({ error: "Teacher not found." });
        }

        const userData = res.locals.userData; // Populated by checkUserMatch middleware
        const { email } = res.locals.user; // Populated by isAuth middleware
  
        const newMessage = new Message({
          senderMail: "info@yoff.academy", // From token
          senderFullName: userData.fullName, // From userData
          senderId: userData._id, // User ID from userData
          receiverId: teacherID, // Teacher ID from body
          message,
          sentAt: new Date(),
        });

        await sendMessageToTeacher({
          email: "info@yoff.academy", 
          studentFullname: userData.fullName, 
          studentEmail: email,
          studentMessage: message,
          teacherFullname: `${teacher.name}  ${teacher.surname}`
        })
  
        await newMessage.save();
  
        res.status(201).json({ success: true, message: "Message sent successfully." });
      } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, error: "Failed to send message." });
      }
    }
  );

export default router;