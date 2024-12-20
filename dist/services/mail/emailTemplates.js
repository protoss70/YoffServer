"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmClassToUser = confirmClassToUser;
exports.confirmClassToTeacher = confirmClassToTeacher;
exports.confirmClassCancellationToTeacher = confirmClassCancellationToTeacher;
exports.confirmClassCancellationToStudent = confirmClassCancellationToStudent;
exports.sendMessageToTeacher = sendMessageToTeacher;
exports.confirmPaymentReceived = confirmPaymentReceived;
exports.paymentAwaitingProcessing = paymentAwaitingProcessing;
exports.sendVerificationEmail = sendVerificationEmail;
const mailer_1 = require("./mailer");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function adjustTimezone(dateString, gmtOffset) {
    const date = new Date(dateString); // Parse the ISO string to a Date object
    const offsetInHours = parseInt(gmtOffset.replace("GMT", ""), 10); // Convert GMT offset to number
    // Adjust the date by adding/subtracting the offset in hours
    date.setUTCHours(date.getUTCHours() + offsetInHours); // Work in UTC time directly
    return date;
}
function formatDateTime(dateString, gmtOffset) {
    const date = adjustTimezone(dateString, gmtOffset); // Adjust date based on GMT offset
    // Extract parts from the adjusted Date object
    const day = String(date.getUTCDate()).padStart(2, '0'); // Get the day in UTC and pad with leading zero if needed
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get the month in UTC (0-based, so add 1)
    const year = date.getUTCFullYear(); // Get the full year in UTC
    const hours = String(date.getUTCHours()).padStart(2, '0'); // Get the hours in UTC and pad with leading zero if needed
    const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Get the minutes in UTC and pad with leading zero if needed
    // Return the formatted date and time
    return {
        formattedDate: `${day}/${month}/${year}`,
        formattedTime: `${hours}:${minutes}`,
    };
}
async function confirmClassToUser(params) {
    const { email, name, language, teacherFullname, date, timezone, userLocale } = params;
    const transport = await (0, mailer_1.createTransport)();
    const _userLocale = ["en", "tr"].includes(userLocale) ? userLocale : "en";
    const { formattedDate, formattedTime } = formatDateTime(date, timezone);
    const emailTemplatePath = path_1.default.join(__dirname, `./templates/user_class_confirmation/confirmation_email_user_${_userLocale}.html`);
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf8');
    const htmlContent = emailTemplate
        .replace('{{name}}', name || '')
        .replace('{{language}}', language || 'English')
        .replace('{{teacher}}', teacherFullname)
        .replace('{{date}}', formattedDate)
        .replace('{{time}}', formattedTime);
    const mailOptions = {
        from: '"Yoff Academy" <no-reply@yoff.academy>',
        to: email,
        subject: `${language} Class Confirmation at ${formattedDate}`,
        html: htmlContent,
    };
    try {
        await transport.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
async function confirmClassToTeacher(params) {
    const { email, studentFullname, studentEmail, language, teacherFullname, date, timezone } = params;
    const transport = await (0, mailer_1.createTransport)();
    const { formattedDate, formattedTime } = formatDateTime(date, timezone);
    const emailTemplatePath = path_1.default.join(__dirname, './templates/teacher_class_confirmation.html');
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf8');
    const htmlContent = emailTemplate
        .replace('{{teacherName}}', teacherFullname)
        .replace('{{studentFullname}}', studentFullname)
        .replace(/{{studentEmail}}/g, studentEmail)
        .replace('{{language}}', language || 'English')
        .replace('{{date}}', formattedDate)
        .replace('{{time}}', formattedTime);
    const mailOptions = {
        from: '"Yoff Academy" <no-reply@yoff.academy>',
        to: email,
        subject: `New ${language} Class with ${studentFullname} on ${formattedDate}`,
        html: htmlContent,
    };
    try {
        await transport.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
async function confirmClassCancellationToTeacher(params) {
    const { email, studentFullname, studentEmail, language, teacherFullname, date, timezone } = params;
    const transport = await (0, mailer_1.createTransport)();
    const { formattedDate, formattedTime } = formatDateTime(date, timezone);
    const emailTemplatePath = path_1.default.join(__dirname, './templates/class_canceled_teacher.html');
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf8');
    let htmlContent = emailTemplate
        .replace(/{{teacherName}}/g, teacherFullname)
        .replace(/{{studentFullname}}/g, studentFullname)
        .replace(/{{studentEmail}}/g, studentEmail)
        .replace(/{{language}}/g, language || 'English')
        .replace(/{{date}}/g, formattedDate)
        .replace(/{{time}}/g, formattedTime);
    const mailOptions = {
        from: '"Yoff Academy" <no-reply@yoff.academy>',
        to: email,
        subject: `Class Cancellation: ${studentFullname} on ${formattedDate}`,
        html: htmlContent,
    };
    try {
        await transport.sendMail(mailOptions);
        console.log(`Cancellation email sent to ${email}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
async function confirmClassCancellationToStudent(params) {
    const { email, studentFullname, teacherFullname, language, studentEmail, date, timezone, userLocale } = params;
    const transport = await (0, mailer_1.createTransport)();
    const _userLocale = ["en", "tr"].includes(userLocale) ? userLocale : "en";
    const { formattedDate, formattedTime } = formatDateTime(date, timezone);
    const emailTemplatePath = path_1.default.join(__dirname, `./templates/user_class_cancellation/class_canceled_user_${_userLocale}.html`);
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf8');
    let htmlContent = emailTemplate
        .replace(/{{studentFullname}}/g, studentFullname)
        .replace(/{{teacherName}}/g, teacherFullname)
        .replace(/{{studentEmail}}/g, studentEmail)
        .replace(/{{date}}/g, formattedDate)
        .replace(/{{time}}/g, formattedTime);
    const mailOptions = {
        from: '"Yoff Academy" <no-reply@yoff.academy>',
        to: email,
        subject: `${language} Class Cancellation on ${formattedDate}`,
        html: htmlContent,
    };
    try {
        await transport.sendMail(mailOptions);
        console.log(`Cancellation email sent to ${email}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
async function sendMessageToTeacher(params) {
    const { email, studentFullname, studentEmail, studentMessage, teacherFullname } = params;
    const transport = await (0, mailer_1.createTransport)();
    const emailTemplatePath = path_1.default.join(__dirname, './templates/student_message_to_teacher.html');
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf8');
    let htmlContent = emailTemplate
        .replace(/{{teacherName}}/g, teacherFullname)
        .replace(/{{userName}}/g, studentFullname)
        .replace(/{{userEmail}}/g, studentEmail)
        .replace(/{{userMessage}}/g, studentMessage);
    const mailOptions = {
        from: '"Yoff Academy" <no-reply@yoff.academy>',
        to: email,
        subject: `Message from student: ${studentFullname}`,
        html: htmlContent,
    };
    try {
        await transport.sendMail(mailOptions);
        console.log(`Message email sent to ${email}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
async function confirmPaymentReceived(params) {
    const { email, studentFullname, paymentAmount, numberOfClasses } = params;
    const transport = await (0, mailer_1.createTransport)();
    // Load the HTML template from the file
    const emailTemplatePath = path_1.default.join(__dirname, './templates/user_payment_confirmation.html');
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf8');
    // Replace placeholders with actual values
    let htmlContent = emailTemplate
        .replace(/{{studentFullname}}/g, studentFullname)
        .replace(/{{paymentAmount}}/g, paymentAmount)
        .replace(/{{numberOfClasses}}/g, numberOfClasses.toString());
    const mailOptions = {
        from: '"Yoff Academy" <no-reply@yoff.academy>',
        to: email,
        subject: `Payment Confirmation - ${paymentAmount} for ${numberOfClasses} Classes`,
        html: htmlContent, // Use the dynamically created HTML content
    };
    try {
        await transport.sendMail(mailOptions);
        console.log(`Payment confirmation email sent to ${email}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
async function paymentAwaitingProcessing(params) {
    const { studentFullName, studentEmail, plan } = params;
    const transport = await (0, mailer_1.createTransport)();
    // Load the HTML template from the file
    const emailTemplatePath = path_1.default.join(__dirname, './templates/payment_process_request.html');
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf8');
    // Replace placeholders with actual values
    let htmlContent = emailTemplate
        .replace(/{{userFullName}}/g, studentFullName)
        .replace(/{{userEmail}}/g, studentEmail)
        .replace(/{{plan}}/g, plan);
    const mailOptions = {
        from: '"Yoff Academy" <no-reply@yoff.academy>',
        to: 'gokdenizk.be@gmail.com', // Partner's email address
        subject: `Payment Awaiting Processing for ${studentFullName}`,
        html: htmlContent, // Use the dynamically created HTML content
    };
    try {
        await transport.sendMail(mailOptions);
        console.log(`Payment awaiting confirmation email sent to Caner`);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
async function sendVerificationEmail(params) {
    const { email, fullName, verificationCode, userLocale } = params;
    // Create email transport
    const transport = await (0, mailer_1.createTransport)();
    // Determine the user's locale (default to 'en' if not valid)
    const _userLocale = ["en", "tr"].includes(userLocale) ? userLocale : "en";
    // Path to the email template
    const emailTemplatePath = path_1.default.join(__dirname, `./templates/user_verification_email/user_verification_email_${_userLocale}.html`);
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf8');
    // Replace template placeholders with actual data
    const htmlContent = emailTemplate
        .replace('{{fullName}}', fullName || '')
        .replace('{{verificationCode}}', verificationCode);
    // Prepare email options
    const mailOptions = {
        from: '"Yoff Academy" <no-reply@yoff.academy>',
        to: email,
        subject: 'Email Verification for Yoff Academy',
        html: htmlContent,
    };
    try {
        await transport.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
