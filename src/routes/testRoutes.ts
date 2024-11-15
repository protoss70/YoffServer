import express from "express";
import { confirmPaymentReceived, confirmClassCancellationToStudent, confirmClassCancellationToTeacher, confirmClassToTeacher, confirmClassToUser, sendMessageToTeacher, notifyPaymentAwaitingConfirmation } from "../services/mail/emailTemplates"; // Adjust the import based on your actual file structure
import { GMTOffset } from "../utility/types";
import { getNext3WeeksOccupiedClasses } from "../utility/dates";
import mongoose, { Types } from "mongoose";

const router = express.Router();

// GET request to send email
router.get("/send-confirmation", async (req, res) => {
  try {
    // // Email parameters
    // const params = {
    //   email: "gokdenizk.be@gmail.com",
    //   studentFullName: "Deniz Harman Kurum",
    //   studentFullname: "Deniz Harman Kurum",
    //   studentEmail: "harmank@gmail.com",
    //   name: "Gokdeniz",
    //   language: "English",
    //   teacherFullname: "Robb Stark",
    //   teacherName: "Robb Stark",
    //   date: new Date("2024-11-18T23:30:00.000Z").toISOString(),
    //   studentMessage: "I have a couple of questions regarding the language lessons. Could you clarify if the class will cover specific dialects or regional variations of the language? Also, will there be a focus on conversational skills or more on grammar?",
    //   paymentAmount: "400czk",
    //   numberOfClasses: 4,
    //   timezone: "GMT-3" as GMTOffset
    // };

    // // Call the function to send the email
    // await notifyPaymentAwaitingConfirmation(params);

    const response = await getNext3WeeksOccupiedClasses(new mongoose.Types.ObjectId("6731f9d4fbd316df12271690"));
    console.log("response", response);

    // Respond with success message
    res.status(200).send("Confirmation email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});

export default router;
