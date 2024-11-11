import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function createTransport() {
  try {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL_ADDRESS, // should be Admin@yoff.academy
        pass: process.env.NODEMAILER_EMAIL_APP_PASSWORD, // App password generated in Google account settings
      },
    });
  } catch (error) {
    console.error('Error creating transport:', error);
    throw error;
  }
}

export { createTransport };
