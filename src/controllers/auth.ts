import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/user';

export const join = async (req: Request, res: Response, next: NextFunction) => {
    const { email, nick, password } = req.body;

    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/join?error=exist'); //유저 있으면 에러
        }

        const hash = await bcrypt.hash(password, 12); //비밀번호 암호화

        await User.create({
            email,
            nickname: nick,
            password: hash,
            provider: 'local',
        }); //회원정보 저장

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
        'local',
        (
            authError: Error | null,
            user: Express.User | false, //로그인 성공 시 req.user = user로 Express에 등록됨
            info: { message: string }
        ) => {
            if (authError) {
                console.error(authError);
                return next(authError);
            }

            if (!user) {
                return res.redirect(`/?loginError=${info.message}`);
            }

            return req.login(user, (loginError) => {
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }

                return res.redirect('/');
            });
        }
    )(req, res, next);
};

export const logout = (req: Request, res: Response) => {
    req.logout(() => {
        res.redirect('/');
    });
};
