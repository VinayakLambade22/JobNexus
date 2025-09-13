# JobNexus

A full-stack social media application built with a Node.js and Express backend, and a Next.js and React frontend. It allows users to connect, share posts, and interact with each other in a simple and intuitive way.

## Key Features

*   **User Authentication:** Sign up and log in to access the platform.
*   **User Profiles:** Create and manage your own user profile.
*   **View User Profiles:** View the profiles of other users on the platform.
*   **Connections:** Connect with other users to build your network.
*   **Discover:** Discover new users and content on the platform.
*   **Posts:** Create and view posts.

## Technologies Used

### Backend

*   Node.js
*   Express
*   MongoDB
*   Mongoose
*   Cloudinary (for image storage)

### Frontend

*   Next.js
*   React
*   Redux

## Getting Started

### Prerequisites

*   Node.js and npm installed
*   MongoDB account and connection string

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with the following variables:
    ```
    MONGO_URL=<your_mongodb_connection_string>
    PORT=5000
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

The application will be accessible at `http://localhost:3000`.

