import express from 'express';
import {
    getBookInfo,
    addBookMark,
    deleteBookMark,
    startRead,
    getProgress,
} from '../controllers/book';
import { isLoggedIn } from '../middlewares/index';

const router = express.Router();

router.get('/:bookId', getBookInfo);
router.post('/:bookId/bookmark', isLoggedIn, addBookMark);
router.delete('/:bookId/bookmark', isLoggedIn, deleteBookMark);
router.post('/:bookId/start', isLoggedIn, startRead);
router.get('/:bookId/progress', isLoggedIn, getProgress);

export default router;
