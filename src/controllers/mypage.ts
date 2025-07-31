import { RequestHandler } from 'express';
import { Book, Review } from '../models';

const getMyReviews: RequestHandler = async (req, res, next) => {
    const previewLength = 50;
    const reviews = await Review.findAll({
        where: {
            user_id: req.user!.user_id,
        },
        order: [['created_at', 'DESC']],
    });
    const result = await Promise.all(
        reviews.map(async (review) => {
            const book = await Book.findByPk(review.dataValues.book_id);
            return {
                reviewId: review.dataValues.review_id,
                bookId: review.dataValues.book_id,
                bookTitle: book?.dataValues.title,
                author: book?.dataValues.author,
                translator: book?.dataValues.translator,
                likeCount: review.dataValues.like_count,
                //북마크 여부는 아직 관련 DB의 데이터를 채우지 않아서 나중에 추가할 예정
                reviewPreview:
                    review.dataValues.content.slice(0, previewLength) +
                    (review.dataValues.content.length > previewLength
                        ? '...'
                        : ''),
            };
        })
    );
    res.status(200).send(result);
};

export { getMyReviews };
