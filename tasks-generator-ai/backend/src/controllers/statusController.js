const mongoose = require('mongoose');
const { generateCompletion } = require('../utils/llmClient');

const checkStatus = async (req, res) => {
    const status = {
        backend: "ok",
        database: "unknown",
        llm: "unknown"
    };

    // Check DB
    try {
        if (mongoose.connection.readyState === 1) {
            status.database = "ok";
        } else {
            status.database = "disconnected";
        }
    } catch (e) {
        status.database = "error";
    }

    // Check LLM
    try {
        await generateCompletion("You are a ping bot. Return a JSON object with a key 'message' and value 'pong'.", "Ping", 0.1); // Small cheap call
        status.llm = "ok";
    } catch (e) {
        status.llm = "error";
    }

    res.json(status);
};

module.exports = { checkStatus };
