import { createTransport } from './mailer';
import fs from 'fs';
import path from 'path';
import { GMTOffset } from '../../utility/types';

interface ConfirmationStudentEmail {
  email: string;
  name: string;
  language: string;
  teacherFullname: string;
  date: string;  // ISO string format
  timezone: GMTOffset;  // Timezone (e.g., 'Europe/Budapest')
}

interface PaymentConfirmationParams {
  email: string;
  studentFullname: string;
  paymentAmount: string;
  numberOfClasses: number;
  timezone: GMTOffset;  // Timezone
}

interface ConfirmationTeacherEmail {
  email: string;
  studentFullname: string;
  studentEmail: string;
  language: string;
  teacherFullname: string;
  date: string;  // ISO string format
  timezone: GMTOffset;  // Timezone
}

interface CancellationEmailParams {
  email: string;
  studentFullname: string;
  studentEmail: string;
  language: string;
  teacherFullname: string;
  date: string;  // ISO string format
  timezone: GMTOffset;  // Timezone
}

interface MessageEmailParams {
  email: string;
  studentFullname: string;
  studentEmail: string;
  studentMessage: string;
  teacherFullname: string;
}

function adjustTimezone(dateString: string, gmtOffset: string): Date {
  const date = new Date(dateString); // Parse the ISO string to a Date object
  const offsetInHours = parseInt(gmtOffset.replace("GMT", ""), 10); // Convert GMT offset to number

  // Adjust the date by adding/subtracting the offset in hours
  date.setUTCHours(date.getUTCHours() + offsetInHours); // Work in UTC time directly
  return date;
}

function formatDateTime(dateString: string, gmtOffset: string) {
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

export async function confirmClassToUser(params: ConfirmationStudentEmail) {
  const { email, name, language, teacherFullname, date, timezone } = params;

  const transport = await createTransport();

  const { formattedDate, formattedTime } = formatDateTime(date, timezone);

  const emailTemplatePath = path.join(__dirname, './templates/confirmation_email.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
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
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function confirmClassToTeacher(params: ConfirmationTeacherEmail) {
  const { email, studentFullname, studentEmail, language, teacherFullname, date, timezone } = params;

  const transport = await createTransport();

  const { formattedDate, formattedTime } = formatDateTime(date, timezone);

  const emailTemplatePath = path.join(__dirname, './templates/teacher_class_confirmation.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
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
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function confirmClassCancellationToTeacher(params: CancellationEmailParams) {
  const { email, studentFullname, studentEmail, language, teacherFullname, date, timezone } = params;

  const transport = await createTransport();

  const { formattedDate, formattedTime } = formatDateTime(date, timezone);

  const emailTemplatePath = path.join(__dirname, './templates/class_canceled_teacher.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
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
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function confirmClassCancellationToStudent(params: CancellationEmailParams) {
  const { email, studentFullname, teacherFullname, language, studentEmail, date, timezone } = params;

  const transport = await createTransport();

  const { formattedDate, formattedTime } = formatDateTime(date, timezone);

  const emailTemplatePath = path.join(__dirname, './templates/class_canceled_user.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
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
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendMessageToTeacher(params: MessageEmailParams) {
  const { email, studentFullname, studentEmail, studentMessage, teacherFullname } = params;

  const transport = await createTransport();

  const emailTemplatePath = path.join(__dirname, './templates/student_message_to_teacher.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
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
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function confirmPaymentReceived(params: PaymentConfirmationParams) {
  const { email, studentFullname, paymentAmount, numberOfClasses } = params;

  const transport = await createTransport();

  // Load the HTML template from the file
  const emailTemplatePath = path.join(__dirname, './templates/user_payment_confirmation.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
  // Replace placeholders with actual values
  let htmlContent = emailTemplate
    .replace(/{{studentFullname}}/g, studentFullname)
    .replace(/{{paymentAmount}}/g, paymentAmount)
    .replace(/{{numberOfClasses}}/g, numberOfClasses.toString());

  const mailOptions = {
    from: '"Yoff Academy" <no-reply@yoff.academy>',
    to: email,
    subject: `Payment Confirmation - ${paymentAmount} for ${numberOfClasses} Classes`,
    html: htmlContent,  // Use the dynamically created HTML content
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Payment confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function notifyPaymentAwaitingConfirmation(params: { studentFullName: string, studentEmail: string }) {
  const { studentFullName, studentEmail } = params;

  const transport = await createTransport();

  // Load the HTML template from the file
  const emailTemplatePath = path.join(__dirname, './templates/payment_process_request.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
  // Replace placeholders with actual values
  let htmlContent = emailTemplate
    .replace(/{{userFullName}}/g, studentFullName)
    .replace(/{{userEmail}}/g, studentEmail);

  const mailOptions = {
    from: '"Yoff Academy" <no-reply@yoff.academy>',
    to: 'gokdenizk.be@gmail.com', // Partner's email address
    subject: `Payment Awaiting Confirmation for ${studentFullName}`,
    html: htmlContent, // Use the dynamically created HTML content
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Payment awaiting confirmation email sent to Caner`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
