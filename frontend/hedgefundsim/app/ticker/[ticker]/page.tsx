import TickerInsights from "../../components/TickerInsights";

export default function Page({ params }: { params: { ticker: string } }) {
	const ticker = params.ticker?.toUpperCase() ?? "UNKNOWN";
	return (
		<div className="min-h-screen bg-slate-900 text-zinc-50">
			<div className="max-w-5xl mx-auto p-6">
				<TickerInsights ticker={ticker} />
			</div>
		</div>
	);
}
