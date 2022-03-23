import rateLimit from "express-rate-limit";

const rateLimiter = () => rateLimit({
    windowMs: 1000 * 60 * 10,
    max: 1000,
});

export default rateLimiter;

