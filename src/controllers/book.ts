import { Request, Response, NextFunction } from 'express';
import Book from '../models/book';
import UserBookProgress from '../models/userBookProgress';

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
        const userPk = req.user?.user_id;
        const bookId = parseInt(req.params.bookId);

        if (!userPk) {
            return res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.',
            });
        } //isLoggedIn에서 미리 걸러짐

        if (isNaN(bookId)) {
            return res.status(400).json({
                success: false,
                message: '올바르지 않은 책 ID입니다.',
            });
        }

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: '해당 책을 찾을 수 없습니다.',
            });
        }

        const [record, created] = await UserBookProgress.findOrCreate({
            where: { user_id: userPk, book_id: bookId },
            defaults: { user_id: userPk, book_id: bookId, is_bookmarked: true },
        });

        if (created) {
            await Book.increment('bookmark_num', {
                where: { book_id: bookId },
            });
            return res.status(200).json({
                success: true,
                message: '북마크가 추가되었습니다.',
            });
        }

        if (!record.is_bookmarked) {
            await record.update({ is_bookmarked: true });
            await Book.increment('bookmark_num', {
                where: { book_id: bookId },
            });
            return res.status(200).json({
                success: true,
                message: '북마크가 추가되었습니다.',
            });
        }

        return res.status(200).json({
            success: true,
            message: '북마크가 추가되었습니다.',
        });
    } catch (err) {
        next(err);
    }
};

export const deleteBookMark = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userPk = req.user?.user_id;
        const bookId = parseInt(req.params.bookId);

        if (!userPk) {
            return res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.',
            });
        } //isLoggedIn에서 미리 걸러짐

        if (isNaN(bookId)) {
            return res.status(400).json({
                success: false,
                message: '올바르지 않은 책 ID입니다.',
            });
        }

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: '해당 책을 찾을 수 없습니다.',
            });
        }

        const record = await UserBookProgress.findOne({
            where: { user_id: userPk, book_id: bookId },
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: '해당 도서 기록을 찾을 수 없습니다.', //row 없는 경우
            });
        }
        if (!record.is_bookmarked) {
            return res.status(404).json({
                success: false,
                message: '북마크 되어있지 않습니다.', //false인데 취소하는 경우
            });
        }

        await record.update({ is_bookmarked: false });
        await Book.decrement('bookmark_num', { where: { book_id: bookId } });

        return res.status(200).json({
            success: true,
            message: '북마크가 삭제되었습니다.',
        });
    } catch (err) {
        next(err);
    }
};

export const startRead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userPk = req.user?.user_id;
        const bookId = parseInt(req.params.bookId);

        if (!userPk) {
            return res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.',
            });
        }

        if (isNaN(bookId)) {
            return res.status(400).json({
                success: false,
                message: '올바르지 않은 책 ID입니다.',
            });
        }

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: '해당 책을 찾을 수 없습니다.',
            });
        }

        await UserBookProgress.upsert({
            user_id: userPk,
            book_id: bookId,
            last_page: 0,
            last_char: 0,
            updated_at: new Date(),
        });

        return res.status(200).json({
            success: true,
            message: '처음부터 읽기 정보입니다.',
            data: {
                page: 0,
                charIndex: 0,
            },
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

export const getProgress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userPk = req.user?.user_id;
        const bookId = parseInt(req.params.bookId);

        if (!userPk) {
            return res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.',
            });
        }

        if (isNaN(bookId)) {
            return res.status(400).json({
                success: false,
                message: '올바르지 않은 책 ID입니다.',
            });
        }

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: '해당 책을 찾을 수 없습니다.',
            });
        }

        const record = await UserBookProgress.findOne({
            where: { user_id: userPk, book_id: bookId },
        });

        if (!record) {
            return res.status(200).json({
                success: false,
                message: '이어 읽기 정보가 없습니다.',
            });
        }

        return res.status(200).json({
            success: true,
            message: '이어 읽기 정보입니다.',
            data: {
                page: record.last_page,
                charIndex: record.last_char,
            },
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
