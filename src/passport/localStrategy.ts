import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user';

export default () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: false,
            },
            async (email, password, done) => {
                try {
                    const exUser = await User.findOne({ where: { email } });

                    // 유저가 존재하고, 비밀번호도 존재할 때만 bcrypt 비교
                    if (exUser && exUser.password) {
                        const result = await bcrypt.compare(
                            password,
                            exUser.password
                        );
                        if (result) {
                            return done(null, exUser);
                        } else {
                            return done(null, false, {
                                message: '비밀번호가 일치하지 않습니다.',
                            });
                        }
                    }

                    // 유저가 없거나 비밀번호가 없을 때
                    return done(null, false, {
                        message:
                            '가입되지 않은 회원이거나 비밀번호가 없습니다.',
                    });
                } catch (error) {
                    console.error(error);
                    return done(error);
                }
            }
        )
    );
};
