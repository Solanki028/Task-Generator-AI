const specService = require('../services/specService');

const generate = async (req, res) => {
    try {
        const { goal, users, constraints, templateType } = req.body;
        if (!goal || !users) {
            return res.status(400).json({ message: "Goal and Users are required" });
        }
        const spec = await specService.generateSpec({ goal, users, constraints, templateType });
        res.status(201).json(spec);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecent = async (req, res) => {
    try {
        const specs = await specService.getSpecs(req.query.limit);
        res.json(specs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOne = async (req, res) => {
    try {
        const spec = await specService.getSpecById(req.params.id);
        if (!spec) return res.status(404).json({ message: "Spec not found" });
        res.json(spec);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const spec = await specService.updateSpec(req.params.id, req.body);
        if (!spec) return res.status(404).json({ message: "Spec not found" });
        res.json(spec);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const spec = await specService.deleteSpec(req.params.id);
        if (!spec) return res.status(404).json({ message: "Spec not found" });
        res.json({ message: "Spec removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generate, getRecent, getOne, update, remove };
