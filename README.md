# Sentiment Hedge Fund Simulator

An AI-driven hedge fund simulation platform that backtests trading strategies based on social sentiment, financial news, and market data to simulate how sentiment impacts asset performance.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- Git

### Setup (Windows - PowerShell)
```powershell
# Run the setup script
.\setup.ps1

# Follow the on-screen instructions
```

### Setup (macOS/Linux - Bash)
```bash
# Make script executable and run it
chmod +x setup.sh
./setup.sh

# Follow the on-screen instructions
```

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend/hedgefundsim
npm install
npm run dev
# Opens at http://localhost:3000
```

## 📖 Documentation

- **[Integration Guide](./INTEGRATION_GUIDE.md)** - Complete integration walkthrough
- **[API Documentation](http://localhost:8000/docs)** - Interactive API docs (when backend is running)

## 🏗️ Architecture

```
Frontend (Next.js) ←→ Backend (FastAPI) ←→ PostgreSQL
http://localhost:3000   http://localhost:8000   localhost:5432
```

## 📊 Features

- **Sentiment Analysis**: Analyzes news sentiment for stocks
- **Strategy Backtesting**: Simulates trading strategies based on sentiment
- **Market Mood**: Real-time market sentiment analysis
- **XAI Explanations**: Explainable AI for trading decisions using SHAP
- **Portfolio Metrics**: ROI, Drawdown, and performance tracking

## 📁 Project Structure

```
sentiment-hedge-fund-simulator/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment template
│   ├── Dockerfile             # Docker configuration
│   ├── db/                    # Database layer
│   ├── sentiment/             # Sentiment analysis module
│   └── strategy/              # Trading strategy module
│
├── frontend/
│   └── hedgefundsim/          # Next.js application
│       ├── package.json
│       ├── .env.local.example # Environment template
│       ├── Dockerfile         # Docker configuration
│       ├── app/               # Next.js app directory
│       ├── components/        # React components
│       └── lib/               # Utilities and API client
│
├── INTEGRATION_GUIDE.md       # Detailed integration guide
├── docker-compose.yml         # Docker Compose configuration
├── setup.ps1                  # Windows setup script
└── setup.sh                   # macOS/Linux setup script
```

## 🐳 Docker Setup

```bash
# Build and start all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Database: localhost:5432
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fetch_news/{ticker}` | Get recent news for a ticker |
| GET | `/sentiment_score/{ticker}` | Get sentiment score for a ticker |
| GET | `/market_mood/{ticker}` | Get market mood for a ticker |
| POST | `/simulate_strategy` | Run backtesting simulation |
| GET | `/xai/{ticker}` | Get XAI explanations |

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed endpoint documentation.

## ⚙️ Configuration

### Environment Variables

**Backend (.env.local):**
```
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/sentiment_db
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## 🧪 Testing

### Test Frontend API Integration
1. Start both frontend and backend
2. Open `http://localhost:3000`
3. Select a ticker and click "Run Simulation"
4. Verify results display correctly

### API Testing
Visit `http://localhost:8000/docs` for interactive API testing with Swagger UI.

## 📦 Dependencies

### Backend
- FastAPI
- SQLAlchemy
- psycopg2
- yfinance
- scikit-learn
- SHAP
- pandas/numpy

### Frontend
- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- Lucide React

## 🚀 Deployment

### Heroku (Backend)
```bash
cd backend
heroku create your-app-name
heroku config:set DATABASE_URL=your_production_db_url
git push heroku main
```

### Vercel (Frontend)
1. Connect GitHub repository to Vercel
2. Set `NEXT_PUBLIC_API_BASE` environment variable
3. Deploy

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#-deployment) for more details.

## 🐛 Troubleshooting

- **CORS Errors**: Ensure backend CORS is configured correctly
- **Database Connection**: Check PostgreSQL is running and credentials are correct
- **Port Conflicts**: Ensure ports 3000, 8000, and 5432 are available
- **Missing Dependencies**: Run `pip install -r requirements.txt` or `npm install`

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#-troubleshooting) for detailed troubleshooting.

## 📝 License

This project is part of the Sentiment Hedge Fund Simulator portfolio project.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

## 📞 Support

For issues or questions, refer to the [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) documentation.
