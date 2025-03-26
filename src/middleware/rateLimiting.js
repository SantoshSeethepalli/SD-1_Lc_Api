import { rateLimit } from 'express-rate-limit';

// Initialize the rate limiter once during app initialization
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // time in ms
	limit: 15, // Limit each IP to 'x'(15) requests per `window`
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers eg:
    message: "Too many requests. Please try again later.",
    handler: (req, res) => { 
		res.status(429).json({ error: "Too many requests. Please try again later." }); 
	},
    keyGenerator: (req) => req.ip, // using clients IP address as the key, for rate limiting.
});

export default limiter;