# System Architecture & Data Flow

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                               │
│                    (Chrome, Firefox, Safari)                         │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                  HTTP Requests/Responses
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
    ┌─────────────────┐          ┌─────────────────────┐
    │   NEXT.JS APP   │          │   STATIC ASSETS     │
    │  Port: 3000     │          │  (CSS, JavaScript)  │
    │                 │          │                     │
    │ • Dashboard UI  │          │  • Styles           │
    │ • Components    │          │  • Fonts            │
    │ • State Mgmt    │          │  • Images           │
    └────────┬────────┘          └─────────────────────┘
             │
             │ API Calls
             │ (JSON over HTTP)
             │
             ▼
    ┌─────────────────────────────────────┐
    │       FASTAPI BACKEND                │
    │       Port: 8000                     │
    │                                      │
    │  ┌────────────────────────────────┐  │
    │  │   API Routes                   │  │
    │  ├────────────────────────────────┤  │
    │  │ • /fetch_news/{ticker}         │  │
    │  │ • /sentiment_score/{ticker}    │  │
    │  │ • /market_mood/{ticker}        │  │
    │  │ • /simulate_strategy (POST)    │  │
    │  │ • /xai/{ticker}                │  │
    │  └────────────────────────────────┘  │
    │                                      │
    │  ┌────────────────────────────────┐  │
    │  │   Business Logic               │  │
    │  ├────────────────────────────────┤  │
    │  │ • Sentiment Analysis           │  │
    │  │ • Strategy Backtesting         │  │
    │  │ • News Processing              │  │
    │  │ • XAI Explanations             │  │
    │  └────────────────────────────────┘  │
    │                                      │
    │  ┌────────────────────────────────┐  │
    │  │   Data Access Layer            │  │
    │  │   (SQLAlchemy ORM)             │  │
    │  └────────────────────────────────┘  │
    └─────────┬──────────────────────────┘
              │
              │ SQL Queries
              │
              ▼
    ┌─────────────────────────────────────┐
    │       POSTGRESQL DATABASE            │
    │       Port: 5432                     │
    │                                      │
    │  ┌────────────────────────────────┐  │
    │  │   Tables                       │  │
    │  ├────────────────────────────────┤  │
    │  │ • news_sentiment               │  │
    │  │ • keyword_importance           │  │
    │  │ • market_data                  │  │
    │  │ • user_portfolios (optional)   │  │
    │  └────────────────────────────────┘  │
    │                                      │
    │  ┌────────────────────────────────┐  │
    │  │   Indexes & Constraints        │  │
    │  │   (for performance)            │  │
    │  └────────────────────────────────┘  │
    └─────────────────────────────────────┘
```

---

## 📊 Data Flow Sequence

### 1. User Selects Ticker & Clicks Run Simulation

```
[Frontend UI]
    ↓
    User selects "AAPL" and clicks "Run Simulation"
    ↓
[React Component: page.tsx]
    ↓
    handleRunSimulation() triggered
    ↓
[API Client: lib/api.ts]
    ↓
    runSimulation("AAPL", "2025-10-01", "2025-11-12")
    ↓
[HTTP POST Request]
    URL: http://localhost:8000/simulate_strategy
    Body: {"ticker":"AAPL", "start":"2025-10-01", "end":"2025-11-12"}
    ↓
[FastAPI Backend: main.py]
    ↓
    @app.post("/simulate_strategy")
    ↓
[Business Logic: strategy/backtest.py]
    ↓
    1. Fetch historical price data from yfinance
    2. Fetch sentiment data from database
    3. Run sentiment-based trading algorithm
    4. Calculate returns and metrics
    ↓
[Data Access: db/db_connect.py]
    ↓
    Query NewssentimentTable for past 60 days
    ↓
[PostgreSQL]
    ↓
    SELECT * FROM news_sentiment 
    WHERE ticker = 'AAPL' AND created_at >= '2025-10-01'
    ↓
[Result]
    Return sentiment scores for each date
    ↓
[FastAPI - Processing]
    ↓
    Calculate trading signals based on sentiment
    Generate price history with trades
    ↓
