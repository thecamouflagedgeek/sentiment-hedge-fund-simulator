export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function safeJson(res: Response) {
	if (!res.ok) {
		const txt = await res.text().catch(() => "");
		throw new Error(txt || `HTTP ${res.status}`);
	}
	return res.json();
}

export async function fetchNews(ticker: string, days: number = 7) {
	const res = await fetch(`${API_BASE}/fetch_news/${encodeURIComponent(ticker)}?days=${days}`);
	return safeJson(res);
}

export async function fetchSentimentScore(ticker: string, days: number = 30) {
	const res = await fetch(`${API_BASE}/sentiment_score/${encodeURIComponent(ticker)}?days=${days}`);
	return safeJson(res);
}

export async function fetchMarketMood(ticker: string, days: number = 30) {
	const res = await fetch(`${API_BASE}/market_mood/${encodeURIComponent(ticker)}?days=${days}`);
	return safeJson(res);
}

export async function runSimulation(ticker: string, start: string, end: string) {
	const res = await fetch(`${API_BASE}/simulate_strategy`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ticker, start, end }),
	});
	return safeJson(res);
}

export async function fetchXAI(ticker: string) {
	const res = await fetch(`${API_BASE}/xai/${encodeURIComponent(ticker)}`);
	const data = await safeJson(res);
	// Return the keywords array, with fallback
	return {
		keywords: data.keywords || []
	};
}
