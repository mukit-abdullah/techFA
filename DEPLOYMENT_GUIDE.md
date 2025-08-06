# 🚀 Job Portal Deployment Guide - Vercel

## Quick Deploy Steps

### Step 1: Push to GitHub
1. Add backend folder to git:
   ```bash
   git add backend/
   git add vercel.json
   git commit -m "Add backend and vercel config"
   git push
   ```

### Step 2: Deploy to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Sign up/login with GitHub
3. Click "Import Git Repository"
4. Select your job-portal repository
5. Click "Import"

### Step 3: Configure Deployment
- **Project Name**: job-portal (or your choice)
- **Framework**: Create React App
- **Root Directory**: Leave default
- **Build Command**: Auto-detected from vercel.json
- **Output Directory**: Auto-detected

### Step 4: Environment Variables
Add these in Vercel dashboard:
```
NODE_ENV=production
JWT_SECRET=your-random-secret-key-here
PORT=3000
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Get your live URL: `https://your-app-name.vercel.app`

## What You Get
✅ **Frontend**: React job portal interface  
✅ **Backend**: Node.js API at `/api/*` endpoints  
✅ **Full Features**: Login, register, job CRUD operations  
✅ **Live Link**: Shareable with others  

## File Structure
```
job-portal/
├── job-portal/          # React frontend
├── backend/             # Node.js API
├── vercel.json          # Deployment config
└── DEPLOYMENT_GUIDE.md  # This guide
```

## API Endpoints (Live)
- `POST /api/sign_up` - Register
- `POST /api/sign_in` - Login  
- `GET /api/jobs` - Get jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

## Features Working Live
- ✅ User authentication (JWT)
- ✅ Job categories (7 categories)
- ✅ Add jobs to specific categories
- ✅ Edit/update jobs
- ✅ Delete jobs
- ✅ Responsive UI
- ✅ Professional design

Your job portal is now ready for deployment! 🎉
