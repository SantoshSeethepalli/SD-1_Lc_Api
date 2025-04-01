import axios from 'axios';
import redisCache from './redisServices.js';

const fetchLeetCodeStats = async (username) => {
    const cacheKey = `leetcode-${username}`;
    const cacheValue = await redisCache.get(cacheKey);
    if(cacheValue) {
        console.log("Cache hit for Leetcode data");
        return JSON.parse(cacheValue);
    }
    try {
        const url = `https://leetcode-api-faisalshohag.vercel.app/${username}`;

        const response = await axios.get(url);

        if (response.data.errors) {
            console.log("LeetCode API responded with errorr: username not found");
            return null;
        }

        await redisCache.set(cacheKey, JSON.stringify(response.data), "EX", 60 * 60 * 24); // 24 hours
        
        return response.data;
    } catch (error) {
        console.log("Catch fetching Leetcode data:", error);
        return null;
    }
};

export { fetchLeetCodeStats };