import { Request, Response, NextFunction } from 'express';
import Book from '../models/book';
import { UserBookProgress } from 'src/models';

export const getBookInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { bookId } = req.params;

        const book = await Book.findByPk(bookId); //Book.findOne({where:{book_id:bookId}})

        if (!book) {
            return res.status(404).json({
                success: false,
                message: '해당 도서를 찾을 수 없습니다.',
            });
        }

        return res.status(200).json({
            success: true,
            data: book,
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

export const addBookMark = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
    } catch (err) {
        next(err);
    }
};
