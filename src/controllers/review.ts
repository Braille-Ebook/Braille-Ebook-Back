import { RequestHandler } from 'express';
import { Review, UserReviewLike } from '../models';
import { isUserOwnerOfReview } from '../services/review';

const user_id = '1'; //더미 데이터

const getReviews: RequestHandler = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: {
                book_id: req.params.bookId,
            },
        });
        const reviewsWithIsLiked = await Promise.all(
            reviews.map(async (r) => {
                const isLiked = await UserReviewLike.findOne({
                    where: {
                        user_id: user_id,
                        review_id: r.dataValues.review_id,
                    },
                });

                return {
                    ...r.toJSON(), // convert Sequelize instance to plain object
                    isLiked: r.dataValues.user_id == user_id ? null : !!isLiked,
                };
            })
        );
        res.status(200).send(reviewsWithIsLiked);
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
        if (!(await isUserOwnerOfReview(user_id, req.params.reviewId))) {
            const error = new Error('다른 유저의 리뷰는 삭제할 수 없습니다.');
            error.status = 400;
            next(error);
        }
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
        if (!(await isUserOwnerOfReview(user_id, req.params.reviewId))) {
            const error = new Error('다른 유저의 리뷰는 수정할 수 없습니다.');
            error.status = 400;
            next(error);
        }
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
        if (await isUserOwnerOfReview(user_id, req.params.reviewId)) {
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
