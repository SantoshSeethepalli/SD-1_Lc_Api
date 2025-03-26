import { fetchLeetCodeStats } from '../services/leetCodeService.js';

const getTotalSolved = async (req, res) => {
    const { username } = req.params;

    try {
        const data = await fetchLeetCodeStats(username);
        if(!data) {
            return res.status(404).json({ error: "Error fetching details" });
        }

        const totalSolved = data.totalSolved;
        if(!totalSolved) {
            return res.status(404).json({ error: "Error fetching total solved" });
        }

        const totalSubmissions = data.totalSubmissions.find(item => item.difficulty === "All").submissions;
        if(!totalSubmissions) {
            return res.status(404).json({ error: "Error fetching total submissions" });
        }

        const susscessRate = ((totalSolved / totalSubmissions) * 100).toFixed(2);
        
        res.status(200).json({ totalSolved, totalSubmissions, susscessRate });

    } catch(err) {
        console.log("Error fetching stats: ", err);
        return res.status(500).json({ error: "Error fetching details" });
    }
};

const getRanking = async(req, res) => {
    try {
        const {username} = req.params;

        const data = await fetchLeetCodeStats(username);
        if(!data) {
            return res.status(404).json({ error: "Error fetching details" });
        }

        const ranking = data.ranking;
        if(!ranking) {
            return res.status(404).json({ error: "Error fetching ranking" });
        }

        return res.status(200).json({ ranking });
    } catch(err) {
        console.log("Error fetching ranking: ", err);
        return res.status(500).json({ error: "Error fetching details" });
    }
};

const getMostRecentlySolvedQuestions = async(req, res) => {
    const { username } = req.params;
    const { c } = req.query;

    try {
        const data = await fetchLeetCodeStats(username);
        if(!data) {
            return res.status(404).json({ error: "Error fetching details" });
        }

        if(!data.recentSubmissions) {
            return res.status(404).json({ error: "Error fetching recent submissions" });
        }

        const limitCount = c || 10;

        const recentSolvedSlice = data.recentSubmissions.slice(0, limitCount);
        
        const recentSolvedData = recentSolvedSlice.map(item => ({
            title: item.title,
            difficulty: item.difficulty,
            status: item.statusDisplay,
            programming_language: item.lang,
        }));
        
        res.status(200).json({ recentSolvedData });
    } catch (err) {
        console.log("Error fetching recent solved questions: ", err);
        return res.status(500).json({ error: "Error fetching details" });
    }
};

const getDifficultyWiseStats = async(req, res) => {
    const { username } = req.params;
    const { difficulty } = req.body;

    if (!difficulty || typeof difficulty !== 'string') {
        return res.status(400).json({ error: "Invalid or missing 'difficulty' property in request body" });
    }

    try {
        const data = await fetchLeetCodeStats(username);
        if(!data || !data.totalSubmissions) {
            return res.status(404).json({ error: "Error fetching details" });
        }

        const requestedDifficultyStats = data.totalSubmissions.find(item => item.difficulty === difficulty);
        if(!requestedDifficultyStats) {
            return res.status(404).json({ error: "Error fetching requested difficulty stats" });
        }

        const difficultyWiseStats = data.totalSubmissions.map(item => ({
            requestedDifficulty: item.difficulty,
            count: item.count,
            submissions: item.submissions,
            susscessSubmissionRate: ((item.count / item.submissions) * 100).toFixed(2),
        }));
        
        res.status(200).json({ difficultyWiseStats });
    } catch (err) {
        console.log("Error fetching difficulty wise stats: ", err);
        return res.status(500).json({ error: "Error fetching details" });
    }
};

export { getTotalSolved, getRanking, getMostRecentlySolvedQuestions, getDifficultyWiseStats };