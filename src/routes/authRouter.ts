import db from '../config/db';
import PostgreUserRepository from '../repositories/PostgreUserRepository';
import UserController from '../controllers/UserController';
import { Router } from 'express';

const userRepo = new PostgreUserRepository(db);
const userController = new UserController(userRepo);

const router = Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/me', userController.me);
router.get('/refresh', userController.refresh);

export default router;
