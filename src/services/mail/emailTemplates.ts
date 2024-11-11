import { createTransport } from './mailer';
import fs from 'fs';
import path from 'path';

interface ConfirmationStudentEmail {
  email: string;
  name: string;
  language: string;
  teacherFullname: string,
  date: Date
}

interface PaymentConfirmationParams {
  email: string;
  studentFullname: string;
  paymentAmount: string;  // Amount paid (e.g., "$100")
  numberOfClasses: number;  // Number of classes purchased
}

interface ConfirmationTeacherEmail {
  email: string;
  studentFullname: string;
  studentEmail: string;
  language: string;
  teacherFullname: string;
  date: Date;
}

interface CancellationEmailParams {
  email: string;
  studentFullname: string;
  studentEmail: string;
  language: string;
  teacherFullname: string;
  date: Date;
}

interface MessageEmailParams{
  email: string,
  studentFullname: string,
  studentEmail: string,
  studentMessage: string,
  teacherFullname: string
}

export async function confirmClassToUser(params: ConfirmationStudentEmail) {
  const { email, name, language, teacherFullname, date } = params;

  const transport = await createTransport();

  // Format date as dd/mm/yyyy
  const formattedDate = date.toLocaleDateString('en-GB'); // en-GB provides the dd/mm/yyyy format

  // Format time as hh:mm
  const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // Load the HTML template from the file
  const emailTemplatePath = path.join(__dirname, './templates/confirmation_email.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
  // Replace placeholders with actual values
  const htmlContent = emailTemplate
    .replace('{{name}}', name || '')
    .replace('{{language}}', language || 'English')
    .replace('{{teacher}}', teacherFullname)
    .replace('{{date}}', formattedDate)
    .replace('{{time}}', formattedTime)

  const mailOptions = {
    from: '"Yoff Academy" <no-reply@yoff.academy>',
    to: email,
    subject: `${language} Class Confirmation at ${formattedDate}`,
    html: htmlContent, // Use the dynamically created HTML content
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function confirmClassToTeacher(params: ConfirmationTeacherEmail) {
  const { email, studentFullname, studentEmail, language, teacherFullname, date } = params;

  const transport = await createTransport();

  // Format date as dd/mm/yyyy
  const formattedDate = date.toLocaleDateString('en-GB'); // en-GB provides the dd/mm/yyyy format

  // Format time as hh:mm
  const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // Load the HTML template from the file
  const emailTemplatePath = path.join(__dirname, './templates/teacher_class_confirmation.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
  console.log('Loaded email template:', emailTemplate);
  console.log("STUDENT EMAIL", studentEmail);
  
  // Replace placeholders with actual values
  const htmlContent = emailTemplate
    .replace('{{teacherName}}', teacherFullname)
    .replace('{{studentFullname}}', studentFullname)
    .replace('{{studentEmail}}', studentEmail)
    .replace('{{studentEmail}}', studentEmail)
    .replace('{{language}}', language || 'English')
    .replace('{{date}}', formattedDate)
    .replace('{{time}}', formattedTime);

  const mailOptions = {
    from: '"Yoff Academy" <no-reply@yoff.academy>',
    to: email,
    subject: `New ${language} Class with ${studentFullname} on ${formattedDate}`,
    html: htmlContent, // Use the dynamically created HTML content
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}


export async function confirmClassCancellationToTeacher(params: CancellationEmailParams) {
  const { email, studentFullname, studentEmail, language, teacherFullname, date } = params;

  const transport = await createTransport();

  // Format date as dd/mm/yyyy
  const formattedDate = date.toLocaleDateString('en-GB'); // en-GB provides the dd/mm/yyyy format

  // Format time as hh:mm
  const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // Load the HTML template from the file
  const emailTemplatePath = path.join(__dirname, './templates/class_canceled_teacher.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
  // Replace placeholders with actual values
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
    html: htmlContent, // Use the dynamically created HTML content
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Cancellation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function confirmClassCancellationToStudent(params: CancellationEmailParams) {
  const { email, studentFullname, teacherFullname, language, studentEmail, date } = params;

  const transport = await createTransport();

  // Format date as dd/mm/yyyy
  const formattedDate = date.toLocaleDateString('en-GB'); // en-GB provides the dd/mm/yyyy format

  // Format time as hh:mm
  const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // Load the HTML template from the file
  const emailTemplatePath = path.join(__dirname, './templates/class_canceled_user.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
  // Replace placeholders with actual values
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
    html: htmlContent, // Use the dynamically created HTML content
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

  // Load the HTML template from the file
  const emailTemplatePath = path.join(__dirname, './templates/student_message_to_teacher.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
  
  // Replace placeholders with actual values
  let htmlContent = emailTemplate
    .replace(/{{teacherName}}/g, teacherFullname)
    .replace(/{{userName}}/g, studentFullname)
    .replace(/{{userEmail}}/g, studentEmail)
    .replace(/{{userMessage}}/g, studentMessage);

  const mailOptions = {
    from: '"Yoff Academy" <no-reply@yoff.academy>',
    to: email,
    subject: `Message from student: ${studentFullname}`,
    html: htmlContent, // Use the dynamically created HTML content
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