[Response JSON]
    {
      "status": "success",
      "results": {
        "price_history": [...],
        "transactions": [...],
        "metrics": {...}
      }
    }
    ↓
[HTTP Response]
    Status: 200
    Content-Type: application/json
    ↓
[Frontend]
    ↓
    Receive JSON response
    ↓
[React State]
    ↓
    setSimulationResult(results)
    ↓
[Component Re-render]
    ↓
    Display PortfolioSummary, MarketChart, XAICard
```

---

## 🔄 API Request-Response Cycle

### Request

```
POST /simulate_strategy HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Origin: http://localhost:3000

{
  "ticker": "AAPL",
  "start": "2025-10-01",
  "end": "2025-11-12"
}
```

### Processing

```
1. CORS Check
   ✓ Origin is allowed (configured in FastAPI)

2. Request Validation
   ✓ Pydantic validates request body against BacktestRequest model

3. Business Logic
   ✓ simulate_strategy() processes the request
   ✓ Queries database for historical data
   ✓ Runs sentiment analysis
   ✓ Backtests trading strategy

4. Response Preparation
   ✓ Package results in JSON format
   ✓ Include price_history, transactions, and metrics
```

### Response

```
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *

{
  "status": "success",
  "results": {
    "price_history": [
      {
        "date": "2025-10-14",
        "Close": 247.53,
        "sentiment_score": 0.299,
        "total_value": 100000
      },
      ...
    ],
    "transactions": [
      {
        "date": "2025-10-14",
        "action": "BUY",
        "price": 247.53,
        "qty": 40
      },
      ...
    ],
    "metrics": {
      "InitialCapital": 100000,
      "ROI%": 2.16,
      "MaxDrawdown%": -0.17,
      "CurrentPortfolioValue": 102162
    }
  }
}
```

---

## 🗄️ Database Schema (Simplified)

```sql
-- News & Sentiment Data
CREATE TABLE news_sentiment (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(10),
    title VARCHAR(500),
    content TEXT,
    sentiment VARCHAR(20),        -- 'positive', 'negative', 'neutral'
    confidence FLOAT,              -- 0.0 to 1.0
    source VARCHAR(100),
    created_at TIMESTAMP
);

-- Keyword Importance (for XAI)
CREATE TABLE keyword_importance (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100),
    ticker VARCHAR(10),
    importance_score FLOAT,
    sentiment_direction VARCHAR(20),
    created_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_news_ticker ON news_sentiment(ticker);
CREATE INDEX idx_news_created_at ON news_sentiment(created_at);
CREATE INDEX idx_keyword_ticker ON keyword_importance(ticker);
```

---

## 🔌 API Integration Points

### Frontend → Backend Communication

```typescript
// Frontend makes these requests:

1. POST /simulate_strategy
   ├─ Input: ticker, start_date, end_date
   └─ Output: simulation results with metrics

2. GET /fetch_news/{ticker}
   ├─ Input: ticker, days=7
   └─ Output: news articles with sentiment

3. GET /sentiment_score/{ticker}
   ├─ Input: ticker, days=30
   └─ Output: average sentiment score

4. GET /market_mood/{ticker}
   ├─ Input: ticker, days=30
   └─ Output: dominant mood + counts

5. GET /xai/{ticker}
   ├─ Input: ticker
   └─ Output: explainable AI insights
