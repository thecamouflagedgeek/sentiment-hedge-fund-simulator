# Quick Reference Card - Backend & Frontend Integration

## 🚀 Start Here (3 Steps)

### Step 1: Configure Environments
```powershell
# Backend
cd backend
Copy-Item .env.example .env.local
# Edit .env.local with your database credentials

# Frontend
cd ../frontend/hedgefundsim
Copy-Item .env.local.example .env.local
```

### Step 2: Start Backend (Terminal 1)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt  # If not already installed
uvicorn main:app --reload --port 8000
```

### Step 3: Start Frontend (Terminal 2)
```powershell
cd frontend/hedgefundsim
npm install  # If not already installed
npm run dev
```

### ✓ Open Browser
Navigate to `http://localhost:3000`

---

## 📍 Ports & URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `http://localhost:3000` | User interface |
| Backend | `http://localhost:8000` | API server |
| API Docs | `http://localhost:8000/docs` | Swagger UI |
| Database | `localhost:5432` | PostgreSQL |

---

## 🔌 API Endpoints

```
GET    /fetch_news/{ticker}?days=7
GET    /sentiment_score/{ticker}?days=30
GET    /market_mood/{ticker}?days=30
POST   /simulate_strategy          (with JSON body)
GET    /xai/{ticker}
```

**Example API Call:**
```bash
curl http://localhost:8000/fetch_news/AAPL
curl -X POST http://localhost:8000/simulate_strategy \
  -H "Content-Type: application/json" \
  -d '{"ticker":"AAPL","start":"2025-10-01","end":"2025-11-12"}'
```

---

## 🔧 Configuration Files

### Backend (.env.local)
```
DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/sentiment_db
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

---

## 🐳 Docker Quick Start

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

Services available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Database: `localhost:5432`

---

## 📂 Key Files

```
backend/
  ├── main.py              # FastAPI application
  ├── requirements.txt     # Python dependencies
  └── .env.local          # Configuration (create from .env.example)

frontend/hedgefundsim/
  ├── app/page.tsx         # Main dashboard
  ├── lib/api.ts          # API client
  ├── package.json        # npm dependencies
  └── .env.local          # Configuration (create from .env.local.example)
```

---

## ✅ Testing Integration

### Test Frontend Load
1. Open `http://localhost:3000` in browser
2. Should see "Welcome to Aura" message
3. Check browser console for errors (press F12)

### Test API Connection
1. Select ticker from dropdown
2. Click "Run Simulation"
3. Check Network tab in DevTools for API calls
4. Verify results display after ~5 seconds

### Test Individual Endpoints
Visit `http://localhost:8000/docs` and try:
- GET `/fetch_news/AAPL`
- GET `/sentiment_score/AAPL`
- GET `/market_mood/AAPL`
- POST `/simulate_strategy`
- GET `/xai/AAPL`

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `Failed to fetch` | Backend not running or wrong `NEXT_PUBLIC_API_BASE` |
| `Connection refused` | Database not running or wrong credentials |
| `Port already in use` | Change port in startup command |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` |
| `CORS error` | Check backend CORS config (should be set) |
| `npm ERR!` | Run `npm install` in frontend directory |

---

## 📚 Documentation

- **Full Guide:** `INTEGRATION_GUIDE.md`
- **Testing Checklist:** `INTEGRATION_CHECKLIST.md`
- **Integration Summary:** `INTEGRATION_SUMMARY.md`
- **README:** `README.md`

---

## 🎯 Typical Workflow

```
1. Edit backend code
2. Backend auto-reloads (uvicorn --reload)
3. Edit frontend code
4. Frontend auto-reloads (next dev)
5. Test in browser at http://localhost:3000
6. Check API docs at http://localhost:8000/docs
7. Verify database with your PostgreSQL client
```

---

## 💡 Development Tips

- **API Testing:** Use Postman or `curl` for quick endpoint testing
- **Frontend Debugging:** Use React DevTools browser extension
- **Backend Logging:** Check terminal output for detailed logs
- **Database Inspection:** Use pgAdmin or command line `psql`
- **Hot Reload:** Both frontend and backend auto-reload on save

---

## 🚀 Ready to Deploy?

### Development → Production Checklist
- [ ] Update `NEXT_PUBLIC_API_BASE` to production backend URL
- [ ] Update `DATABASE_URL` to production database
- [ ] Set `FRONTEND_URL` to production frontend URL
- [ ] Remove debug logging
- [ ] Test all endpoints in production
- [ ] Check for sensitive data in code
- [ ] Use `.env` (not `.env.local`) in production

See `INTEGRATION_GUIDE.md` for deployment details.

---

## 📞 Need Help?

1. Check `INTEGRATION_GUIDE.md` for detailed walkthrough
2. Review `INTEGRATION_CHECKLIST.md` for testing steps
3. Check terminal output for specific error messages
4. Visit `http://localhost:8000/docs` for API reference
5. Check browser DevTools (F12) for frontend errors

---

**Backend & Frontend Integration Complete! ✅**

*For the full walkthrough, see INTEGRATION_GUIDE.md*
