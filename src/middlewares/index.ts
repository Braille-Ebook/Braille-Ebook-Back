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

export { isLoggedIn, isNotLoggedIn, isBookIdValid, isReviewIdValid };
