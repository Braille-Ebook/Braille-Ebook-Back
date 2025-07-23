import { RequestHandler } from 'express';
import { Review, UserReviewLike } from '../models';

const user_id = 1; //더미 데이터

const getReviews: RequestHandler = async (req, res) => {
    const reviews = await Review.findAll({
        where: {
            book_id: req.params.bookId,
        },
    });
    reviews.forEach((r) => r.dataValues);
    res.status(200).send(reviews);
};

const postReviews: RequestHandler = async (req, res) => {
    await Review.create({
        user_id,
        book_id: req.params.bookId,
        content: req.body.content,
    });
    res.sendStatus(200);
};

const deleteReviews: RequestHandler = async (req, res) => {
    await Review.destroy({
        where: {
            review_id: req.params.reviewId,
        },
    });
    res.sendStatus(200);
};

const updateReviews: RequestHandler = async (req, res) => {
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
};

const likeReviews: RequestHandler = async (req, res) => {
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
};

export { getReviews, postReviews, deleteReviews, updateReviews, likeReviews };
