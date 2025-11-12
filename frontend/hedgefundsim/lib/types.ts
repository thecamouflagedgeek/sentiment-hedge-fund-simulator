export type NewsItem = {
	id: string;
	headline: string;
	source?: string;
	ticker?: string;
	published_at: string;
	sentiment?: "positive" | "neutral" | "negative";
	confidence?: number;
};

export type SentimentRecord = {
	id: string;
	ticker: string;
	headline: string;
	sentiment: number | "positive" | "neutral" | "negative";
	confidence?: number;
	created_at: string;
};
