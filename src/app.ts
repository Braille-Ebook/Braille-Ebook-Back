import express from 'express';
import sequelize from './sequelize';
import './models';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello TypeScript Backend!');
});

const startServer = async () => {
    try {
        await sequelize.sync({ alter: true }); // DB 테이블 동기화
        console.log('DB 동기화 완료');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('DB 동기화 실패:', error);
        process.exit(1);
    }
};

startServer();

export default app;
