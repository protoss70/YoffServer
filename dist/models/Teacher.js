"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Create the Teacher schema
const TeacherSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    surname: {
        type: String,
        required: true,
        trim: true,
    },
    origin: {
        type: String,
        required: true,
        trim: true,
    },
    hobbies: {
        type: [String],
        required: false,
    },
    bio: {
        type: String,
        required: true,
        trim: true,
    },
    education: {
        type: String,
        required: true,
        trim: true,
    },
    languages: {
        type: [String],
        required: false,
    },
    schedule: {
        type: [
            {
                day: { type: String, required: true },
                hours: { type: [String], required: true },
            },
        ],
        required: false,
        default: [],
    },
    time_zone: {
        type: String,
        required: false,
        default: "GMT+3"
    }
});
// Create the Teacher model
const Teacher = mongoose_1.default.model('Teacher', TeacherSchema);
exports.default = Teacher;
