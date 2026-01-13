import db from '../config/db';
import PostgreGoalRepository from '../repositories/PostgreGoalRepository';
import GoalController from '../controllers/GoalController';
import { Router } from 'express';

const goalRepo = new PostgreGoalRepository(db);
const goalController = new GoalController(goalRepo);

const router = Router();

router.get('/', goalController.getAll);
router.get('/:id', goalController.getById);
router.post('/', goalController.create);
router.put('/:id', goalController.update);
router.delete('/:id', goalController.delete);

export default router;
