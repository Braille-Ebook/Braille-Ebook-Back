import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/user';
import {
    generateCode,
    saveCodeToStore,
    checkCodeFromStore,
} from '../services/auth';
import { sendEmail } from '../utils/mailer';

export const join = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, email, nick, password } = req.body;
    try {
        if (!userId || userId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '아이디는 필수 입력 항목입니다.',
            });
        }

        if (!email || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '이메일은 필수 입력 항목입니다.',
            });
        }

        if (!nick || nick.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '닉네임은 필수 입력 항목입니다.',
            });
        }

        if (!password || password.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '비밀번호는 필수 입력 항목입니다.',
            });
        }

        const exId = await User.findOne({ where: { userId } });
        if (exId) {
            return res.status(409).json({
                success: false,
                message: '이미 사용중인 아이디입니다.',
            });
        }

        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.status(409).json({
                success: false,
                message: '이미 가입된 이메일입니다.',
            });
        }

        const exNick = await User.findOne({ where: { nickname: nick } });
        if (exNick) {
            return res.status(409).json({
                success: false,
                message: '이미 사용 중인 닉네임입니다.',
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: '비밀번호는 6자 이상이어야 합니다.',
            }); //비밀번호 최소 6자
        }
        const hash = await bcrypt.hash(password, 12); //비밀번호 암호화

        await User.create({
            userId,
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

                const { user_id, userId, email, nickname } = user as User;

                return res.status(200).json({
                    success: true,
                    message: '로그인 성공',
                    user: {
                        id: user_id,
                        userId,
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

export const sendVerificationCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;
        const code = generateCode();
        saveCodeToStore(email, code); //map에 저장
        await sendEmail(email, code); //이메일 전송
        return res.status(200).json({
            success: true,
            message: '인증 코드 전송이 완료되었습니다.',
        });
    } catch (err) {
        return next(err);
    }
};

export const verifyCode = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, code } = req.body;
        const result = checkCodeFromStore(email, code);
        if (result == 'expired') {
            return res.status(400).json({
                success: false,
                message: '인증 코드가 만료되었습니다.',
            });
        }
        if (result == 'invalid') {
            return res.status(400).json({
                success: false,
                message: '인증 코드가 일치하지 않습니다.',
            });
        }
        return res.status(200).json({
            success: true,
            message: '인증 성공되었습니다.',
        });
    } catch (err) {
        return next(err);
    }
};

export const findIdByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                success: false,
                message: '이메일을 올바르게 입력해주세요.',
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '해당 이메일로 가입된 계정이 없습니다.',
            });
        }

        return res.status(200).json({
            success: true,
            userId: user.userId,
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

export const findEmailById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.body;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                success: false,
                message: '아이디를 올바르게 입력해주세요.',
            });
        }

        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '해당 아이디로 가입된 계정이 없습니다.',
            });
        }

        return res.status(200).json({
            success: true,
            email: user.email,
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

export const sendTempPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '해당 이메일로 가입된 유저가 없습니다.',
            });
        }

        const tempPassword = generateCode();
        const hashed = await bcrypt.hash(tempPassword, 12);
        await user.update({ password: hashed });

        await sendEmail(email, tempPassword, true);
        return res.status(200).json({
            success: true,
            message: '임시 비밀번호가 전송되었습니다.',
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userPk = (req.user as User).user_id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.',
            });
        }

        const user = await User.findByPk(userPk);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '유저를 찾을 수 없습니다.',
            });
        }
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: '비밀번호 정보가 없습니다.',
            });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: '현재 비밀번호가 일치하지 않습니다.',
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: '비밀번호는 최소 6자 이상입니다.',
            });
        }

        if (user.provider !== 'local') {
            return res.status(403).json({
                success: false,
                message: '소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.',
            });
        }

        const hashed = await bcrypt.hash(newPassword, 12);
        await user.update({ password: hashed });

        return res.status(200).json({
            success: true,
            message: '비밀번호가 성공적으로 변경되었습니다.',
        });
    } catch (err) {
        next(err);
    }
};
