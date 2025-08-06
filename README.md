# Job Portal App

A simple job portal where users can register, login, and manage jobs in different categories.

## How to Run

### 1. Clone the project
```bash
git clone https://github.com/mukit-abdullah/techFA.git
cd techFA
```

### 2. Start the backend
```bash
cd backend
npm install
npm start
```
Backend runs on: http://localhost:5000

### 3. Start the frontend
Open a new terminal:
```bash
cd job-portal
npm install
npm start
```
Frontend runs on: http://localhost:3000

### 4. Create .env file
Create a `.env` file in the `job-portal` folder:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_ACCESS_TOKEN_KEY=accessToken
```

## That's it!
Open http://localhost:3000 in your browser and start using the job portal.

## Features
- User registration and login
- Create, edit, and delete jobs
- 7 job categories
- Modern UI design
