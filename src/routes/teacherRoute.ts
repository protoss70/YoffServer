import express, { Request, Response } from 'express';
import Teacher, { ITeacher } from '../models/Teacher';

const router = express.Router();

// GET /teacher/:id - Get a teacher by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find the teacher by ID
    const teacher: ITeacher | null = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    // Send the teacher data as a response
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /teacher/cards - Get random teacher cards
router.get('/cards', async (req: Request, res: Response) => {
  try {
    const count = parseInt(req.query.count as string, 10) || 1;

    // Get random teachers based on the specified count
    const teachers: ITeacher[] = await Teacher.aggregate([{ $sample: { size: count } }]);

    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teacher cards:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;