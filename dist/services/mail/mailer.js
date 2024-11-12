"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransport = createTransport;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function createTransport() {
    try {
        return nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_EMAIL_ADDRESS, // should be Admin@yoff.academy
                pass: process.env.NODEMAILER_EMAIL_APP_PASSWORD, // App password generated in Google account settings
            },
        });
    }
    catch (error) {
        console.error('Error creating transport:', error);
        throw error;
    }
}
