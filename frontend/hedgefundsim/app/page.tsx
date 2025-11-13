// app/page.tsx
'use client';

import { useState } from 'react';
import { runSimulation, fetchXAI } from '../lib/api';
import Header from './components/Header';
import StockSelector from './components/StockSelector';
import PortfolioSummary from './components/PortfolioSummary';
import MarketChart from './components/MarketChart';
import XAICard from './components/XAICard';
import { Ticker, SimulationResult, XAIResult, Metrics } from '../lib/types';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
});

// --- MOCK API DATA (Replace with actual fetch calls) ---
const MOCK_METRICS: Metrics = {
  'InitialCapital': 100000,
  'ROI%': 2.16,
  'MaxDrawdown%': -0.17,
  'CurrentPortfolioValue': 102162,
};

const MOCK_SIMULATION_DATA: SimulationResult = {
  price_history: [
    { date: "2025-10-14", Close: 247.53, sentiment_score: 0.299, total_value: 100000 },
    { date: "2025-10-15", Close: 248.10, sentiment_score: 0.350, total_value: 100000 },
    { date: "2025-10-16", Close: 246.90, sentiment_score: 0.150, total_value: 99900 },
    { date: "2025-10-17", Close: 249.01, sentiment_score: 0.050, total_value: 100200 },
    { date: "2025-10-18", Close: 250.50, sentiment_score: 0.400, total_value: 100500 },
  ],
  transactions: [
    { date: "2025-10-14", action: "BUY", price: 247.53, qty: 40 },
    { date: "2025-10-18", action: "BUY", price: 250.50, qty: 20 },
  ],
  metrics: MOCK_METRICS,
};

const MOCK_XAI_DATA: XAIResult = {
  keywords: [
    { word: "earnings", score: 0.48 },
    { word: "lawsuit", score: -0.22 },
    { word: "revenue", score: 0.17 },
    { word: "growth", score: 0.33 },
    { word: "management", score: -0.10 },
  ],
};

// Frontend Functions to call Backend API (Step 2, 5)
const fetchSimulation = async (ticker: Ticker): Promise<SimulationResult> => {
  console.log(`Fetching simulation for ${ticker}...`);
  try {
    const response = await runSimulation(ticker, "2025-10-01", "2025-11-12");
    return response.results || MOCK_SIMULATION_DATA;
  } catch (error) {
    console.error("Failed to fetch simulation:", error);
    // Fallback to mock data if API fails
    return {
      ...MOCK_SIMULATION_DATA,
      metrics: {
          ...MOCK_METRICS,
          'ROI%': parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
          'MaxDrawdown%': parseFloat((Math.random() * -1).toFixed(2)),
          'CurrentPortfolioValue': 100000 * (1 + parseFloat((Math.random() * 0.05 - 0.02).toFixed(4)))
      }
    };
  }
};

const fetchXAIData = async (ticker: Ticker): Promise<XAIResult> => {
  console.log(`Fetching XAI for ${ticker}...`);
  try {
    const response = await fetchXAI(ticker);
    return response || MOCK_XAI_DATA;
  } catch (error) {
    console.error("Failed to fetch XAI:", error);
    // Fallback to mock data if API fails
    return MOCK_XAI_DATA;
  }
};
// ---------------------------------------------------

export default function Dashboard() {
  const [selectedTicker, setSelectedTicker] = useState<Ticker>('');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [xaiResult, setXAIResult] = useState<XAIResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunSimulation = async () => {
    if (!selectedTicker) return;

    setIsLoading(true);
    setSimulationResult(null);
    setXAIResult(null);

    try {
      // Step 2 & 3 & 4: Fetch Simulation and Metrics
      const simulation = await fetchSimulation(selectedTicker);
      setSimulationResult(simulation);

      // Step 5: Fetch XAI Insights (Can run concurrently or sequentially)
      const xai = await fetchXAIData(selectedTicker);
      setXAIResult(xai);

    } catch (error) {
      console.error("Simulation failed:", error);
      // Handle error state for user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white">
      {/* Step 1 & 6: Header with Market Mood Gauge */}
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Step 1 & 2: Stock Selector and Run Button */}
        <div className="mb-8 flex justify-center">
          <StockSelector 
            selectedTicker={selectedTicker}
            onTickerChange={setSelectedTicker}
            onRunSimulation={handleRunSimulation}
            isLoading={isLoading}
          />
        </div>

        {/* Loading State (While waiting: "Analyzing sentiment...") */}
        {isLoading && (
          <div className="text-center p-12 bg-slate-900/50 rounded-xl border border-slate-700 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
            <p className="text-xl font-medium text-slate-300">
              Analyzing sentiment and simulating trades...
            </p>
          </div>
        )}

        {/* Results Display */}
        {simulationResult && !isLoading && (
          <div className="space-y-8">
            {/* Step 4: Portfolio Summary Cards */}
            <PortfolioSummary metrics={simulationResult.metrics} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Step 3: Market Reaction Chart (Large element, spanning 2/3) */}
              <div className="lg:col-span-2">
                <MarketChart 
                  ticker={selectedTicker} 
                  data={simulationResult.price_history} 
                  transactions={simulationResult.transactions} 
                />
              </div>

              {/* Step 5: XAI Insights (Smaller element, spanning 1/3) */}
              <div className="lg:col-span-1">
                {xaiResult && <XAICard keywords={xaiResult.keywords} />}
              </div>
            </div>
          </div>
        )}

        {/* Initial Welcome Message */}
        {!selectedTicker && !isLoading && !simulationResult && (
             <div className="text-center p-20 bg-slate-900/50 rounded-xl border border-slate-700 shadow-lg">
                <p className={`${cinzel.className} text-4xl italic font-bold mb-4 text-sky-400`}>Welcome to Aura</p>
                <p className="text-lg text-slate-300">Select a stock ticker and click 'Run Simulation' to see how our AI-driven strategy performs.</p>
            </div>
        )}
      </main>
    </div>
  );
}