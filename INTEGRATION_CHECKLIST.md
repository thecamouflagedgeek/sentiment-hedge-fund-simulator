# Backend & Frontend Integration Checklist

## Pre-Integration Setup ✓

### Backend Setup
- [ ] Python 3.8+ installed
- [ ] PostgreSQL running and accessible
- [ ] Backend virtual environment created
- [ ] All Python dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env.local` file created with database credentials
- [ ] Database initialized/migrations run

### Frontend Setup
- [ ] Node.js 18+ installed
- [ ] npm dependencies installed (`npm install`)
- [ ] `.env.local` file created with `NEXT_PUBLIC_API_BASE`

---

## Server Startup Verification ✓

### Backend Server
- [ ] Backend server starts without errors
  ```
  Command: uvicorn main:app --reload --port 8000
  Expected: "Uvicorn running on http://127.0.0.1:8000"
  ```
- [ ] API documentation is accessible at `http://localhost:8000/docs`
- [ ] Health check endpoint responds (`http://localhost:8000/`)

### Frontend Server
- [ ] Frontend server starts without errors
  ```
  Command: npm run dev
  Expected: "▲ Next.js X.X.X - Local: http://localhost:3000"
  ```
- [ ] Frontend loads at `http://localhost:3000`
- [ ] No console errors in browser DevTools

---

## API Connectivity ✓

### CORS Configuration
- [ ] Backend CORS middleware is configured
- [ ] Frontend can make cross-origin requests

### Environment Variables
- [ ] `NEXT_PUBLIC_API_BASE` is set to `http://localhost:8000`
- [ ] Backend can access database via `DATABASE_URL`

---

## Endpoint Testing ✓

### 1. News Endpoint
**Test URL:** `GET http://localhost:8000/fetch_news/AAPL?days=7`

- [ ] Backend responds with 200 status
- [ ] Response includes news data or empty array
- [ ] Response format matches expected schema

### 2. Sentiment Score Endpoint
**Test URL:** `GET http://localhost:8000/sentiment_score/AAPL?days=30`

- [ ] Backend responds with 200 status
- [ ] Response includes sentiment score
- [ ] Score is numeric value

### 3. Market Mood Endpoint
**Test URL:** `GET http://localhost:8000/market_mood/AAPL?days=30`

- [ ] Backend responds with 200 status
- [ ] Response includes dominant mood
- [ ] Mood is one of: Positive, Negative, Neutral

### 4. Simulation Endpoint
**Test URL:** `POST http://localhost:8000/simulate_strategy`
**Body:**
```json
{
  "ticker": "AAPL",
  "start": "2025-10-01",
  "end": "2025-11-12"
}
```

- [ ] Backend responds with 200 status
- [ ] Response includes price_history array
- [ ] Response includes transactions array
- [ ] Response includes metrics object

### 5. XAI Endpoint
**Test URL:** `GET http://localhost:8000/xai/AAPL`

- [ ] Backend responds with 200 status
- [ ] Response includes explanations/keywords
- [ ] Keywords have relevance scores

---

## Frontend Integration Testing ✓

### Page Load
- [ ] Dashboard loads at `http://localhost:3000`
- [ ] Header displays correctly
- [ ] Stock selector dropdown is populated
- [ ] Run Simulation button is disabled until ticker selected
- [ ] No errors in browser console

### Stock Selection
- [ ] Can select a ticker (AAPL, TSLA, GOOGL)
- [ ] Selected ticker displays in UI
- [ ] Run Simulation button becomes enabled

### API Data Fetching
- [ ] Click "Run Simulation"
- [ ] Loading state displays ("Analyzing sentiment...")
- [ ] API calls are made to backend (check Network tab)
- [ ] No 404 or CORS errors in console

### Results Display
- [ ] Portfolio Summary cards display metrics
  - [ ] Initial Capital
  - [ ] ROI %
  - [ ] Max Drawdown %
  - [ ] Current Portfolio Value
  
- [ ] Market Reaction Chart displays
  - [ ] Price history line chart
  - [ ] Sentiment score overlay
  - [ ] Portfolio value over time
  
