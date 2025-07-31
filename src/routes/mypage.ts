import express from 'express';
import { getMyInfo, getMyReviews } from '../controllers/mypage';
import { isLoggedIn } from '../middlewares';

const router = express.Router();

router.get('/info', isLoggedIn, getMyInfo);
router.get('/reviews', isLoggedIn, getMyReviews);

export default router;
