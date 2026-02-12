const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    group: { type: String, required: true },
    order: { type: Number, required: true },
    completed: { type: Boolean, default: false }
});

const SpecSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Usually derived from goal
    goal: { type: String, required: true },
    users: { type: String, required: true },
    constraints: { type: String },
    templateType: { type: String, default: 'general' },
    userStories: [{ type: String }],
    tasks: [TaskSchema],
    risks: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Spec', SpecSchema);
