"use client";
import React, { useEffect, useState } from "react";
import { SentimentRecord } from "../../lib/types";
import { fetchSentimentForTicker } from "../../lib/api";

export default function TickerInsights({ ticker }: { ticker: string }) {
	const [rows, setRows] = useState<SentimentRecord[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		fetchSentimentForTicker(ticker)
			.then((r) => {
				if (mounted) setRows(r || []);
			})
			.catch((e) => console.error(e))
			.finally(() => {
				if (mounted) setLoading(false);
			});
		return () => {
			mounted = false;
		};
	}, [ticker]);

	const points = rows
		.slice()
		.reverse()
		.map((r, i) => ({ x: i, y: typeof r.sentiment === "number" ? r.sentiment : 0 }));

	return (
		<div>
			<header className="mb-4">
				<h2 className="text-xl font-semibold">{ticker} • Sentiment</h2>
				<p className="text-sm text-zinc-500">Daily trend and news breakdown</p>
			</header>

			<section className="mb-6">
				<div className="rounded border p-4">
					{loading ? (
						<div className="text-sm text-zinc-500">Loading...</div>
					) : rows.length ? (
						<>
							<div className="h-40 w-full mb-4">
								<svg viewBox="0 0 100 40" className="w-full h-full">
									<polyline
										fill="none"
										stroke="#10b981"
										strokeWidth={1.5}
										points={points
											.map((p, i) => {
												const x = (i / Math.max(1, points.length - 1)) * 100;
												const y = 30 - (p.y + 1) * 10; // approximate mapping for -1..1
												return `${x},${y}`;
											})
											.join(" ")}
									/>
								</svg>
							</div>

							<table className="w-full text-left text-sm">
								<thead>
									<tr>
										<th className="pb-2">When</th>
										<th className="pb-2">Headline</th>
										<th className="pb-2">Sentiment</th>
										<th className="pb-2">Conf</th>
									</tr>
								</thead>
								<tbody>
									{rows.map((r) => (
										<tr key={r.id} className="border-t">
											<td className="py-2 text-xs text-zinc-500">{new Date(r.created_at).toLocaleString()}</td>
											<td className="py-2">{r.headline}</td>
											<td className="py-2 text-xs">{typeof r.sentiment === "number" ? r.sentiment.toFixed(2) : r.sentiment}</td>
											<td className="py-2 text-xs">{Math.round((r.confidence ?? 0) * 100)}%</td>
										</tr>
									))}
								</tbody>
							</table>
						</>
					) : (
						<div className="text-sm text-zinc-500">No records for this ticker.</div>
					)}
				</div>
			</section>
		</div>
	);
}
