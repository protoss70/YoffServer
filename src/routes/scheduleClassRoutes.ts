import express, { Request, Response } from 'express';
import ScheduledClass, { IScheduleClass } from '../models/ScheduleClass'; // Adjust the import path
import Teacher from '../models/Teacher';
import { isClassInThePast, isDateAvailable, isDateInTeacherSchedule, isLanguageTaughtByTeacher } from '../utility/scheduleUtils';
import { processRequestDate, isValidDate } from '../utility/dates';
import User from '../models/User';
import mongoose from 'mongoose';
import { confirmClassCancellationToStudent, confirmClassCancellationToTeacher, confirmClassToTeacher, confirmClassToUser } from '../services/mail/emailTemplates';
import { isEmailVerified } from '../middleware/isEmailVerified';

const router = express.Router();

// Create a Scheduled Class
router.post('/', isEmailVerified, async (req: Request, res: Response) => {
  const { date, teacherId, userId, language, userLocale } = req.body;
  const isDemoClass =  req.query.isDemoClass === "true";
  const userData = res.locals.userData;

  try {

    // Check if valid date string
    if (!isValidDate(date)){
      return res.status(400).json({ success: false, message: 'Invalid date' });
    }
    const _date = processRequestDate(date); 

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid teacherId or userId' });
    }

    // Fetch teacher data using the teacherId
    const teacherData = await Teacher.findById(teacherId);

    // Check if the teacher exists
    if (!teacherData) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }
    if (!isDateInTeacherSchedule(teacherData, _date.toString())){
      return res.status(400).json({
        success: false,
        message: 'The given date does not exist on the teacher schedule',
      });
    }

    if (!isLanguageTaughtByTeacher(teacherData, language)){
      return res.status(400).json({
        success: false,
        message: 'The language provided is not taught by the teacher',
      });
    }

    // Check if the given date is available
    const isAvailable = await isDateAvailable(teacherId, date);
    if (!isAvailable){
      return res.status(409).json({
        success: false,
        message: 'The date is not available',
      });
    }

    if (isDemoClass && userData.demoClass){
      return res.status(400).json({
        success: false,
        message: 'The user already used their demo class',
      }); 
    }

    if (!isDemoClass && userData.credits < 1){
      return res.status(402).json({
        success: false,
        message: 'Insufficent credits',
      });
    }

    // If this is a demo class, update the user's demoClass field to the current date
    if (isDemoClass) {
      await User.findByIdAndUpdate(userId, {
        demoClass: new Date(), // Set demoClass to current date
      });
    }else {
      // Increment the user's credits by 1 if it's not a demo class
      await User.findByIdAndUpdate(userId, {
        $inc: { credits: -1 }, // Increment the credits field by 1
      });
    }

    // Create the scheduled class if all validations pass
    const newClass: IScheduleClass = await ScheduledClass.create({
      date: _date.toISOString(),
      teacher: teacherId, // Ensure to use 'teacher' here
      user: userId, // Ensure to use 'user' here
      isDemoClass: isDemoClass || false,
      language: language,
    });

    // Send emails to confirm class
    await Promise.all([
      confirmClassToTeacher({
        email: "info@yoff.academy",
        studentFullname: userData.fullName,
        studentEmail: userData.email,
        language: language,
        teacherFullname: `${teacherData.name} ${teacherData.surname}`,
        date: _date.toISOString(),
        timezone: teacherData.time_zone || "GMT+3"
      }),
      confirmClassToUser({
        email: userData.email,
        name: userData.fullName,
        language: language,
        teacherFullname: `${teacherData.name} ${teacherData.surname}`,
        date: date,
        timezone: userData.timezone,
        userLocale: userLocale || "en"
      })
    ]);

    res.status(201).json({
      success: true,
      newClass,
    });
  } catch (error) {
    console.error('Error creating scheduled class:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Delete a Scheduled Class
router.delete('/:id', async (req: Request, res: Response) => {
  const { userId, teacherId, userLocale } = req.body; // Destructure userId and teacherId from the request body
  const { id } = req.params; // Get the class ID from the URL parameter
  const userData = res.locals.userData;

  try {

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid teacherId or userId' });
    }

    const teacherData = await Teacher.findById(teacherId);

    if (!teacherData){
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Find the scheduled class that matches the user and teacher
    const scheduledClass = await ScheduledClass.findOne<IScheduleClass>({
      _id: id,
      teacher: teacherId,
      user: userId,
    });

    // Check if the class was found
    if (!scheduledClass) {
      return res.status(404).json({ message: 'Scheduled class not found or does not belong to the user' });
    }

    // Check if the class date is in the past
    if (isClassInThePast(scheduledClass.date)) {
      return res.status(400).json({ message: 'The class has already been completed and cannot be deleted' });
    }

    // If the class is a demo class, remove the demoClass date from the user
    if (scheduledClass.isDemoClass) {
      await User.findByIdAndUpdate(userId, {
        $unset: { demoClass: "" }, // Unset the demoClass field
      });
    }else {
      // Increment the user's credits by 1 if it's not a demo class
      await User.findByIdAndUpdate(userId, {
        $inc: { credits: 1 }, // Increment the credits field by 1
      });
    }

    // Delete the scheduled class
    await ScheduledClass.findByIdAndDelete(id);


    // Send emails to confirm class
    await Promise.all([
      confirmClassCancellationToTeacher({
        email: teacherData.email,
        studentFullname: userData.fullName,
        studentEmail: userData.email,
        language: scheduledClass.language,
        teacherFullname: `${teacherData.name} ${teacherData.surname}`,
        date: scheduledClass.date.toISOString(),
        timezone: teacherData.time_zone || "GMT+3",
        userLocale: "en"
      }),
      confirmClassCancellationToStudent({
        email: userData.email,
        studentEmail: userData.email,
        studentFullname: userData.fullName,
        language: scheduledClass.language,
        teacherFullname: `${teacherData.name} ${teacherData.surname}`,
        date: scheduledClass.date.toISOString(),
        timezone: userData.timezone,
        userLocale: userLocale || "en"
      })
    ]);


    res.status(200).json({
      success: true,
      message: 'Scheduled class deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting scheduled class:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;


// Get all Scheduled Classes for a specific user
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params; // Get the userId from the URL parameter

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    // Aggregate scheduled classes for the given userId
    const scheduledClasses = await ScheduledClass.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) }, // Match classes that belong to the user
      },
      {
        $lookup: {
          from: 'teachers', // Name of the collection to join
          localField: 'teacher', // Field from the current collection
          foreignField: '_id', // Field from the teachers collection
          as: 'teacherDetails', // Alias for the joined data
        },
      },
      {
        $unwind: '$teacherDetails', // Flatten the teacherDetails array
      },
      {
        $project: {
          _id: 1,
          date: 1, // Include the full date object
          language: 1,
          isDemoClass: 1,
          'teacherDetails._id': 1,
          'teacherDetails.name': 1, // Include teacher's name
          'teacherDetails.surname': 1, // Include teacher's surname
        },
      },
      {
        $sort: { 'date.date': 1 }, // Sort by the date field inside the `date` object in ascending order
      },
    ]);

    // Return the result
    res.status(200).json({
      success: true,
      scheduledClasses,
    });
  } catch (error) {
    console.error('Error fetching scheduled classes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});