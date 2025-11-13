// components/XAICard.tsx
import { XAIKeyword } from '../../lib/types';
import { Zap } from 'lucide-react';

interface XAICardProps {
  keywords: XAIKeyword[] | null | undefined;
}

export default function XAICard({ keywords }: XAICardProps) {
  if (!keywords || keywords.length === 0) return null;

  // Find max absolute score for scaling the bars
  const maxAbsScore = Math.max(...keywords.map(k => Math.abs(k.score)));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
      <h2 className="text-xl font-bold text-sky-400 mb-6 flex items-center">
        <Zap className="mr-2 text-yellow-400" size={24} /> 🧩 Explainable AI (XAI) Insights
      </h2>
      <p className="text-slate-400 mb-4">Why did the sentiment change? Influence of key topics:</p>
      
      <div className="space-y-4">
        {keywords.map((item) => {
          const isPositive = item.score >= 0;
          const barWidth = `${(Math.abs(item.score) / maxAbsScore) * 100}%`;
          const barColor = isPositive ? 'bg-green-500' : 'bg-red-500';

          return (
            <div key={item.word} className="flex items-center">
              <span className="w-24 text-slate-200 font-medium truncate">{item.word}</span>
              <div className="flex-1 h-6 mx-4 rounded-lg bg-slate-900 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700`}
                  style={{ 
                    width: barWidth,
                    backgroundColor: isPositive ? '#10B981' : '#EF4444', // Tailwind colors
                    marginLeft: isPositive ? '0' : `calc(100% - ${barWidth})` // Position negative bars to the right
                  }}
                ></div>
              </div>
              <span className={`w-12 text-right font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {item.score.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}