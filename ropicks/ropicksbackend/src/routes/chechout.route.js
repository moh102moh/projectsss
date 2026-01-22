import express from 'express';
import {checkout} from '../controllers/chechout.controller.js';
import {auth} from '../middlewares/auth.middleware.js';


const router = express.Router();
router.post('/', auth, checkout);
export default router ;
