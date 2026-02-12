# Prompts Used

## Spec Generation Prompt

**Role**: Senior Product Manager & Tech Lead.

**Input**:
- Goal: {goal}
- Target Users: {users}
- Constraints: {constraints}
- Template Type: {templateType}

**Task**:
Generate a structured software specification based on the input.
Break down the work into:
1. User Stories (Functional requirements)
2. Engineering Tasks (Technical implementation steps, grouped by component/phase)
3. Risks / Unknowns (Potential pitfalls)

**Output Format**:
You must return ONLY valid JSON. No markdown formatting, no conversational text.

```json
{
  "userStories": [
    "As a user, I want..."
  ],
  "tasks": [
    {
      "title": "Create database schema",
      "group": "Backend",
      "order": 1
    },
    {
      "title": "Setup React router",
      "group": "Frontend",
      "order": 1
    }
  ],
  "risks": [
    "Risk description..."
  ]
}
```

**Constraints**:
- Be specific and technical.
- Group tasks logically (e.g., "Setup", "Backend", "Frontend", "Testing").
- Return strictly valid JSON.

---

## Status Check Prompt

**Task**: Respond with a simple "ok" to verify LLM connectivity.
