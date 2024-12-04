"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Message_1 = __importDefault(require("../models/Message")); // Adjust path as needed
const isAuth_1 = require("../middleware/isAuth");
const checkUserMatch_1 = require("../middleware/checkUserMatch");
const Teacher_1 = __importDefault(require("../models/Teacher"));
const emailTemplates_1 = require("../services/mail/emailTemplates");
const router = express_1.default.Router();
router.post("/contact-us", async (req, res) => {
    const { email, fullName, message } = req.body;
    if (!email || !fullName || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const newMessage = new Message_1.default({
            senderMail: email,
            senderFullName: fullName,
            message,
            sentAt: new Date(),
        });
        await (0, emailTemplates_1.sendMessageToTeacher)({
            email: "info@yoff.academy",
            studentFullname: fullName,
            studentEmail: email,
            studentMessage: message,
            teacherFullname: "Caner / Deniz"
        });
        await newMessage.save();
        res.status(201).json({ success: true, message: "Message sent successfully" });
    }
    catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ success: false, error: "Failed to send message" });
    }
});
router.post("/message-teacher", isAuth_1.isAuth, checkUserMatch_1.checkUserMatch, async (req, res) => {
    try {
        const { message, teacherID } = req.body;
        if (!message || !teacherID) {
            return res.status(400).json({ error: "Message and teacherID are required." });
        }
        // Fetch the teacher with the provided teacherID
        const teacher = await Teacher_1.default.findById(teacherID);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found." });
        }
        const userData = res.locals.userData; // Populated by checkUserMatch middleware
        const { email } = res.locals.user; // Populated by isAuth middleware
        const newMessage = new Message_1.default({
            senderMail: "info@yoff.academy", // From token
            senderFullName: userData.fullName, // From userData
            senderId: userData._id, // User ID from userData
            receiverId: teacherID, // Teacher ID from body
            message,
            sentAt: new Date(),
        });
        await (0, emailTemplates_1.sendMessageToTeacher)({
            email: "info@yoff.academy",
            studentFullname: userData.fullName,
            studentEmail: email,
            studentMessage: message,
            teacherFullname: `${teacher.name}  ${teacher.surname}`
        });
        await newMessage.save();
        res.status(201).json({ success: true, message: "Message sent successfully." });
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, error: "Failed to send message." });
    }
});
exports.default = router;
