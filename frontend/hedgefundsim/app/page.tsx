import Navbar from "./components/Navbar";
import MarketGauge from "./components/MarketGauge";
import TickerCard from "./components/TickerCard";
import NewsCard from "./components/NewsCard";
import AIInsightBox from "./components/AIInsightBox";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-zinc-50">
			<Navbar />
			<main className="max-w-6xl mx-auto p-6 space-y-6">
				{/* AI Summary Banner */}
				<section>
					<AIInsightBox text="Market optimism rises as tech leads gains — keep an eye on earnings & macro updates." />
				</section>

				{/* Top row: Market Gauge + Search / Quick */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="col-span-1 md:col-span-1">
						<MarketGauge />
					</div>

					<div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Example ticker cards - in production replace with fetched list */}
						<TickerCard ticker="AAPL" avgSentiment={0.12} confidence={0.82} trend="up" />
						<TickerCard ticker="TSLA" avgSentiment={-0.18} confidence={0.76} trend="down" />
						<TickerCard ticker="MSFT" avgSentiment={0.05} confidence={0.68} trend="flat" />
					</div>
				</section>

				{/* Recent News Feed */}
				<section className="bg-slate-800/50 rounded-lg p-4">
					<h2 className="text-lg font-semibold mb-3">Recent News</h2>
					<div className="space-y-2 max-h-72 overflow-y-auto">
						{/* NewsCard is a client component that fetches /get_news */}
						<NewsCard />
					</div>
				</section>
			</main>
		</div>
	);
}
