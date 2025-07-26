import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import Review from './review';
import UserBookProgress from './userBookProgress';
import UserPageBookmark from './userPageBookmark';

class Book extends Model {}

Book.init(
    {
        book_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: DataTypes.STRING(255),
        image_url: DataTypes.STRING(255),
        genre: DataTypes.STRING(50),
        author: DataTypes.STRING(100),
        translator: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        publisher: DataTypes.STRING(100),
        publish_date: DataTypes.DATE,
        summary: DataTypes.STRING(1500),
        length: DataTypes.INTEGER,
        ISBN: DataTypes.STRING(20),
        bookmark_num: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        pdf_url: DataTypes.STRING(255),
    },
    {
        sequelize,
        modelName: 'Book',
        tableName: 'Book',
        timestamps: false,
    }
);

export default Book;
