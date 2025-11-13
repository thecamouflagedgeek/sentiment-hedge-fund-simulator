"use client";
import React, { useEffect, useState } from "react";
import { NewsItem } from "../../lib/types";
import { fetchNews } from "../../lib/api";
import SentimentBadge from "./SentimentBadge";

export default function NewsCard() {
	const [items, setItems] = useState<NewsItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		fetchNews()
			.then((r) => mounted && setItems(r || []))
			.catch((e) => { console.error(e); mounted && setError("Failed to load news"); })
			.finally(() => mounted && setLoading(false));
		return () => { mounted = false; };
	}, []);

	if (loading) return <div className="text-sm text-slate-400">Loading news...</div>;
	if (error) return <div className="text-sm text-red-400">{error}</div>;
	if (!items.length) return <div className="text-sm text-slate-400">No recent news.</div>;

	return (
		<ul className="space-y-2">
			{items.map((it) => {
				const s = (it.sentiment ?? "neutral") as "positive" | "neutral" | "negative";
				return (
					<li key={it.id} className="p-3 rounded-md hover:bg-slate-700/40">
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1">
								<div className="text-sm font-medium">{it.headline}</div>
								<div className="text-xs text-slate-400 mt-1">{it.source} • {new Date(it.published_at).toLocaleString()}</div>
							</div>
							<div className="flex flex-col items-end gap-1">
								<SentimentBadge sentiment={s} />
								<div className="text-xs text-slate-400">{Math.round((it.confidence ?? 0) * 100)}%</div>
								<div className="text-xs text-slate-500">{it.ticker}</div>
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
