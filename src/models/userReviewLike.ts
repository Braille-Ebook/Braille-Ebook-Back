import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class UserReviewLike extends Model {}

UserReviewLike.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        review_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: 'UserReviewLike',
        tableName: 'UserReviewLike',
        timestamps: false,
    }
);

export default UserReviewLike;
