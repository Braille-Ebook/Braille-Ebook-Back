import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, code: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"BrailleEbook" <${process.env.MAIL_USER}>`,
        to,
        subject: '📧 이메일 인증 코드',
        text: `인증 코드는 [${code}] 입니다.\n5분 이내에 입력해주세요.`,
    };

    await transporter.sendMail(mailOptions);
};
