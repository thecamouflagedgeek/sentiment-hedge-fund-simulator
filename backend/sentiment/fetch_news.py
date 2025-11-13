import requests
def get_news():
    print("Fetching news from API...")  # Debug line
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": "finance OR stock market OR economy",
        "language": "en",
        "sortBy": "publishedAt",
        "apiKey": "a192c5ac149e4a7abf123eeb812e85bc"
    }
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Triggers error if bad response
        data = response.json()
        print(f"✅ API Status: {response.status_code}")
        print(f"✅ Articles Fetched: {len(data.get('articles', []))}")
        return data.get("articles", [])
    except Exception as e:
        print(f"❌ Error fetching news: {e}")
        return []

if __name__ == "__main__":
    news = get_news()
    print(f"Fetched {len(news)} articles.")
    if news:
        print("Sample article:", news[0].get("title", "No title"))

