import { RequestHandler } from 'express';
import { Review, UserReviewLike } from '../models';

const user_id = 1; //더미 데이터

const getReviews: RequestHandler = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: {
                book_id: req.params.bookId,
            },
        });
        res.status(200).send(reviews);
    } catch (e) {
        next(e);
    }
};

const postReviews: RequestHandler = async (req, res, next) => {
    try {
        await Review.create({
            user_id,
            book_id: req.params.bookId,
            content: req.body.content,
        });
        return res.sendStatus(200);
    } catch (e) {
        next(e);
    }
};

const deleteReviews: RequestHandler = async (req, res, next) => {
    try {
        await Review.destroy({
            where: {
                review_id: req.params.reviewId,
            },
        });
        return res.sendStatus(200);
    } catch (e) {
        next(e);
    }
};

const updateReviews: RequestHandler = async (req, res, next) => {
    try {
        await Review.update(
            {
                content: req.body.content,
            },
            {
                where: {
                    review_id: req.params.reviewId,
                },
            }
        );
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
};

const likeReviews: RequestHandler = async (req, res, next) => {
    try {
        const reviewOwner = await Review.findByPk(req.params.reviewId, {
            attributes: ['user_id'],
        });
        if (reviewOwner?.dataValues.user_id == user_id) {
            const error = new Error(
                '자신의 리뷰에는 좋아요를 누를 수 없습니다.'
            );
            error.status = 400;
            next(error);
        }

        const existing = await UserReviewLike.findOne({
            where: {
                user_id: user_id,
                review_id: req.params.reviewId,
            },
        });

        if (existing) {
            // Unlike
            await existing.destroy();
        } else {
            //Like
            await UserReviewLike.create({
                user_id: user_id,
                review_id: req.params.reviewId,
            });
        }
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
};

export { getReviews, postReviews, deleteReviews, updateReviews, likeReviews };
