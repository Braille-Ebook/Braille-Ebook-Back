import { Review } from '../models';

//책 상세조회 할 시 나타나는 배댓 2개를 뽑아내는 서비스 함수입니다. 사용법은 다음과 같습니다:
//const bestReviews = await getBestTwoReviews(req.params.bookId);
const getBestTwoReviews = async (bookId: string) => {
    const topReviews = await Review.findAll({
        where: {
            book_id: bookId,
        },
        order: [['like_count', 'DESC']],
        limit: 2,
    });
    return topReviews.map((r) => r.get({ plain: true }));
};

//리뷰의 주인이 유저인지 확인하는 서비스 함수입니다. 사용법은 다음과 같습니다:
//await isUserOwnerOfReview(user_id, req.params.reviewId)
const isUserOwnerOfReview = async (userId: string, reviewId: string) => {
    const reviewOwner = await Review.findByPk(reviewId, {
        attributes: ['user_id'],
    });
    return reviewOwner?.dataValues.user_id == userId;
};

export { getBestTwoReviews, isUserOwnerOfReview };
