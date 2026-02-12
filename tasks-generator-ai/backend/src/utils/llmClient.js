const OpenAI = require('openai');


const generateCompletion = async (systemPrompt, userPrompt, temperature = 0.4) => {
    const apiKey = process.env.LLM_API_KEY;

    if (!apiKey) {
        throw new Error("LLM_API_KEY is missing in environment variables.");
    }

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.groq.com/openai/v1"
    });

    try {
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: temperature,
            response_format: { type: "json_object" },
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error("Failed to communicate with Groq API: " + (error.message || "Unknown error"));
    }
};

module.exports = { generateCompletion }
