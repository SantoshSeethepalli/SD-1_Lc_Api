import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import limiter from './src/middleware/rateLimiting.js';
import statsRoutes from './src/routes/statsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Apply the rate limiter middleware globally or to specific routes
app.use(limiter);

app.use("/leetcode", statsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running, test API's at http://localhost:${PORT}/leetcode/`);
});