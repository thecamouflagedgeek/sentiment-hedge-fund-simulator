// components/MarketChart.tsx
import { PortfolioDataPoint, Transaction } from '../../lib/types';
import { ShoppingCart, ShoppingBag } from 'lucide-react';

interface MarketChartProps {
  ticker: string;
  data: PortfolioDataPoint[] | null | undefined;
  transactions: Transaction[] | null | undefined;
}

export default function MarketChart({ ticker, data, transactions }: MarketChartProps) {
  
  // Guard: if no data, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
        <h2 className="text-xl font-bold text-sky-400 mb-4">
          Market Reaction & Simulation for {ticker}
        </h2>
        <div className="w-full h-96 bg-slate-900 rounded-lg flex items-center justify-center animate-pulse">
          <p className="text-slate-500 italic">Loading chart data...</p>
        </div>
      </div>
    );
  }
  // Prepare data (ensure sorted by date)
  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Dimensions for the SVG (scales automatically with viewBox)
  const WIDTH = 1000;
  const HEIGHT = 360;
  const M = { top: 20, right: 20, bottom: 50, left: 60 };
  const innerW = WIDTH - M.left - M.right;
  const innerH = HEIGHT - M.top - M.bottom;

  const prices = sorted.map(d => d.Close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const sentiments = sorted.map(d => d.sentiment_score);
  const minSent = Math.min(...sentiments, -1);
  const maxSent = Math.max(...sentiments, 1);

  const n = sorted.length;
  const x = (i: number) => M.left + (i / Math.max(1, n - 1)) * innerW;
  const yPrice = (val: number) => M.top + ((maxPrice - val) / Math.max(1, maxPrice - minPrice)) * innerH;
  const sentimentBandHeight = 60; // area at bottom reserved for sentiment
  const ySentTop = HEIGHT - M.bottom - sentimentBandHeight;
  const ySent = (s: number) => {
    // map sentiment range [minSent, maxSent] to [ySentTop + sentimentBandHeight, ySentTop]
    const range = maxSent - minSent || 1;
    return ySentTop + sentimentBandHeight - ((s - minSent) / range) * sentimentBandHeight;
  };

  const pricePath = sorted.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${yPrice(d.Close)}`).join(' ');
  const sentimentPath = sorted.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${ySent(d.sentiment_score)}`).join(' ');

  const markers = (transactions || []).map(t => ({
    ...t,
    x: (() => {
      const idx = sorted.findIndex(s => s.date === t.date || s.date === (t.date as any));
      return idx >= 0 ? x(idx) : null;
    })(),
    y: (() => {
      // use nearest price if available
      const row = sorted.find(s => s.date === t.date);
      return row ? yPrice(row.Close) : null;
    })(),
  }));

  // Ticks for x-axis (choose max 6)
  const tickCount = Math.min(6, n);
  const tickIndexes = Array.from({ length: tickCount }, (_, i) => Math.round((i / Math.max(1, tickCount - 1)) * (n - 1)));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
      <h2 className="text-xl font-bold text-sky-400 mb-4">
        Market Reaction & Simulation for {ticker}
      </h2>

      <div className="w-full rounded-lg overflow-hidden">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-96">
          {/* Background */}
          <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#0f1724" />

          {/* Price grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const yy = M.top + t * innerH;
            return <line key={i} x1={M.left} y1={yy} x2={WIDTH - M.right} y2={yy} stroke="#1f2937" strokeWidth={1} />;
          })}

          {/* Price path */}
          <path d={pricePath} fill="none" stroke="#38BDF8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />

          {/* Sentiment path (drawn above the sentiment band) */}
          <path d={sentimentPath} fill="none" stroke="#FACC15" strokeWidth={1.8} opacity={0.95} />

          {/* X axis ticks and labels */}
          {tickIndexes.map((ti, idx) => (
            <g key={idx} transform={`translate(${x(ti)}, ${HEIGHT - M.bottom})`}>
              <line x1={0} y1={0} x2={0} y2={6} stroke="#374151" />
              <text x={0} y={20} textAnchor="middle" fontSize={10} fill="#94a3b8">{new Date(sorted[ti].date).toLocaleDateString()}</text>
            </g>
          ))}

          {/* Left axis price labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const val = maxPrice - t * (maxPrice - minPrice);
            const yy = M.top + t * innerH;
            return (
              <text key={i} x={12} y={yy + 4} fontSize={11} fill="#94a3b8">{`$${val.toFixed(2)}`}</text>
            );
          })}

          {/* Sentiment band background */}
          <rect x={M.left} y={ySentTop} width={innerW} height={sentimentBandHeight} fill="#071126" />
          <text x={M.left + 6} y={ySentTop + 14} fontSize={11} fill="#94a3b8">Sentiment</text>

          {/* Sentiment bars */}
          {sorted.map((d, i) => {
            const barW = Math.max(1, innerW / n - 1);
            const barH = Math.abs(((d.sentiment_score - minSent) / (maxSent - minSent || 1)) * sentimentBandHeight - (0)) ;
            const bx = x(i) - barW / 2;
            const by = ySent(d.sentiment_score);
            const color = d.sentiment_score >= 0 ? '#10B981' : '#EF4444';
            return <rect key={i} x={bx} y={by} width={barW} height={Math.max(1, sentimentBandHeight - (by - ySentTop))} fill={color} opacity={0.9} />;
          })}

          {/* Transaction markers */}
          {markers.map((m, i) => {
            if (m.x == null) return null;
            const isBuy = m.action === 'BUY';
            return (
              <g key={i} transform={`translate(${m.x}, ${m.y ?? (M.top + innerH / 2)})`}>
                <circle r={10} fill={isBuy ? '#059669' : '#dc2626'} stroke="#000" strokeWidth={1} />
                <text x={0} y={4} textAnchor="middle" fontSize={10} fill="#fff">{isBuy ? 'BUY' : 'SELL'}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex space-x-4 justify-center text-sm">
        <span className="flex items-center text-sky-400">
          <div className="w-3 h-3 bg-sky-500 rounded-full mr-2"></div> Stock Price
        </span>
        <span className="flex items-center text-amber-400">
          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div> Sentiment Score
        </span>
        <span className="flex items-center text-green-500">
          <ShoppingCart size={14} className="mr-2" /> BUY Marker
        </span>
        <span className="flex items-center text-red-500">
          <ShoppingBag size={14} className="mr-2" /> SELL Marker
        </span>
      </div>
    </div>
  );
}