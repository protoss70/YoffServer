import express, { Request, Response } from 'express';
import ScheduledClass, { IScheduleClass } from '../models/ScheduleClass'; // Adjust the import path
import Teacher from '../models/Teacher';
import { isValidDate, isDateAvailable } from '../utility/scheduleUtils';

const router = express.Router();

// Create a Scheduled Class
router.post('/', async (req: Request, res: Response) => {
  const { date, teacherId, userId } = req.body;
  try {
    // Fetch teacher data using the teacherId
    const teacherData = await Teacher.findById(teacherId);

    // Check if the teacher exists
    if (!teacherData) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Check if the given date exists in the teacher schedule
    if (!isValidDate(teacherData, date)) {
      return res.status(400).json({
        success: false,
        message: 'The given date does not exist on the teacher schedule',
      });
    }

    // Check if the given date is available
    const isAvailable = await isDateAvailable(teacherId, date);
    if (!isAvailable){
      return res.status(400).json({
        success: false,
        message: 'The date is not available',
      });
    }

    // Create the scheduled class if all validations pass
    const newClass: IScheduleClass = await ScheduledClass.create({
      date,
      teacher: teacherId, // Ensure to use 'teacher' here
      user: userId, // Ensure to use 'user' here
    });


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
  const { userId, teacherId } = req.body; // Destructure userId and teacherId from the request body
  const { id } = req.params; // Get the class ID from the URL parameter

  try {
    // Find and delete the scheduled class if it exists and matches the user and teacher
    const deletedClass = await ScheduledClass.findOneAndDelete({
      _id: id,
      teacher: teacherId,
      user: userId,
    });

    // Check if the class was found and deleted
    if (!deletedClass) {
      return res.status(404).json({ message: 'Scheduled class not found or does not belong to the user' });
    }

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
