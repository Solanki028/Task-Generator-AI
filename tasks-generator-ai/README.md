# Tasks Generator AI

A MERN stack application that uses Generative AI to create structured software specifications, user stories, and engineering tasks from high-level goals.

## Features

- **AI-Powered Spec Generation**: Turn a simple goal into a full technical plan.
- **Drag & Drop Organization**: Reorder and organize generated tasks.
- **Markdown Export**: Download your spec as a clean Markdown file.
- **History**: View your last 5 generated specs.
- **System Status**: Real-time health check for Backend, DB, and LLM.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI, @dnd-kit
- **Backend**: Node.js, Express, MongoDB
- **AI**: OpenAI / Gemini Integration

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- LLM API Key (OpenAI or Gemini)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd tasks-generator-ai
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file based on .env.example
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### Environment Variables

**Backend (.env)**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tasks-generator
LLM_API_KEY=your_api_key_here
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

## Usage

1. Open the frontend (http://localhost:5173).
2. Click "Generate New Spec".
3. Fill in the goal, users, and constraints.
4. Wait for the AI to generate the plan.
5. Edit tasks, drag to reorder.
6. Click "Export Markdown" to save.

## License
MIT
