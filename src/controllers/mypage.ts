import { RequestHandler } from 'express';
import { Book, Review, User, UserBookProgress } from '../models';

const getMyInfo: RequestHandler = async (req, res, next) => {
    const user = await User.findByPk(req.user!.user_id);
    const numOfReview = await Review.count({
        where: {
            user_id: req.user!.user_id,
        },
    });
    const numOfReadBooks = await UserBookProgress.count({
        where: {
            user_id: req.user!.user_id,
        },
    });
    const result = {
        //아이디란이 없음. 아마 13번 REFACTOR에 추가될 예정인 것 같음
        nickname: user?.dataValues.nickname,
        numOfReview,
        numOfReadBooks,
    };
    res.status(200).send({
        success: true,
        message: '마이페이지 정보 불러오기가 성공했습니다.',
        data: result,
    });
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
            const isBookmarked = await UserBookProgress.findOne({
                where: {
                    user_id: req.user!.user_id,
                    book_id: book?.dataValues.book_id,
                },
                attributes: ['is_bookmarked'],
            });
            return {
                reviewId: review.dataValues.review_id,
                bookId: review.dataValues.book_id,
                bookTitle: book?.dataValues.title,
                author: book?.dataValues.author,
                translator: book?.dataValues.translator,
                likeCount: review.dataValues.like_count,
                isBookmarked: isBookmarked?.dataValues.is_bookmarked || false,
                reviewPreview:
                    review.dataValues.content.slice(0, previewLength) +
                    (review.dataValues.content.length > previewLength
                        ? '...'
                        : ''),
            };
        })
    );
    res.status(200).send({
        success: true,
        message: '리뷰 정보 불러오기가 성공했습니다.',
        data: result,
    });
};

const getMyBooks: RequestHandler = async (req, res, next) => {
    const progress = await UserBookProgress.findAll({
        where: {
            user_id: req.user!.user_id,
        },
        order: [['updated_at', 'DESC']],
    });
    const result = await Promise.all(
        progress.map(async (progress) => {
            const book = await Book.findByPk(progress.dataValues.book_id, {
                attributes: ['title', 'author', 'translator'],
            });
            return {
                bookId: progress.dataValues.book_id,
                title: book?.dataValues.title,
                author: book?.dataValues.author,
                translator: book?.dataValues.translator,
                updatedAt: progress.dataValues.updated_at,
                isBookmarked: progress.dataValues.is_bookmarked,
            };
        })
    );
    res.status(200).send({
        success: true,
        message: '책 정보 불러오기가 성공했습니다.',
        data: result,
    });
};

export { getMyInfo, getMyReviews, getMyBooks };
