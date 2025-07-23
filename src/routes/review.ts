import express from 'express';
import {
    getReviews,
    postReviews,
    deleteReviews,
    updateReviews,
} from '../controllers/review';

const router = express.Router({ mergeParams: true });

router.get('/', getReviews); //해당 책에 대한 리뷰 모두 get
router.post('/', postReviews); //새 리뷰 post하기
router.delete('/:reviewId', deleteReviews);
router.patch('/:reviewId', updateReviews);

export default router;
