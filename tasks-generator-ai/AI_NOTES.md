# AI Notes

## LLM Provider
- **Provider**: Google Gemini (via Custom Integration) or OpenAI (configurable).
- **Why Chosen**: 
    - High reasoning capability for generating structured engineering tasks.
    - Cost-effective for development and scaling.
    - Strong JSON generation capabilities.

## AI Usage in Project
- **Spec Generation**: The AI is the core engine for generating User Stories, Engineering Tasks, and Risks based on user input.
- **Strict JSON Mode**: We enforce strict JSON output to ensure the frontend can reliably parse and render the data.
- **Reasoning**: The AI is prompted to act as a Senior PM and Tech Lead to break down high-level goals into actionable technical tasks.

## Verification & Validation
- **Manual Validation**: All AI-generated specs are presented to the user for editing. The user is the final validator.
- **No RAG**: Retrieval-Augmented Generation (RAG) was not used because the task generates *new* ideas based on user intent, rather than retrieving specific knowledge from a documentation base. The "context" is the user's filled form.

## Known Limitations
- The LLM may occasionally hallucinate incorrect technical terms if the domain is very niche.
- JSON parsing errors are handled, but rare edge cases in malformed JSON might require a retry.
