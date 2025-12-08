import express from 'express';
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  clapNews
} from '../controllers/newsController.js';
import { getCommentsForNews, createComment } from '../controllers/commentsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getNews)
  .post(protect, admin, createNews);

router.route('/:id')
  .get(getNewsById)
  .put(protect, admin, updateNews)
  .delete(protect, admin, deleteNews);

// Comments for a news article
router.route('/:id/comments')
  .get(getCommentsForNews)
  .post(protect, createComment);

router.route('/:id/clap')
  .post(protect, clapNews);

export default router;
