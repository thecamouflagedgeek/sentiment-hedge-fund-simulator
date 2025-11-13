"use client";
import React from "react";

export default function AIInsightBox({ text }: { text: string }) {
	return (
		<div className="rounded-lg border border-slate-700/40 p-4 bg-gradient-to-r from-slate-900/20 to-slate-800/20">
			<div className="text-sm text-slate-300 font-medium">AI Market Summary</div>
			<div className="mt-2 text-sm text-slate-200">{text}</div>
		</div>
	);
}
