export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

async function safeJson(res: Response) {
	if (!res.ok) {
		const txt = await res.text().catch(() => "");
		throw new Error(txt || `HTTP ${res.status}`);
	}
	return res.json();
}

export async function fetchNews() {
	const res = await fetch(`${API_BASE}/get_news`);
	return safeJson(res);
}

export async function fetchSentimentForTicker(ticker: string) {
	const url = `${API_BASE}/get_sentiment?ticker=${encodeURIComponent(ticker)}`;
	const res = await fetch(url);
	return safeJson(res);
}

export async function fetchAllSentiment() {
	const res = await fetch(`${API_BASE}/get_sentiment`);
	return safeJson(res);
}
