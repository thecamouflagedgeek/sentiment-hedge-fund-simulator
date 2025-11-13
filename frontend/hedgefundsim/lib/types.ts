// lib/types.ts

// Defines the available stock tickers
export type Ticker = 'AAPL' | 'TSLA' | 'GOOGL' | '';

// Data structure for the main simulation chart timeline
export interface PortfolioDataPoint {
  date: string; // e.g., "2025-10-14"
  Close: number; // Stock price
  sentiment_score: number;
  total_value: number; // Portfolio value
}

// Data structure for Buy/Sell transactions markers
export interface Transaction {
  date: string; // e.g., "2025-10-14"
  action: 'BUY' | 'SELL';
  price: number;
  qty: number;
}

// Data structure for performance metrics (Step 4)
export interface Metrics {
  'ROI%': number;
  'MaxDrawdown%': number;
  'InitialCapital': number;
  'CurrentPortfolioValue': number;
}

// Data structure for XAI Keywords (Step 5)
export interface XAIKeyword {
  word: string;
  score: number; // Positive for green, negative for red
}

// Complete response structure from /simulate_strategy
export interface SimulationResult {
  price_history: PortfolioDataPoint[];
  transactions: Transaction[];
  metrics: Metrics;
}

// Response structure from /get_xai
export interface XAIResult {
  keywords: XAIKeyword[];
}