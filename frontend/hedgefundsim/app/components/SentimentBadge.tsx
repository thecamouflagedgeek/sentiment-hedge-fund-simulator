"use client";
import React from "react";

export default function SentimentBadge({ sentiment }: { sentiment: "positive" | "neutral" | "negative" }) {
	const cls = sentiment === "positive" ? "bg-green-600/20 text-green-300" : sentiment === "negative" ? "bg-red-600/20 text-red-300" : "bg-slate-600/20 text-slate-300";
	return <span className={`inline-block px-2 py-0.5 text-xs rounded ${cls}`}>{sentiment}</span>;
}
