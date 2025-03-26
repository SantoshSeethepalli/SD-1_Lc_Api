import express from 'express';
import { getTotalSolved, getRanking, getMostRecentlySolvedQuestions, getDifficultyWiseStats } from '../controllers/statsController.js';
import limiter from '../middleware/rateLimiting.js'; // Use the pre-initialized limiter

const router = express.Router();

router.get('/getTotalSolved/:username', limiter, getTotalSolved);
router.get('/geRanking/:username', limiter, getRanking);
router.get('/getMostRecentlySolvedQuestions/:username', limiter, getMostRecentlySolvedQuestions);
router.post('/getDifficultyWiseStats/:username', limiter, getDifficultyWiseStats);

export default router;