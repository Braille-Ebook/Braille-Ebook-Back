import { RequestHandler } from 'express';

const renderMain: RequestHandler = async (req, res) => {
    res.send('Hello TypeScript Backend!');
};

export { renderMain };
