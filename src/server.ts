import app, { syncDB } from './app';

const PORT = process.env.PORT || 3000;

const start = async () => {
    await syncDB(); // DB 동기화 수행
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
};

start();
