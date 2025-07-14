import express from 'express';
import sequelize from './sequelize';
import './models';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello TypeScript Backend!');
});

export const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('DB 동기화 완료');
    } catch (err) {
        console.error('DB 동기화 실패:', err);
    }
};

export default app;
