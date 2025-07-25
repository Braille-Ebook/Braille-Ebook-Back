import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/user';

export const join = async (req: Request, res: Response, next: NextFunction) => {
    const { email, nick, password } = req.body;

    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.status(400).json({
                success: false,
                message: '이미 가입된 이메일입니다.',
            }); //유저 있으면 에러
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: '비밀번호는 6자 이상이어야 합니다.',
            }); //비밀번호 최소 6자
        }
        const hash = await bcrypt.hash(password, 12); //비밀번호 암호화

        await User.create({
            email,
            nickname: nick,
            password: hash,
            provider: 'local',
        }); //회원정보 저장

        return res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다.',
        });
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
                return res
                    .status(401)
                    .json({ success: false, message: info.message });
            }

            return req.login(user, (loginError) => {
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }

                const { user_id, email, nickname } = user as User;

                return res.status(200).json({
                    success: true,
                    message: '로그인 성공',
                    user: {
                        id: user_id,
                        email,
                        nickname,
                    },
                });
            });
        }
    )(req, res, next);
};

export const logout = (req: Request, res: Response) => {
    req.logout(() => {
        return res.status(200).json({
            success: true,
            message: '로그아웃 되었습니다.',
        });
    });
};
