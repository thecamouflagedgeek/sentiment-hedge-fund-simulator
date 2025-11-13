// components/Header.tsx
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

// Mock function for backend call to market mood
const fetchMarketMood = async (): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  // Mock value between -1.0 (Fearful) and +1.0 (Greedy)
  return parseFloat((Math.random() * 2 - 1).toFixed(2));
};

const getGaugeLabel = (score: number) => {
  if (score > 0.5) return 'Greedy (High Optimism)';
  if (score > 0.1) return 'Optimistic';
  if (score < -0.5) return 'Fearful (High Panic)';
  if (score < -0.1) return 'Pessimistic';
  return 'Neutral';
};

// Component for the Compact Gauge Visualization (w-16 h-8)
const MarketMoodGauge = ({ mood, loading }: { mood: number, loading: boolean }) => {
    // New, smaller size for compactness
    const gaugeWidth = 16; 
    const gaugeHeight = 8;
    
    // 1. Calculate rotation angle for the needle (0 to 180 degrees)
    const needleRotation = (mood + 1) * 90;
    
    // 2. Calculate rotation for the color fill (from -90deg to 90deg)
    const colorRotation = mood * 90; 

    const fillColor = mood > 0 ? '#10B981' : '#EF4444'; // Green-500 or Red-500

    return (
        <div className={`w-${gaugeWidth} h-${gaugeHeight} overflow-hidden relative`} style={{ transform: 'scaleX(1)' }}>
            {/* Base Half-Circle (Grey Background Arc) */}
            <div className="absolute inset-0 top-1/2 rounded-t-full bg-slate-700/50"></div>

            {/* Colored Fill (Advanced CSS Trick) */}
            <div 
                className="absolute inset-0 rounded-full transition-transform duration-1000" 
                style={{
                    transform: `rotate(${colorRotation}deg)`,
                    transformOrigin: '50% 100%',
                    clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', // Only top half is visible
                    backgroundColor: fillColor
                }}
            />

            {/* Inner Circle (To create the border/background effect) */}
            {/* Adjusted from [2px] to [1px] for even smaller size */}
            <div className={`absolute top-px left-px right-px h-[${gaugeWidth}px] rounded-full bg-black/80`}></div>
            
            {/* Needle */}
            <div 
                className={`absolute bottom-0 left-1/2 w-px h-full origin-bottom rounded-full transition-transform duration-500 ${loading ? 'animate-pulse bg-sky-400' : 'bg-white'}`}
                style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
            />
            
            {/* Center Pivot */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-white border-2 border-black z-10"></div>
        </div>
    );
};


export default function Header() {
  const [mood, setMood] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const loadMood = async () => {
    setLoading(true);
    const newMood = await fetchMarketMood();
    setMood(newMood);
    setLoading(false);
  };

  useEffect(() => {
    loadMood();
    // Set up polling 
    const interval = setInterval(loadMood, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Determine text color based on mood score
  const moodTextColor = mood > 0 ? 'text-green-400' : mood < 0 ? 'text-red-400' : 'text-yellow-400';

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-700/50 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-sky-500 text-transparent bg-clip-text">
        Aura — Artificial Understanding of Risk & Attitude
        </h1>
        
        {/* Market Mood Gauge & Info (COMPACT) */}
        <div className="flex items-center space-x-2 text-sm"> {/* Reduced space-x */}
          <div className="flex flex-col items-end whitespace-nowrap">
            <p className="text-slate-400 font-semibold text-xs uppercase">Market Mood</p>
            <p className={`text-lg font-extrabold ${moodTextColor}`}> {/* Reduced font size slightly */}
              {mood.toFixed(2)}
            </p>
            <p className={`text-[10px] font-medium ${moodTextColor}`}> {/* Smallest possible font size */}
                {getGaugeLabel(mood)}
            </p>
          </div>
          
          <MarketMoodGauge mood={mood} loading={loading} />

          <button 
            onClick={loadMood} 
            disabled={loading}
            className="p-2 text-slate-400 hover:text-sky-400 disabled:opacity-50 transition-colors"
            title="Refresh Market Mood"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}