import { Router } from 'express';
import goalRouter from './goalRouter';

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Goal Tracker API');
});

router.use('/goals', goalRouter);

export default router;
