# Backend & Frontend Integration Guide

## Overview
This guide walks you through integrating the sentiment-hedge-fund-simulator backend (FastAPI) with the frontend (Next.js).

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│  Frontend (Next.js)                 │
│  Port: 3000                         │
│  - React Components                 │
│  - TailwindCSS UI                   │
└──────────┬──────────────────────────┘
           │
           │ API Calls (HTTP)
           │ Base URL: http://localhost:8000
           ▼
┌─────────────────────────────────────┐
│  Backend (FastAPI)                  │
│  Port: 8000                         │
│  - News Fetching                    │
│  - Sentiment Analysis               │
│  - Strategy Simulation              │
│  - XAI Explanations                 │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  PostgreSQL Database                │
│  Port: 5432                         │
│  - News & Sentiment Data            │
│  - Historical Data                  │
└─────────────────────────────────────┘
```

---

## 📋 Prerequisites

### Backend Requirements
- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

### Frontend Requirements
- Node.js 18+
- npm or yarn

---

## 🚀 Step 1: Setup Backend

### 1.1 Navigate to Backend Directory
```powershell
cd backend
```

### 1.2 Create Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 1.3 Install Dependencies
```powershell
pip install -r requirements.txt
```

### 1.4 Configure Environment Variables
```powershell
# Copy the example env file
Copy-Item .env.example .env.local

# Edit .env.local with your database credentials
# Update DATABASE_URL with your PostgreSQL connection string
```

### 1.5 Initialize Database
```powershell
# Run any database migrations/setup scripts if available
# This depends on your db initialization approach
```

### 1.6 Start Backend Server
```powershell
uvicorn main:app --reload --port 8000
```

✅ Backend should now be running at `http://localhost:8000`

Visit `http://localhost:8000/docs` to see the interactive API documentation.

---

## 🎨 Step 2: Setup Frontend

### 2.1 Navigate to Frontend Directory
```powershell
cd frontend/hedgefundsim
```

### 2.2 Install Dependencies
```powershell
npm install
```

### 2.3 Configure Environment Variables
```powershell
# Copy the example env file
Copy-Item .env.local.example .env.local

# The default is already set to http://localhost:8000
# Modify if your backend runs on a different port
```

### 2.4 Start Frontend Development Server
```powershell
npm run dev
```

✅ Frontend should now be running at `http://localhost:3000`

---

## 🔗 API Endpoints Integration

The frontend communicates with the backend through these endpoints:

### News API
```
GET /fetch_news/{ticker}?days=7
```
Returns recent news articles for a given ticker.

**Frontend Usage:**
```typescript
import { fetchNews } from '../lib/api';
const news = await fetchNews('AAPL', 7);
```

---

### Sentiment Analysis
```
GET /sentiment_score/{ticker}?days=30
```
Returns average sentiment score for a ticker.

**Frontend Usage:**
```typescript
import { fetchSentimentScore } from '../lib/api';
const sentiment = await fetchSentimentScore('AAPL', 30);
```

---

### Market Mood
```
GET /market_mood/{ticker}?days=30
```
Returns dominant market sentiment mood.

**Frontend Usage:**
```typescript
import { fetchMarketMood } from '../lib/api';
const mood = await fetchMarketMood('AAPL', 30);
```

---

### Strategy Simulation
```
POST /simulate_strategy
Content-Type: application/json

{
  "ticker": "AAPL",
  "start": "2025-10-01",
  "end": "2025-11-12"
}
```

Returns backtesting results with price history, transactions, and metrics.

**Frontend Usage:**
```typescript
import { runSimulation } from '../lib/api';
const results = await runSimulation('AAPL', '2025-10-01', '2025-11-12');
```

---

### XAI Explanations
```
GET /xai/{ticker}
```
Returns explainable AI insights for trading decisions.

**Frontend Usage:**
```typescript
import { fetchXAI } from '../lib/api';
const xai = await fetchXAI('AAPL');
```

---

## 📝 API Client (`lib/api.ts`)

All API calls are centralized in `frontend/hedgefundsim/lib/api.ts`:

```typescript
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function fetchNews(ticker: string, days: number = 7) { ... }
export async function fetchSentimentScore(ticker: string, days: number = 30) { ... }
export async function fetchMarketMood(ticker: string, days: number = 30) { ... }
export async function runSimulation(ticker: string, start: string, end: string) { ... }
export async function fetchXAI(ticker: string) { ... }
```

