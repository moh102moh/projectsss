import express from 'express';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';

import { auth, preimt } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get('/', auth, preimt('admin'), listUsers);
router.get('/:id', auth, preimt('admin'), getUser);
router.post('/', auth, preimt('admin'), createUser);
router.put('/:id', auth, preimt('admin'), updateUser);
router.delete('/:id', auth, preimt('admin'), deleteUser);

export default router;
