# Work-Hive Backend

## 🚀 Introduction
This is a Node.js and Express.js-based project that includes controllers, middleware, models, routes, and utilities for backend operations. It integrates with a frontend and is configured for deployment.

## 📌 Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (optional, for version control)
- [VS Code](https://code.visualstudio.com/) (recommended code editor)

👥 Frontend Repository

This project integrates with a frontend built using React. You can find the frontend repository here:
https://github.com/AngadSudan/work-hive#

## 📥 Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone <repository_url>
cd <project_directory>
```
### 2️⃣ Install Dependencies
```sh
npm install
```
### 3️⃣ Set Up Environment Variables
Create a `.env.local` file in the root directory and configure it as needed:
```sh
PORT=5000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/mydb
```

## 📂 Project Structure
```
project-folder/
│── controllers/        # Business logic
│── middlewares/        # Middleware functions
│── models/             # Database models
│── routes/             # API endpoints
│── utils/              # Helper functions
│── .env.local          # Environment variables
│── .gitignore          # Git ignored files
│── .prettierrc         # Prettier configuration
│── index.js            # Entry point
│── package.json        # Dependencies and scripts
│── vercel-server.js    # Vercel server configuration
│── vercel.json         # Deployment settings
```

## 🚀 Running the Project
### Start the Development Server
```sh
npm start
```
### Running in Development Mode
For auto-restart on file changes:
```sh
npm run dev
```
(Install `nodemon` globally if needed: `npm install -g nodemon`)

## 🚢 Deployment
This project is configured for deployment on **Vercel**.
### Steps:
1. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```
2. Deploy:
   ```sh
   vercel
   ```
3. Follow on-screen instructions.

## 📡 API Endpoints
Example API routes:
```sh
GET /api/tasks       # Fetch all tasks
POST /api/tasks      # Create a new task
PUT /api/tasks/:id   # Update a task
DELETE /api/tasks/:id # Delete a task
```

## 🤝 Contribution
- Fork the repository.
- Create a new branch.
- Make your changes.
- Submit a pull request.