```

---

## 📁 Component Interaction

```
┌─ Frontend
│  ├─ page.tsx (Main Dashboard)
│  │  ├─ Calls: fetchSimulation(), fetchXAIData()
│  │  ├─ Renders: Header, StockSelector, PortfolioSummary, MarketChart, XAICard
│  │  └─ State: selectedTicker, simulationResult, xaiResult, isLoading
│  │
│  ├─ components/
│  │  ├─ StockSelector.tsx
│  │  │  └─ User selects ticker → triggers handleRunSimulation()
│  │  ├─ PortfolioSummary.tsx
│  │  │  └─ Displays metrics (ROI, Drawdown, etc.)
│  │  ├─ MarketChart.tsx
│  │  │  └─ Displays price history + sentiment overlay
│  │  ├─ XAICard.tsx
│  │  │  └─ Displays keyword explanations
│  │  └─ Header.tsx
│  │     └─ Displays app title + market mood
│  │
│  └─ lib/api.ts
│     ├─ API_BASE = "http://localhost:8000"
│     ├─ fetchNews()
│     ├─ fetchSentimentScore()
│     ├─ fetchMarketMood()
│     ├─ runSimulation()
│     └─ fetchXAI()
│
└─ Backend
   ├─ main.py (FastAPI App)
   │  ├─ Route: GET /fetch_news/{ticker}
   │  ├─ Route: GET /sentiment_score/{ticker}
   │  ├─ Route: GET /market_mood/{ticker}
   │  ├─ Route: POST /simulate_strategy
   │  └─ Route: GET /xai/{ticker}
   │
   ├─ sentiment/
   │  ├─ fetch_news.py
   │  │  └─ Fetches and processes news articles
   │  └─ sentiment_model.py
   │     └─ Analyzes sentiment of text
   │
   ├─ strategy/
   │  ├─ backtest.py
   │  │  └─ Runs trading simulation
   │  └─ explainable_ai.py
   │     └─ Generates XAI explanations (SHAP)
   │
   └─ db/
      ├─ db_connect.py
      │  └─ PostgreSQL connection & session management
      ├─ models.py
      │  └─ SQLAlchemy table definitions
      ├─ keywords.py
      │  └─ Keyword operations
      └─ __init__.py
```

---

## 🔐 Security & CORS Flow

```
Client Request
    ↓
Browser sends OPTIONS preflight request
    ↓
FastAPI CORS Middleware checks:
    ✓ Origin allowed? (configured as "*")
    ✓ Method allowed? (GET, POST, etc.)
    ✓ Headers allowed? (Content-Type, etc.)
    ↓
Middleware sends CORS headers in response:
    - Access-Control-Allow-Origin: *
    - Access-Control-Allow-Methods: GET, POST, OPTIONS
    - Access-Control-Allow-Headers: content-type
    ↓
Browser receives response
    ↓
If CORS headers OK, sends actual request
    ↓
Repeat for each API call
```

---

## 🚀 Deployment Architecture

```
Development
───────────
Frontend: localhost:3000 (npm run dev)
Backend:  localhost:8000 (uvicorn --reload)
Database: localhost:5432 (local PostgreSQL)

Production
──────────
Frontend:   Vercel / Netlify (deployed)
Backend:    Heroku / AWS / Railway (deployed)
Database:   RDS / Managed PostgreSQL (cloud)

Configuration
──────────────
Frontend .env.local: NEXT_PUBLIC_API_BASE=https://api.production.com
Backend .env.local:  DATABASE_URL=postgresql://user:pass@prod-db:5432/db
```

---

## 📈 Performance Considerations

```
Optimizations
─────────────

Frontend
├─ React components memoization
├─ API response caching
├─ Lazy loading of components
└─ TailwindCSS tree-shaking

Backend
├─ Database query optimization
├─ API response compression
├─ Sentiment model caching
└─ Connection pooling

Database
├─ Indexes on frequently queried columns
├─ Query optimization
└─ Partitioning of large tables
```

---

## 📞 Debugging Flow

```
Issue: Frontend shows "Failed to fetch"

Debug Steps:
1. Check browser Network tab (F12)
   ├─ Is request being sent?
   └─ What's the status code?

2. Check browser Console (F12)
   ├─ CORS errors?
   └─ JavaScript errors?

3. Check NEXT_PUBLIC_API_BASE
   ├─ Should be http://localhost:8000
   └─ Not empty or wrong URL?

4. Check backend is running
   ├─ Terminal output shows "Application startup complete"?
   └─ Can access http://localhost:8000/docs?

5. Check CORS configuration
   ├─ Backend has allow_origins=["*"]?
   └─ Or specific frontend URL?

6. Check network
   ├─ Can ping localhost:8000?
   └─ Firewall blocking?
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable API structure
- ✅ Flexible deployment options
- ✅ Easy debugging and monitoring
- ✅ Production-ready design

For more details, see `INTEGRATION_GUIDE.md` and `QUICK_REFERENCE.md`
