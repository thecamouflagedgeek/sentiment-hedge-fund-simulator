// components/PortfolioSummary.tsx
import { Metrics } from '../../lib/types';
import { DollarSign, TrendingUp, TrendingDown, Briefcase } from 'lucide-react';

interface PortfolioSummaryProps {
  metrics: Metrics;
}

export default function PortfolioSummary({ metrics }: PortfolioSummaryProps) {
  const cards = [
    { 
      metric: 'Initial Capital', 
      value: `$${metrics.InitialCapital.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-amber-400', 
      bg: 'bg-amber-400/10' 
    },
    { 
      metric: 'ROI', 
      value: `${metrics['ROI%'].toFixed(2)}%`, 
      icon: TrendingUp, 
      color: metrics['ROI%'] >= 0 ? 'text-green-500' : 'text-red-500', 
      bg: metrics['ROI%'] >= 0 ? 'bg-green-500/10' : 'bg-red-500/10' 
    },
    { 
      metric: 'Max Drawdown', 
      value: `${metrics['MaxDrawdown%'].toFixed(2)}%`, 
      icon: TrendingDown, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10' 
    },
    { 
      metric: 'Current Portfolio Value', 
      value: `$${metrics.CurrentPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 
      icon: Briefcase, 
      color: 'text-sky-400', 
      bg: 'bg-sky-400/10' 
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {cards.map(card => (
        <div key={card.metric} className="p-6 rounded-xl bg-slate-800 border border-slate-700 shadow-xl transition-shadow duration-300 hover:shadow-sky-500/20">
          <div className={`p-3 rounded-full w-fit mb-3 ${card.color} ${card.bg}`}>
            <card.icon size={24} />
          </div>
          <p className="text-sm text-slate-400 font-medium">{card.metric}</p>
          <p className={`text-3xl font-extrabold mt-1 ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}