import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import User from './user';
import Book from './book';

class UserBookProgress extends Model {}

UserBookProgress.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        book_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        last_page: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        last_char: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_bookmarked: DataTypes.BOOLEAN,
    },
    {
        sequelize,
        modelName: 'UserBookProgress',
        tableName: 'UserBookProgress',
        timestamps: false,
    }
);

export default UserBookProgress;
