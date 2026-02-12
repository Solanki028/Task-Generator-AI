const Spec = require('../models/Spec');
const { generateCompletion } = require('../utils/llmClient');

const generateSpec = async (data) => {
    const { goal, users, constraints, templateType } = data;

    const systemPrompt = `
You are a Senior Product Manager & Tech Lead.
Your task is to generate a structured software specification based on the user's input.
You must return ONLY valid JSON matching this structure:
{
  "userStories": ["As a user, I want..."],
  "tasks": [
    { "id": "t1", "title": "Task title", "group": "Backend", "order": 1, "completed": false }
  ],
  "risks": ["Risk 1", "Risk 2"]
}
Ensure tasks are grouped logically (e.g., Setup, Backend, Frontend).
  `;

    const userPrompt = `
Goal: ${goal}
Target Users: ${users}
Constraints: ${constraints}
Template Type: ${templateType}
  `;

    try {
        const result = await generateCompletion(systemPrompt, userPrompt);
        const parsedResult = JSON.parse(result);

        // Validate structure (basic check)
        if (!parsedResult.userStories || !parsedResult.tasks) {
            throw new Error("Invalid format received from LLM");
        }

        // Create new Spec in DB
        const newSpec = new Spec({
            title: goal.substring(0, 50) + (goal.length > 50 ? "..." : ""),
            goal,
            users,
            constraints,
            templateType,
            userStories: parsedResult.userStories,
            tasks: parsedResult.tasks.map((t, idx) => ({ ...t, id: `task-${Date.now()}-${idx}`, order: idx })),
            risks: parsedResult.risks
        });

        await newSpec.save();
        return newSpec;

    } catch (error) {
        console.error("Spec Generation Error:", error);
        throw error;
    }
};

const getSpecs = async (limit = 5) => {
    return await Spec.find().sort({ createdAt: -1 }).limit(parseInt(limit));
};

const getSpecById = async (id) => {
    return await Spec.findById(id);
};

const updateSpec = async (id, data) => {
    return await Spec.findByIdAndUpdate(id, data, { new: true });
};

const deleteSpec = async (id) => {
    return await Spec.findByIdAndDelete(id);
};

module.exports = { generateSpec, getSpecs, getSpecById, updateSpec, deleteSpec };
