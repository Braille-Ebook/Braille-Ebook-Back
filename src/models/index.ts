import User from './user';
import Book from './book';
import Review from './review';
import UserBookProgress from './userBookProgress';
import UserPageBookmark from './userPageBookmark';
import UserReviewLike from './userReviewLike';

User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

Book.hasMany(Review, { foreignKey: 'book_id' });
Review.belongsTo(Book, { foreignKey: 'book_id' });

User.hasMany(UserBookProgress, { foreignKey: 'user_id' });
Book.hasMany(UserBookProgress, { foreignKey: 'book_id' });
UserBookProgress.belongsTo(User, { foreignKey: 'user_id' });
UserBookProgress.belongsTo(Book, { foreignKey: 'book_id' });

User.hasMany(UserPageBookmark, { foreignKey: 'user_id' });
Book.hasMany(UserPageBookmark, { foreignKey: 'book_id' });
UserPageBookmark.belongsTo(User, { foreignKey: 'user_id' });
UserPageBookmark.belongsTo(Book, { foreignKey: 'book_id' });

User.belongsToMany(Review, {
    through: 'UserReviewLike',
    foreignKey: 'user_id',
    otherKey: 'review_id',
});
Review.belongsToMany(User, {
    through: 'UserReviewLike',
    foreignKey: 'review_id',
    otherKey: 'user_id',
});

export {
    User,
    Book,
    Review,
    UserBookProgress,
    UserPageBookmark,
    UserReviewLike,
};
