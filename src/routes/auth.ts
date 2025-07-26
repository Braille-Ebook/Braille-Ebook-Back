import express from 'express';
import passport from 'passport';
import { join, login, logout } from '../controllers/auth';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index';

const router = express.Router();

router.post('/join', isNotLoggedIn, join);
router.post('/login', isNotLoggedIn, login);
router.post('/logout', isLoggedIn, logout);

// Kakao OAuth
router.get('/kakao', passport.authenticate('kakao'));
router.get(
    '/kakao/callback',
    passport.authenticate('kakao', {
        failureRedirect: '/?loginError=카카오로그인 실패',
    }),
    (req, res) => {
        res.redirect('/');
    }
);

export default router;
