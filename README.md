# AI Chat Application

This is a full-stack chat application with a React frontend and a Node.js backend, powered by large language models.

## Backend

The backend is a Node.js application using Express.js and Mongoose. It handles user authentication, and chat functionality with AI models.

### Technologies Used

- Node.js
- Express.js
- Mongoose
- Clerk (for authentication)
- Google Generative AI
- OpenAI

### Getting Started

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** and add the necessary environment variables (see the "Environment Variables" section).

4. **Start the server:**
   ```bash
   npm start
   ```

## Frontend

The frontend is a React application built with Vite. It provides the user interface for the chat application.

### Technologies Used

- React
- Vite
- Clerk (for authentication)
- react-markdown

### Getting Started

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

The backend requires the following environment variables to be set in a `.env` file in the `backend` directory:

- `MONGODB_URI`: The connection string for your MongoDB database.
- `CLERK_SECRET_KEY`: Your Clerk secret key for authentication.
- `OPENAI_API_KEY`: Your OpenAI API key.

The frontend requires the following environment variables to be set in a `.env.local` file in the `frontend` directory:

- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.
