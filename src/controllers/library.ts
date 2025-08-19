import { Request, Response, NextFunction } from 'express';
const { Op } = require('sequelize');
import UserBookProgress from '../models/userBookProgress';
import Book from '../models/book';

export const getBookmarkedBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const libraryBooks = await UserBookProgress.findAll({
            where: {
                user_id: req.user?.user_id,
                is_bookmarked: 1,
            },
            attributes: ['book_id'],
        });
        const bookIds = libraryBooks.map((b) => b.book_id);
        const books = await Book.findAll({
            where: {
                book_id: {
                    [Op.in]: bookIds,
                },
            },
            attributes: [
                'title',
                'author',
                'translator',
                'publish_date',
                'bookmark_num',
            ],
        });
        return res.status(200).json(books);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};