**To change the API base URL:**
1. Edit `.env.local` in the frontend directory
2. Change `NEXT_PUBLIC_API_BASE` to your backend URL

---

## 🧪 Testing the Integration

### 1. Open Frontend in Browser
Navigate to `http://localhost:3000`

### 2. Select a Ticker
Choose from the dropdown (AAPL, TSLA, GOOGL)

### 3. Click "Run Simulation"
This triggers:
- Sentiment analysis over the past 30-60 days
- Strategy backtesting
- XAI keyword extraction

### 4. View Results
- Portfolio metrics (ROI, Max Drawdown, Current Value)
- Price history chart with sentiment overlay
- XAI keywords explaining the strategy

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend
**Error:** `Failed to fetch` or CORS errors

**Solutions:**
1. Check backend is running: `http://localhost:8000/docs`
2. Verify `NEXT_PUBLIC_API_BASE` in `.env.local`
3. Ensure CORS is enabled in backend (already configured)
4. Check no port conflicts:
   - Backend: 8000
   - Frontend: 3000
   - Database: 5432

---

### Backend Returns 500 Errors
**Solutions:**
1. Check database connection: Update DATABASE_URL in `.env.local`
2. Verify all required Python packages are installed
3. Check backend logs for specific error messages
4. Ensure PostgreSQL is running

---

### Database Connection Failed
**Solutions:**
1. Verify PostgreSQL is running
2. Check credentials in DATABASE_URL
3. Create database if it doesn't exist:
   ```sql
   CREATE DATABASE sentiment_db;
   ```
4. Verify user permissions

---

## 📦 Deployment

### Backend Deployment (e.g., Heroku, AWS, Railway)

1. Set environment variables on your hosting platform
2. Update `DATABASE_URL` to production database
3. Deploy the `backend` folder

Example Procfile for Heroku:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend Deployment (e.g., Vercel, Netlify)

1. Set `NEXT_PUBLIC_API_BASE` to production backend URL
2. Deploy the `frontend/hedgefundsim` folder
3. Vercel: Connect GitHub repo and auto-deploy

---

## 📊 File Structure Reference

```
sentiment-hedge-fund-simulator/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example              # Environment variables template
│   ├── db/
│   │   ├── db_connect.py         # Database connection
│   │   ├── models.py             # SQLAlchemy models
│   │   ├── keywords.py           # Keyword operations
│   │   └── __init__.py
│   ├── sentiment/
│   │   ├── fetch_news.py         # News fetching logic
│   │   ├── sentiment_model.py    # Sentiment analysis
│   │   └── __init__.py
│   ├── strategy/
│   │   ├── backtest.py           # Backtesting engine
│   │   ├── explainable_ai.py     # SHAP/XAI logic
│   │   └── __init__.py
│   └── run_full_pipeline.py      # End-to-end pipeline
│
├── frontend/
│   └── hedgefundsim/             # Next.js app
│       ├── package.json
│       ├── .env.local.example    # Environment variables template
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── app/
│       │   ├── page.tsx          # Main dashboard
│       │   ├── layout.tsx        # Root layout
│       │   ├── globals.css       # Global styles
│       │   ├── components/       # React components
│       │   │   ├── Header.tsx
│       │   │   ├── StockSelector.tsx
│       │   │   ├── PortfolioSummary.tsx
│       │   │   ├── MarketChart.tsx
│       │   │   └── XAICard.tsx
│       │   ├── admin/            # Admin pages
│       │   ├── login/            # Auth pages
│       │   ├── mood/             # Market mood page
│       │   ├── profile/          # Profile pages
│       │   └── ticker/           # Ticker detail page
│       └── lib/
│           ├── api.ts            # API client
│           └── types.ts          # TypeScript types
```

---

## ✅ Checklist

- [ ] Backend running on `http://localhost:8000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] PostgreSQL database created and accessible
- [ ] Environment variables configured
- [ ] API endpoints responding correctly
- [ ] Frontend can fetch ticker data
- [ ] Simulation runs without errors
- [ ] UI displays results correctly

---

## 🔗 Useful Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Next.js Docs:** https://nextjs.org/docs
- **SQLAlchemy:** https://docs.sqlalchemy.org/
- **TailwindCSS:** https://tailwindcss.com/docs
- **React:** https://react.dev/

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review the API documentation at `/docs` (FastAPI)
3. Check console logs in browser DevTools (Frontend)
4. Check terminal output (Backend)

---

**Happy Hedging! 📈**
