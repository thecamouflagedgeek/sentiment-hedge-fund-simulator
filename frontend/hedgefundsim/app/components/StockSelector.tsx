// components/StockSelector.tsx
import { Ticker } from '../../lib/types';
import { Play } from 'lucide-react';

interface StockSelectorProps {
  selectedTicker: Ticker;
  onTickerChange: (ticker: Ticker) => void;
  onRunSimulation: () => void;
  isLoading: boolean;
}

const Tickers: { id: Ticker; name: string; icon: string }[] = [
  { id: 'AAPL', name: 'AAPL (Apple Inc.)', icon: '🍎' },
  { id: 'TSLA', name: 'TSLA (Tesla Inc.)', icon: '🚗' },
  { id: 'GOOGL', name: 'GOOGL (Alphabet Inc.)', icon: '🌐' },
];

export default function StockSelector({ selectedTicker, onTickerChange, onRunSimulation, isLoading }: StockSelectorProps) {
  return (
    <div className="flex items-center space-x-4 p-6 bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
      <label htmlFor="stock-select" className="text-slate-300 font-medium whitespace-nowrap">
        Choose a Stock:
      </label>
      <select
        id="stock-select"
        value={selectedTicker}
        onChange={(e) => onTickerChange(e.target.value as Ticker)}
        className="w-full max-w-xs p-3 rounded-lg bg-slate-900 border border-sky-500/30 text-white focus:ring-sky-500 focus:border-sky-500 transition duration-200"
        disabled={isLoading}
      >
        <option value="" disabled>Select a ticker...</option>
        {Tickers.map(t => (
          <option key={t.id} value={t.id}>
            {t.icon} {t.name}
          </option>
        ))}
      </select>
      <button
        onClick={onRunSimulation}
        disabled={!selectedTicker || isLoading}
        className="flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-sky-900 disabled:text-slate-500 disabled:cursor-not-allowed transition duration-300 transform hover:scale-[1.02]"
      >
        {isLoading ? (
          'Simulating...'
        ) : (
          <>
            <Play size={20} className="mr-2 fill-white" />
            Run Simulation
          </>
        )}
      </button>
    </div>
  );
}