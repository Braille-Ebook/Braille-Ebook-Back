import express from 'express';
import { getMyInfo, getMyReviews, getMyBooks } from '../controllers/mypage';
import { isLoggedIn } from '../middlewares';

const router = express.Router();

router.get('/info', isLoggedIn, getMyInfo);
router.get('/reviews', isLoggedIn, getMyReviews);
router.get('/books', isLoggedIn, getMyBooks);

export default router;
