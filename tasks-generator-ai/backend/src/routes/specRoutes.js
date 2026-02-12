const express = require('express');
const router = express.Router();
const specController = require('../controllers/specController');

router.post('/generate', specController.generate);
router.get('/', specController.getRecent);
router.get('/:id', specController.getOne);
router.put('/:id', specController.update);
router.delete('/:id', specController.remove);

// Debug route
router.get('/debug/models', async (req, res) => {
    try {
        const apiKey = process.env.LLM_API_KEY;
        console.log("Debug Route - API Key Present:", !!apiKey);
        if (apiKey) console.log("Debug Route - API Key Start:", apiKey.substring(0, 5));

        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test");
        const response = await result.response;
        res.json({ message: "Success", text: response.text() });
    } catch (error) {
        res.status(500).json({ message: error.message, details: error });
    }
});

module.exports = router;
