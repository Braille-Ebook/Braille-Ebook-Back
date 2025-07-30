import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { Op } from 'sequelize';

export default () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'identifier', // 이메일 또는 아이디
                passwordField: 'password',
                passReqToCallback: false,
            },
            async (identifier, password, done) => {
                try {
                    // provider가 'local'인 사용자 중 identifier가 userId 또는 email인 사용자 찾기
                    const exUser = await User.findOne({
                        where: {
                            provider: 'local',
                            [Op.or]: [
                                { userId: identifier },
                                { email: identifier },
                            ],
                        },
                    });

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

                    return done(null, false, {
                        message: '가입되지 않은 회원입니다.',
                    });
                } catch (error) {
                    console.error(error);
                    return done(error);
                }
            }
        )
    );
};
