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
  const { id } = req.params;

  try {
    
    // TODO add here a data validation to match userId and teacherId before deleting
    // to prevent others from deleting schedules which are not theirs

    const deletedClass = await ScheduledClass.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ message: 'Scheduled class not found' });
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

// Update a Scheduled Class
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, teacher, user, isCompleted } = req.body;

  try {
    const updatedClass = await ScheduledClass.findByIdAndUpdate(
      id,
      {
        date,
        teacher,
        user,
        isCompleted,
      },
      { new: true } // Return the updated document
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Scheduled class not found' });
    }

    res.status(200).json({
      success: true,
      updatedClass,
    });
  } catch (error) {
    console.error('Error updating scheduled class:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Export the router
export default router;
