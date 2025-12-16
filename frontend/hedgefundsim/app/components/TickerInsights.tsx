import React from "react";
import {
  fetchNews,
  fetchSentimentScore,
  fetchMarketMood,
  fetchXAI,
} from "../../lib/api";

type Props = {
  ticker: string;
};

export default async function TickerInsights({ ticker }: Props) {
  // Fetch data in parallel from backend
  const [newsRes, sentimentRes, moodRes, xaiRes] = await Promise.allSettled([
    fetchNews(ticker, 7),
    fetchSentimentScore(ticker, 30),
    fetchMarketMood(ticker, 30),
    fetchXAI(ticker),
  ]);

  const news = newsRes.status === "fulfilled" ? newsRes.value.data || [] : [];
  const sentiment = sentimentRes.status === "fulfilled" ? sentimentRes.value : { average_score: 0 };
  const mood = moodRes.status === "fulfilled" ? moodRes.value : { dominant_mood: "Neutral", summary: "No data" };
  const xai = xaiRes.status === "fulfilled" ? xaiRes.value : { keywords: [] };

  return (
    <section className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-2">{ticker} Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-slate-700 rounded">
          <div className="text-sm text-zinc-300">Average Sentiment</div>
          <div className="text-2xl font-bold">{(sentiment.average_score ?? 0).toString()}</div>
          <div className="text-xs text-zinc-400">based on recent articles</div>
        </div>

        <div className="p-4 bg-slate-700 rounded">
          <div className="text-sm text-zinc-300">Market Mood</div>
          <div className="text-2xl font-bold">{mood.dominant_mood ?? "Neutral"}</div>
          <div className="text-xs text-zinc-400">{mood.summary ?? "No summary"}</div>
        </div>

        <div className="p-4 bg-slate-700 rounded">
          <div className="text-sm text-zinc-300">Top Keywords</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(xai.keywords || []).slice(0, 8).map((k: any) => (
              <span key={k.word} className="text-xs bg-slate-600 px-2 py-1 rounded">
                {k.word}
              </span>
            ))}
            {!(xai.keywords || []).length && (
              <span className="text-xs text-zinc-400">No keywords</span>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Recent News</h3>
        {news.length === 0 ? (
          <p className="text-sm text-zinc-400">No recent news found.</p>
        ) : (
          <ul className="space-y-3">
            {news.slice(0, 6).map((n: any, idx: number) => (
              <li key={idx} className="p-3 bg-slate-700 rounded">
                <div className="font-medium">{n.title}</div>
                <div className="text-xs text-zinc-400">{n.source} • {n.created_at}</div>
                <div className="text-sm text-zinc-200 mt-1">{n.context?.slice(0, 220)}{n.context && n.context.length > 220 ? '…' : ''}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
