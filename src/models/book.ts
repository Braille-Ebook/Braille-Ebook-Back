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
        title: DataTypes.STRING(30),
        image_url: DataTypes.STRING(255),
        genre: DataTypes.STRING(15),
        author: DataTypes.STRING(20),
        translator: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        publisher: DataTypes.STRING(20),
        publish_date: DataTypes.DATE,
        summary: DataTypes.STRING(150),
        length: DataTypes.INTEGER,
        ISBN: DataTypes.INTEGER,
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
