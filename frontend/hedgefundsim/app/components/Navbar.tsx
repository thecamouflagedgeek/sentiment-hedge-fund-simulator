"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Navbar() {
	const router = useRouter();
	const [q, setQ] = useState("");
	return (
		<header className="w-full border-b border-slate-700 bg-gradient-to-r from-black/40 to-slate-900/40">
			<div className="max-w-6xl mx-auto flex items-center justify-between p-4 gap-4">
				<div className="flex items-center gap-4">
					<Link href="/" className="text-xl font-bold">SentimentHub</Link>
					<nav className="hidden md:flex gap-3 text-sm">
						<Link href="/" className="hover:underline">Dashboard</Link>
						<Link href="/mood" className="hover:underline">Market Mood</Link>
						<Link href="/ticker/AAPL" className="hover:underline">Ticker Insights</Link>
						<Link href="/admin" className="hover:underline">Admin</Link>
					</nav>
				</div>

				<div className="flex-1 max-w-md">
					<form onSubmit={(e) => { e.preventDefault(); if (q.trim()) router.push(`/ticker/${q.trim().toUpperCase()}`); }}>
						<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ticker (e.g. AAPL)" className="w-full rounded-md px-3 py-2 bg-slate-700/40 placeholder:text-slate-400" />
					</form>
				</div>

				<div className="flex items-center gap-3">
					<Link href="/login" className="text-sm px-3 py-1 border rounded">Login</Link>
					<Link href="/profile" className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs">JD</Link>
				</div>
			</div>
		</header>
	);
}
