import TickerInsights from "../../components/TickerInsights";

// server component receives params from Next.js routing
export default function Page({ params }: { params: { ticker: string } }) {
	const ticker = params.ticker?.toUpperCase() ?? "UNKNOWN";
	return (
		<div className="p-8">
			<TickerInsights ticker={ticker} />
		</div>
	);
}
