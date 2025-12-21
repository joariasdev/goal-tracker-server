import { Router } from 'express';
import goalController from '../controllers/goalController';


const router = Router();

router.get('/', goalController.getAll);
router.get('/:id', goalController.getById);
router.post('/', goalController.create);
router.put('/:id', goalController.update);
router.delete('/:id', goalController.delete);

export default router;