- [ ] Transactions list shows buy/sell actions
- [ ] XAI Keywords card displays
  - [ ] Keyword list
  - [ ] Sentiment scores for each keyword

---

## Error Handling ✓

### Backend Errors
- [ ] Invalid ticker returns appropriate error message
- [ ] Date validation works correctly
- [ ] Database connection errors are handled
- [ ] Missing required fields return 422 status

### Frontend Errors
- [ ] Network error displays user-friendly message
- [ ] Invalid input is validated before API call
- [ ] Errors don't crash the application
- [ ] Fallback to mock data works if enabled

### CORS Errors
- [ ] No CORS errors in browser console
- [ ] Requests from frontend are accepted by backend

---

## Performance Testing ✓

### API Response Time
- [ ] Simulation API responds in < 10 seconds
- [ ] Other APIs respond in < 2 seconds

### Frontend Load Time
- [ ] Page loads in < 2 seconds
- [ ] No layout shift while loading

### Memory Usage
- [ ] No memory leaks in frontend
- [ ] Backend memory usage is reasonable

---

## Browser Compatibility ✓

- [ ] Works on Chrome/Chromium
- [ ] Works on Firefox
- [ ] Works on Safari
- [ ] Works on Edge

---

## Data Flow Verification ✓

### Complete Flow Test
1. [ ] Start both servers
2. [ ] Load frontend in browser
3. [ ] Select ticker
4. [ ] Click "Run Simulation"
5. [ ] Verify data flows through: Frontend → API → Backend → Database → Backend → API → Frontend
6. [ ] Results display correctly

### API Inspection
- [ ] Open Network tab in DevTools
- [ ] Run simulation
- [ ] Verify all expected API calls are made:
  - [ ] POST to `/simulate_strategy`
  - [ ] GET to `/xai/{ticker}`
- [ ] Verify response payloads contain expected data

---

## Database Integration ✓

### Data Persistence
- [ ] Data is stored in PostgreSQL
- [ ] Data persists across server restarts
- [ ] Query results match expected format

### Data Retrieval
- [ ] Backend correctly retrieves data from database
- [ ] Filters work correctly (ticker, date range)
- [ ] Sorting and ordering work correctly

---

## Deployment Readiness ✓

### Code Quality
- [ ] No console errors or warnings
- [ ] No linting errors
- [ ] Code follows project conventions

### Configuration
- [ ] All environment variables documented
- [ ] Sensitive data not hardcoded
- [ ] Default configurations are reasonable

### Documentation
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Setup instructions are clear
- [ ] Troubleshooting guide is helpful

---

## Final Integration Tests ✓

### Scenario 1: First-Time User
- [ ] New user can set up and run without issues
- [ ] Documentation is clear enough to follow

### Scenario 2: Multiple Tickers
- [ ] Can run simulations for different tickers sequentially
- [ ] Results are correct for each ticker
- [ ] No state pollution between runs

### Scenario 3: Extended Usage
- [ ] Can run multiple simulations in a row
- [ ] No memory leaks after extended use
- [ ] Performance remains consistent

### Scenario 4: Server Restart
- [ ] Can restart backend without losing frontend state
- [ ] Can restart frontend without losing backend
- [ ] Data persists in database

---

## Sign-Off ✓

- [ ] All tests passed
- [ ] Ready for deployment
- [ ] Documentation complete
- [ ] Known issues documented

**Tested By:** _______________  
**Date:** _______________  
**Notes:** _______________

---

## Quick Test Commands

```bash
# Terminal 1 - Backend
cd backend
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate   # macOS/Linux
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend/hedgefundsim
npm run dev

# Terminal 3 - API Testing
# Test endpoints using curl or Postman
curl http://localhost:8000/fetch_news/AAPL
curl http://localhost:8000/sentiment_score/AAPL
curl http://localhost:8000/market_mood/AAPL
curl http://localhost:8000/xai/AAPL

# Or use the Swagger UI
# Browser: http://localhost:8000/docs
```

---

**Happy Integrating! 🎉**
