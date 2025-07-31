import { RequestHandler } from 'express';
import { Book, Review, User } from '../models';

const getMyInfo: RequestHandler = async (req, res, next) => {
    const user = await User.findByPk(req.user!.user_id);
    const numOfReview = await Review.count({
        where: {
            user_id: req.user!.user_id,
        },
    });
    const result = {
        //아이디란이 없음. 아마 13번 REFACTOR에 추가될 예정인 것 같음
        nickname: user?.dataValues.nickname,
        numOfReview,
    };
    res.status(200).send(result);
};

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

export { getMyInfo, getMyReviews };
