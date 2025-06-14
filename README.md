# 📊 YouTube Comment Analyzer

An AI-powered web application that fetches comments from your YouTube videos and automatically categorizes them by **topic** and **sentiment** – helping content creators quickly understand feedback and improve their content.

![obraz](https://github.com/user-attachments/assets/a4d5fd76-bce7-45fb-a98c-64f1cf8299bd)
 <!-- Replace with actual image if available -->

---

## ✨ Features

- 🔐 **YouTube Authentication** – log in with Google to access your videos  
- 🎥 **Video Dashboard** – browse your uploaded videos with thumbnails, stats, and comment counts  
- 🧠 **AI Comment Analysis** – group viewer feedback by category (e.g., suggestions, editing tips, appreciation)  
- 😀 **Sentiment Grouping** – classify comments into positive, neutral, and negative tones  
- 📁 **Category Sidebar** – easily navigate feedback types, each with an emoji icon (🎬, 💡, 👏, etc.)  
- 💬 **Comment Viewer** – view comments grouped by themes and sentiment in a clean UI  

---

## 🖼 Demo

Coming soon...

---

## 🔧 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), TypeScript, Tailwind CSS, Framer Motion  
- **Backend**: [Supabase](https://supabase.com/) (auth, database, API)  
- **AI**: Gemini Pro or OpenAI GPT for comment analysis  
- **YouTube API**: for fetching authenticated user videos and comments  

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/youtube-comment-analyzer.git
cd youtube-comment-analyzer
```
### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a .env.local file and add the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_client_id
YOUTUBE_API_KEY=your_youtube_api_key
```
### 4. Run the dev server

```bash
npm run dev
```

App will be running at http://localhost:3000

## 📄 License

MIT License
