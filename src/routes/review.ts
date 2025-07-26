import express from 'express';
import {
    getReviews,
    postReviews,
    deleteReviews,
    updateReviews,
    likeReviews,
} from '../controllers/review';
import { isLoggedIn, isBookIdValid, isReviewIdValid } from '../middlewares';

const router = express.Router({ mergeParams: true });

router.get('/', isLoggedIn, isBookIdValid, getReviews); //해당 책에 대한 리뷰 모두 get
router.post('/', isLoggedIn, isBookIdValid, postReviews); //새 리뷰 post하기
router.delete(
    '/:reviewId',
    isLoggedIn,
    isBookIdValid,
    isReviewIdValid,
    deleteReviews
);
router.patch(
    '/:reviewId',
    isLoggedIn,
    isBookIdValid,
    isReviewIdValid,
    updateReviews
);
router.post(
    '/:reviewId/like',
    isLoggedIn,
    isBookIdValid,
    isReviewIdValid,
    likeReviews
);

export default router;
