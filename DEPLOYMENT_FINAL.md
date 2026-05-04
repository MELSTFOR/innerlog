# Deployment Guide for INNERLOG

## Frontend (Vercel) ✅ DEPLOYED

- URL: https://innerlog-omega.vercel.app
- Status: Live and running

## Backend (Node.js API)

### Option 1: Deploy to Render.com (Recommended)

1. **Create GitHub Account** (if you don't have one)
   - Go to https://github.com/signup
   - Create new account

2. **Create GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `innerlog`
   - Make it Public
   - Click "Create repository"

3. **Push Code to GitHub** (from PowerShell)
   ```powershell
   cd c:\Users\Usuario\Desktop\INNERLOG
   git remote add origin https://github.com/YOUR_USERNAME/innerlog.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy to Render.com**
   - Go to https://render.com
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub account
   - Select `innerlog` repository
   - Fill form:
     - **Name**: innerlog-api
     - **Root Directory**: (leave empty)
     - **Build Command**: `npm install && cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Environment Variables**:
       - `DATABASE_URL`: `postgresql://neondb_owner:npg_CZ2cOtTKo4dU@ep-broad-paper-amaiubk7.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require`
       - `JWT_SECRET`: `innerlog_jwt_secret_2026_production_key_very_secure_random_string_12345`
       - `FRONTEND_URL`: `https://innerlog-omega.vercel.app`
       - `NODE_ENV`: `production`
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy the Render URL (format: https://innerlog-api-xxx.onrender.com)

5. **Update Vercel Environment**
   - Go to https://vercel.com/dashboard
   - Click on `innerlog` project
   - Go to "Settings" → "Environment Variables"
   - Add: `VITE_API_URL` = `https://innerlog-api-xxx.onrender.com` (use your actual Render URL)
   - Click "Save"
   - Vercel will auto-redeploy

## Database (Neon PostgreSQL) ✅ CREATED

- Status: Schema and seed data created
- Tables: usuarios, equipos, sesiones_entrenamiento, wellness_entries, test_sessions, readiness_scores, retos, kudos

## Testing Credentials

**Athlete (Melina Forgiarini)**
- Email: melina@fila.com
- Password: running123

**Coach (Pedro)**
- Email: pedro@fila.com
- Password: running123

## Demo URLs

Once deployed:
- Frontend: https://innerlog-omega.vercel.app
- Backend: https://innerlog-api-xxx.onrender.com/health (replace xxx with your Render service ID)
