import express from 'express';
import { getMyReviews } from '../controllers/mypage';
import { isLoggedIn } from '../middlewares';

const router = express.Router();

router.get('/reviews', isLoggedIn, getMyReviews);

export default router;
