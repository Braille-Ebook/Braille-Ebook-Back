import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import User from './user';
import Book from './book';

class UserPageBookmark extends Model {}

UserPageBookmark.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        book_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        bookmarked_page: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: 'UserPageBookmark',
        tableName: 'UserPageBookmark',
        timestamps: false,
    }
);

export default UserPageBookmark;
