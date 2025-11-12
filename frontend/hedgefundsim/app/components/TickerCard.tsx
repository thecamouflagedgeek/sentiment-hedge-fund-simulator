"use client";
import React from "react";
import Link from "next/link";

type Props = {
	ticker: string;
	avgSentiment: number;
	confidence?: number;
};

export default function TickerCard({ ticker, avgSentiment, confidence }: Props) {
	const sentimentLabel = avgSentiment > 0.05 ? "Positive" : avgSentiment < -0.05 ? "Negative" : "Neutral";
	const color = avgSentiment > 0.05 ? "text-green-600" : avgSentiment < -0.05 ? "text-red-600" : "text-zinc-600";

	return (
		<Link href={`/ticker/${ticker}`} className="block rounded-lg border p-4 hover:shadow">
			<div className="flex items-center justify-between">
				<div>
					<div className="text-sm font-medium">{ticker}</div>
					<div className={`text-lg font-semibold ${color}`}>{sentimentLabel}</div>
				</div>
				<div className="text-right">
					<div className="text-sm text-zinc-500">Avg</div>
					<div className="text-xl font-semibold">{avgSentiment.toFixed(2)}</div>
					{typeof confidence === "number" && <div className="text-xs text-zinc-500">conf {Math.round(confidence * 100)}%</div>}
				</div>
			</div>

			<div className="mt-3 h-8">
				<svg viewBox="0 0 100 20" className="w-full h-full">
					<polyline fill="none" stroke="#3b82f6" strokeWidth="1.5" points="0,14 20,10 40,12 60,6 80,8 100,4" />
				</svg>
			</div>
		</Link>
	);
}
