import { Request, Response, NextFunction } from 'express';
import { isBookIdValid, isReviewIdValid } from './review';

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인이 필요합니다.');
    }
};

const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};

const validateEmailFormat = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res
            .status(400)
            .json({ message: '유효한 이메일 형식을 입력해주세요.' });
    }

    next();
};

export {
    isLoggedIn,
    isNotLoggedIn,
    isBookIdValid,
    isReviewIdValid,
    validateEmailFormat,
};
