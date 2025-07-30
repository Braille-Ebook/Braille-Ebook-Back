import nodemailer from 'nodemailer';

export const sendEmail = async (
    to: string,
    content: string,
    isTemp: boolean = false
) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const subject = isTemp ? '🔑 임시 비밀번호 안내' : '📧 이메일 인증 코드';
    const text = isTemp
        ? `요청하신 임시 비밀번호는 [${content}] 입니다.\n로그인 후 반드시 비밀번호를 변경해주세요.`
        : `인증 코드는 [${content}] 입니다.\n5분 이내에 입력해주세요.`;
    const mailOptions = {
        from: `"BrailleEbook" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};
