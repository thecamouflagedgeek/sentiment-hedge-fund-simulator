"use client";
import React, { useEffect, useState } from "react";
import { NewsItem } from "../../lib/types";
import { fetchNews } from "../../lib/api";

export default function NewsFeed() {
	const [items, setItems] = useState<NewsItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		fetchNews()
			.then((r) => {
				if (mounted) setItems(r || []);
			})
			.catch((e) => {
				console.error(e);
				if (mounted) setError("Failed to load news");
			})
			.finally(() => {
				if (mounted) setLoading(false);
			});
		return () => {
			mounted = false;
		};
	}, []);

	if (loading) return <div className="text-sm text-zinc-500">Loading...</div>;
	if (error) return <div className="text-sm text-red-500">{error}</div>;
	if (!items.length) return <div className="text-sm text-zinc-500">No recent news.</div>;

	return (
		<ul className="space-y-3">
			{items.map((it) => (
				<li key={it.id} className="flex items-start justify-between gap-4 rounded p-3 hover:bg-zinc-50">
					<div>
						<div className="text-sm font-medium">{it.headline}</div>
						<div className="text-xs text-zinc-500">{it.source} • {new Date(it.published_at).toLocaleString()}</div>
					</div>
					<div className="text-right">
						<div className={`text-sm font-semibold ${it.sentiment === "positive" ? "text-green-600" : it.sentiment === "negative" ? "text-red-600" : "text-zinc-600"}`}>
							{it.sentiment ?? "neutral"}
						</div>
						<div className="text-xs text-zinc-500">{Math.round((it.confidence ?? 0) * 100)}%</div>
						<div className="text-xs text-zinc-400">{it.ticker}</div>
					</div>
				</li>
			))}
		</ul>
	);
}
