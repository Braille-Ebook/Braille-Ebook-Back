import express from 'express';
import {
    getReviews,
    postReviews,
    deleteReviews,
    updateReviews,
    likeReviews,
} from '../controllers/review';
import { isBookIdValid, isReviewIdValid } from '../middlewares/review';

const router = express.Router({ mergeParams: true });

router.get('/', isBookIdValid, getReviews); //해당 책에 대한 리뷰 모두 get
router.post('/', isBookIdValid, postReviews); //새 리뷰 post하기
router.delete('/:reviewId', isBookIdValid, isReviewIdValid, deleteReviews);
router.patch('/:reviewId', isBookIdValid, isReviewIdValid, updateReviews);
router.post('/:reviewId/like', isBookIdValid, isReviewIdValid, likeReviews);

export default router;
