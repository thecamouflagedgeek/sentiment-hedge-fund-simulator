import TickerCard from "./components/TickerCard";
import NewsFeed from "./components/NewsFeed";

export default function Home() {
	return (
		<div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black p-8">
			<main className="w-full max-w-6xl">
				<header className="mb-6">
					<h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
						News Sentiment Dashboard
					</h1>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						Live FinBERT sentiment for tracked tickers.
					</p>
				</header>

				<section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
					{/* Market Mood / Hero */}
					<div className="col-span-1 md:col-span-3 rounded-lg border p-6 bg-white dark:bg-[#0b0b0b]">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-lg font-medium">Market Mood</h2>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">
									Aggregated sentiment across tickers.
								</p>
							</div>
							{/* Simple gauge approximation */}
							<div className="flex items-center gap-4">
								<div className="w-40 h-16 flex items-center justify-center">
									{/* placeholder gauge */}
									<svg viewBox="0 0 100 50" className="w-full h-full">
										<path d="M5 45 A45 45 0 0 1 95 45" stroke="#e5e7eb" strokeWidth={6} fill="none" />
										{/* Example needle at center */}
										<line x1="50" y1="45" x2="50" y2="10" stroke="#111827" strokeWidth={2} />
									</svg>
								</div>
								<div className="text-right">
									<div className="text-2xl font-semibold">0.12</div>
									<div className="text-sm text-zinc-600 dark:text-zinc-400">Average sentiment</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
					{/* Ticker Cards - in real app this list would be fetched */}
					<TickerCard ticker="AAPL" avgSentiment={0.12} confidence={0.82} />
					<TickerCard ticker="TSLA" avgSentiment={-0.18} confidence={0.76} />
					<TickerCard ticker="MSFT" avgSentiment={0.05} confidence={0.68} />
				</section>

				<section className="rounded-lg border p-6 bg-white dark:bg-[#0b0b0b]">
					<h3 className="text-lg font-medium mb-4">Recent News</h3>
					<NewsFeed />
				</section>
			</main>
		</div>
	);
}
