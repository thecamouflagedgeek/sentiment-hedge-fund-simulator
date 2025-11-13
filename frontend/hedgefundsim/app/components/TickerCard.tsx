"use client";
import Link from "next/link";
import React from "react";
import SentimentBadge from "./SentimentBadge";

export default function TickerCard({ ticker, avgSentiment, confidence, trend }: { ticker: string; avgSentiment: number; confidence?: number; trend?: "up"|"down"|"flat" }) {
	const label = avgSentiment > 0.05 ? "positive" : avgSentiment < -0.05 ? "negative" : "neutral";
	return (
		<Link href={`/ticker/${ticker}`} className="block rounded-lg bg-slate-800/40 p-3 hover:shadow">
			<div className="flex items-start justify-between">
				<div>
					<div className="text-sm font-medium">{ticker}</div>
					<div className="flex items-center gap-2">
						<div className="text-lg font-semibold">{avgSentiment.toFixed(2)}</div>
						<SentimentBadge sentiment={label} />
					</div>
				</div>
				<div className="text-right text-xs text-slate-400">
					<div>{confidence ? Math.round(confidence * 100) + "%" : "--"}</div>
					<div className="mt-1">{trend === "up" ? "▲" : trend === "down" ? "▼" : "—"}</div>
				</div>
			</div>

			{/* mini sparkline */}
			<div className="mt-3 h-8">
				<svg viewBox="0 0 100 20" className="w-full h-full">
					<polyline fill="none" stroke="#60a5fa" strokeWidth={1.5} points="0,14 20,10 40,12 60,6 80,8 100,4" />
				</svg>
			</div>
		</Link>
	);
}
