<p align="center">
  <b>AI-SINK: An Open-Source AI-Powered Search Engine</b><br>
  Harnessing the power of advanced language models and modern search APIs.
</p>

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router) with Tailwind CSS for styling
- **LLM Inference:** Together AI
- **LLMs:** Mixtral 8x7B & Llama-3
- **Search API:** Bing Search
- **Observability:** Helicone
- **Analytics:** Plausible

## 🔍 How AI-SINK Works

1. **User Query:** The system accepts a user’s question.
2. **Search API Call:** A request is sent to the Bing Search API to retrieve the top 6 search results.
3. **Context Generation:** Text is scraped from the top 6 links, which serves as contextual data.
4. **LLM Inference:** The user's question, combined with the contextual data, is sent to the Mixtral-8x7B model. The response is streamed directly to the user.
5. **Follow-up Suggestions:** A secondary request to the Llama-3-8B model generates three follow-up questions for the user to explore further.

## 🛠 Setup and Running Locally

1. **Clone the Repo:** Fork or clone this repository.
2. **Create Accounts:** 
   - Sign up at [Together AI](https://dub.sh/together-ai) for LLM access.
   - Sign up for a search API key from [SERP API](https://serper.dev/) or [Bing Search API](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api).
   - Register with [Helicone](https://www.helicone.ai/) for monitoring and observability.
3. **Configure Environment:** 
   - Use the `.example.env` file as a reference to create a `.env` file. Add the necessary API keys.
4. **Run the Application:** 
   - Install dependencies: `npm install`
   - Start the development server: `npm run dev`

## ✨ Inspiration

AI-SINK draws inspiration from innovative search platforms like:
- **You.com**
- **Lepton Search**
