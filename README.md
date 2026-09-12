# 📰 NewsLens — AI-Powered News Aggregator & Sentiment Dashboard

NewsLens is a modern news aggregation dashboard that brings together live headlines, category-based browsing, article search, bookmarks, reading history, trending topics, and analytics in one place.

Built with **React, TypeScript, Vite, and Tailwind CSS**, NewsLens provides a clean, responsive reading experience with a secure serverless proxy for NewsAPI.

> **Live data:** NewsLens can fetch headlines through NewsAPI. If no API key is configured, the application uses its built-in curated article dataset.

---

## ✨ Features

### 📰 News Feed

* Browse news articles from different categories.
* View headlines, summaries, sources, and publication times.
* Open articles in a dedicated reading view.
* Navigate through available news pages.

### 🔍 Search & Categories

* Search for articles using keywords.
* Explore categories such as:

  * Technology
  * AI
  * Business
  * Sports
  * Science
  * World
  * India
  * Entertainment

### 📈 Trending & Analytics

* Explore trending news topics.
* View news-related analytics and visualizations.
* Understand article and reading activity through dashboard insights.

### 🔖 Bookmarks & Reading History

* Save articles for later.
* View bookmarked articles in a dedicated section.
* Track previously opened articles through reading history.

### 🎨 User Experience

* Dark and light mode support.
* Responsive dashboard layout.
* Breaking-news ticker.
* Market information strip.
* Notifications panel.
* Loading skeletons for a smoother experience.
* Live/Mock status indicator.

---

## 🛠️ Tech Stack

| Technology                  | Purpose                           |
| --------------------------- | --------------------------------- |
| React 19                    | Frontend UI                       |
| TypeScript                  | Type-safe development             |
| Vite                        | Development server and build tool |
| Tailwind CSS 4              | Styling                           |
| Recharts                    | Analytics and data visualization  |
| NewsAPI                     | Live news data                    |
| Vercel Serverless Functions | Secure API proxy                  |
| pnpm                        | Package management                |

---

## 📁 Project Structure

```text
news_app/
├── api/
│   └── news.js                 # Serverless NewsAPI proxy
│
├── src/
│   ├── components/             # Reusable UI components
│   ├── context/                # Application state management
│   ├── pages/                  # Main application pages
│   ├── services/
│   │   └── newsApi.ts          # NewsAPI integration
│   ├── App.tsx                 # Main application shell
│   ├── data.ts                 # Curated article data
│   ├── theme.ts                # Theme configuration
│   ├── index.css               # Global styles
│   └── main.tsx                # Application entry point
│
├── .env.example                # Environment variable template
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── vercel.json                 # Vercel configuration
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd news_app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file using the provided example:

```bash
cp .env.example .env
```

Add your NewsAPI key:

```env
NEWS_API_KEY=your_newsapi_key
```

You can obtain a key from [NewsAPI](https://newsapi.org?utm_source=chatgpt.com).

> **Security:** The API key is used by the serverless function and is not exposed to the browser.

### 4. Start the Development Server

```bash
pnpm dev
```

Open the local URL shown in the terminal to view the application.

---

## 🔌 API Integration

NewsLens uses a serverless proxy to communicate with NewsAPI.

### Frontend Request

```text
GET /api/news?type=headlines&category=technology&pageSize=20&page=1
```

### Search Request

```text
GET /api/news?type=search&q=artificial+intelligence&pageSize=20&page=1
```

### How It Works

```text
User
  │
  ▼
NewsLens React Application
  │
  ▼
/api/news Serverless Function
  │
  ▼
NewsAPI
  │
  ▼
News Articles
  │
  ▼
NewsLens Dashboard
```

The serverless function:

* Reads `NEWS_API_KEY` from environment variables.
* Requests headlines or search results from NewsAPI.
* Returns the API response to the frontend.
* Applies short-term caching to successful responses.
* Returns a clear error response if the API is unavailable.

---

## 🌐 Deployment

NewsLens can be deployed using [Vercel](https://vercel.com?utm_source=chatgpt.com).

### Deployment Steps

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the following environment variable:

```env
NEWS_API_KEY=your_newsapi_key
```

4. Deploy the project.
5. Redeploy after adding or changing environment variables if required.

Vercel automatically handles the Vite application and the `api/` serverless function.

---

## 📜 Available Scripts

| Command        | Description                   |
| -------------- | ----------------------------- |
| `pnpm dev`     | Starts the development server |
| `pnpm build`   | Creates a production build    |
| `pnpm preview` | Previews the production build |
| `pnpm format`  | Formats the project files     |

---

## 🔐 Security

* API keys are stored in environment variables.
* NewsAPI requests are handled through a serverless proxy.
* No API key is hardcoded in the frontend.
* No third-party CORS proxy is required.

**Never commit your `.env` file or expose your API key in client-side code.**

---

## 📌 Current Limitations

* Live news requires a valid NewsAPI key.
* Without a configured key, the application uses its built-in curated dataset.
* Article sentiment scores are currently generated by the application's article transformation logic rather than a dedicated AI sentiment model.
* NewsAPI availability and usage limits may affect live data.

---

## 🔮 Future Enhancements

* 🤖 Integrate a dedicated AI sentiment analysis model.
* 🧠 Add article summarization using an AI API.
* 🌍 Support more news sources and languages.
* 📊 Improve analytics with historical news trends.
* 🔔 Add personalized breaking-news alerts.
* 👤 Add user accounts and cloud-synced bookmarks.
* 🗄️ Store reading history and preferences in a database.
* 📰 Add more advanced filtering and personalization.

---

## 📄 License

This project is available for educational and personal use under MIT license.

---
