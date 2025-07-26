import passport from 'passport';
import local from './localStrategy';
import kakao from './kakaoStrategy';
import User from '../models/user';

export default () => {
    passport.serializeUser((user: any, done) => {
        done(null, user.user_id); // user.user_id 가 PK
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await User.findByPk(id);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (err) {
            console.error(err);
            return done(err);
        }
    });

    local();
    kakao();
};
