import { Book, Review } from '../models';
import { RequestHandler } from 'node_modules/@types/express';

const isBookIdValid: RequestHandler = async (req, res, next) => {
    //bookId 존재여부 확인
    const book = await Book.findByPk(req.params.bookId);
    if (!book) {
        const error = new Error('해당 bookId는 존재하지 않습니다.');
        error.status = 400;
        next(error);
    }
    next();
};

const isReviewIdValid: RequestHandler = async (req, res, next) => {
    //reviewId 존재여부 확인
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
        const error = new Error('해당 reviewId는 존재하지 않습니다.');
        error.status = 400;
        next(error);
    }

    //params의 bookId와 reviewId가 DB에 있는 조합인지 확인
    const bookIdOfReview = await Review.findOne({
        where: {
            review_id: req.params.reviewId,
        },
        attributes: ['book_id'],
    });
    if (!(bookIdOfReview?.dataValues.book_id == req.params.bookId)) {
        const error = new Error(
            'reviewId가 적절한 bookId를 가지고 있지 않습니다.'
        );
        error.status = 400;
        next(error);
    }
    next();
};
export { isBookIdValid, isReviewIdValid };
