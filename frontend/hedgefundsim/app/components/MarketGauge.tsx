"use client";
import React, { useEffect, useState } from "react";
import { fetchAllSentiment } from "../../lib/api";

export default function MarketGauge() {
	const [avg, setAvg] = useState<number | null>(null);
	useEffect(() => {
		let mounted = true;
		fetchAllSentiment()
			.then((rows: any[]) => {
				if (!mounted) return;
				if (!rows || !rows.length) return setAvg(0);
				const vals = rows.map(r => typeof r.sentiment === "number" ? r.sentiment : (r.sentiment === "positive" ? 0.5 : r.sentiment === "negative" ? -0.5 : 0));
				const mean = vals.reduce((a,b)=>a+b,0)/vals.length;
				setAvg(mean);
			})
			.catch(() => mounted && setAvg(0));
		return () => { mounted = false; };
	}, []);

	const display = avg ?? 0;
	const angle = 90 + (display + 1) * 45; // map -1..1 => 45..135
	return (
		<div className="rounded-lg bg-slate-800/40 p-4 w-full">
			<div className="text-sm text-slate-300 mb-2">Market Mood</div>
			<div className="flex items-center gap-4">
				<svg viewBox="0 0 100 50" className="w-36 h-20">
					<path d="M10 40 A40 40 0 0 1 90 40" stroke="#334155" strokeWidth={8} fill="none" />
					<g transform={`translate(50,40) rotate(${angle})`}>
						<line x1="0" y1="0" x2="0" y2="-30" stroke="#fef3c7" strokeWidth={2} strokeLinecap="round" />
					</g>
				</svg>
				<div>
					<div className="text-xl font-semibold">{avg !== null ? avg.toFixed(2) : "—"}</div>
					<div className="text-xs text-slate-400">Avg sentiment</div>
				</div>
			</div>
		</div>
	);
}
