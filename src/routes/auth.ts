import express from 'express';
import passport from 'passport';
import {
    join,
    login,
    logout,
    sendVerificationCode,
    verifyCode,
} from '../controllers/auth';
import {
    isLoggedIn,
    isNotLoggedIn,
    validateEmailFormat,
} from '../middlewares/index';

const router = express.Router();

router.post('/join', isNotLoggedIn, join);
router.post('/login', isNotLoggedIn, login);
router.post('/logout', isLoggedIn, logout);

router.post('/send-code', validateEmailFormat, sendVerificationCode);

router.post('/verify-code', verifyCode);

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
