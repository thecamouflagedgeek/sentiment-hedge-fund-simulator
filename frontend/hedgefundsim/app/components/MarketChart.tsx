// components/MarketChart.tsx
import { PortfolioDataPoint, Transaction } from '../../lib/types';
import { ShoppingCart, ShoppingBag } from 'lucide-react';

interface MarketChartProps {
  ticker: string;
  data: PortfolioDataPoint[];
  transactions: Transaction[];
}

export default function MarketChart({ ticker, data, transactions }: MarketChartProps) {
  
  // NOTE: In a real Next.js app, you would use a library like react-chartjs-2 here.
  // The Chart.js data would be structured as follows:
  /*
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: `${ticker} Stock Price`,
        data: data.map(d => d.Close),
        borderColor: '#38BDF8', // Blue
        yAxisID: 'y1',
        // ... other Chart.js options
      },
      {
        label: 'Sentiment Score',
        data: data.map(d => d.sentiment_score),
        borderColor: '#FACC15', // Yellow/Amber
        yAxisID: 'y2',
        // ... other Chart.js options
      }
    ],
  };

  // Annotations for BUY/SELL markers would be added to the Chart.js config
  // based on the 'transactions' array.
  */
  
  // Mock Buy/Sell markers display on the chart area for visual representation
  const markers = transactions.map(t => ({
    ...t,
    label: t.action === 'BUY' ? 'BUY' : 'SELL',
    icon: t.action === 'BUY' ? ShoppingCart : ShoppingBag,
    color: t.action === 'BUY' ? 'bg-green-600' : 'bg-red-600',
    hoverText: `Action: ${t.action} | Price: $${t.price.toFixed(2)} | Date: ${t.date}`,
  }));

  // Simple placeholder for the chart
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
      <h2 className="text-xl font-bold text-sky-400 mb-4">
        Market Reaction & Simulation for {ticker}
      </h2>
      
      {/* Chart Placeholder */}
      <div className="w-full h-96 bg-slate-900 rounded-lg flex items-center justify-center relative">
        <p className="text-slate-500 italic">
          [Chart.js Placeholder: Dual-Line Chart of Stock Price (Blue) and Sentiment (Yellow)]
        </p>

        {/* Mock Transaction Markers */}
        <div className="absolute inset-0 flex justify-between px-10 py-5">
            {markers.slice(0, 5).map((m, index) => ( // Display first 5 markers as representative
                <div 
                    key={index} 
                    className={`absolute top-0 transform -translate-y-1/2 p-1 rounded-full ${m.color} z-20`}
                    style={{ left: `${10 + index * 18}%` }} // Distribute mock markers
                    title={m.hoverText}
                >
                    <m.icon size={16} className="text-white"/>
                </div>
            ))}
        </div>
      </div>

      <div className="mt-4 flex space-x-4 justify-center text-sm">
        <span className="flex items-center text-sky-400">
          <div className="w-3 h-3 bg-sky-500 rounded-full mr-2"></div> Stock Price
        </span>
        <span className="flex items-center text-amber-400">
          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div> Sentiment Score
        </span>
        <span className="flex items-center text-green-500">
          <ShoppingCart size={14} className="mr-2" /> BUY Marker (Sentiment &gt; 0.2)
        </span>
        <span className="flex items-center text-red-500">
          <ShoppingBag size={14} className="mr-2" /> SELL Marker (Sentiment &lt; -0.2)
        </span>
      </div>
    </div>
  );
}