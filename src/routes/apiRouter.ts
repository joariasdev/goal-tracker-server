import { Router } from 'express';
import goalRouter from './goalRouter';

const router = Router();

router.use('/goals', goalRouter);

export default router;
