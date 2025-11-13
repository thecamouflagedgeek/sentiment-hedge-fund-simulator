"use client";
import React, { useEffect, useState } from "react";
import { SentimentRecord } from "../../lib/types";
import { fetchSentimentForTicker } from "../../lib/api";

export default function TickerInsights({ ticker }: { ticker: string }) {
	const [rows, setRows] = useState<SentimentRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<{ sentiment?: string }>({});

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		fetchSentimentForTicker(ticker)
			.then((r) => mounted && setRows(r || []))
			.catch((e) => console.error(e))
			.finally(() => mounted && setLoading(false));
		return () => { mounted = false; };
	}, [ticker]);

	function exportCsv() {
		const header = ["id", "created_at", "headline", "sentiment", "confidence", "ticker"];
		const data = rows.map(r => [r.id, r.created_at, `"${r.headline.replace(/"/g,'""')}"`, String(r.sentiment), String(r.confidence ?? ""), r.ticker]);
		const csv = [header.join(","), ...data.map(d => d.join(","))].join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${ticker}_sentiment.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const filtered = rows.filter(r => !filter.sentiment || String(r.sentiment) === filter.sentiment);

	return (
		<div>
			<header className="mb-4">
				<h1 className="text-2xl font-semibold">{ticker} — Ticker Insights</h1>
				<p className="text-sm text-slate-400">Daily trend, confidence heatmap and news breakdown</p>
			</header>

			<div className="mb-4 flex items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<select onChange={(e)=>setFilter({ ...filter, sentiment: e.target.value || undefined })} className="rounded px-2 py-1 bg-slate-800">
						<option value="">All</option>
						<option value="positive">Positive</option>
						<option value="neutral">Neutral</option>
						<option value="negative">Negative</option>
					</select>
					<button className="ml-2 rounded bg-sky-600 px-3 py-1" onClick={exportCsv}>Export CSV</button>
				</div>
			</div>

			<section className="rounded bg-slate-800/40 p-4">
				{loading ? <div className="text-sm text-slate-400">Loading...</div> : (
					<>
						{/* Simple trend sparkline */}
						<div className="h-36 mb-4">
							<svg viewBox="0 0 100 30" className="w-full h-full">
								<polyline fill="none" stroke="#34d399" strokeWidth={1.5} points={
									rows.slice(-20).map((r,i)=>{
										const x = (i / Math.max(1, Math.min(19, rows.length-1))) * 100;
										const y = 15 - (typeof r.sentiment === "number" ? r.sentiment : 0) * 7;
										return `${x},${y}`;
									}).join(" ")
								} />
							</svg>
						</div>

						<table className="w-full text-left text-sm">
							<thead>
								<tr className="text-slate-300">
									<th className="py-2">When</th>
									<th className="py-2">Headline</th>
									<th className="py-2">Sentiment</th>
									<th className="py-2">Conf</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map(r => (
									<tr key={r.id} className="border-t border-slate-700">
										<td className="py-2 text-xs text-slate-400">{new Date(r.created_at).toLocaleString()}</td>
										<td className="py-2">{r.headline}</td>
										<td className="py-2 text-xs">{typeof r.sentiment === "number" ? r.sentiment.toFixed(2) : r.sentiment}</td>
										<td className="py-2 text-xs">{Math.round((r.confidence ?? 0) * 100)}%</td>
									</tr>
								))}
							</tbody>
						</table>
					</>
				)}
			</section>
		</div>
	);
}
