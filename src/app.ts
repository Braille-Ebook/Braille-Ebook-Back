import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import sequelize from './sequelize';
import './models';

const app = express();

export const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('DB 동기화 완료');
    } catch (err) {
        console.error('DB 동기화 실패:', err);
    }
};

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET!,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    })
);

app.get('/', (req, res) => {
    res.send('Hello TypeScript Backend!');
});

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
};
app.use(errorHandler);

export default app;
