<h1>
 🔍 Natural Language FAQ Search (FAQ Chatbot)
</h1>

Search through FAQs using natural language queries. The system uses Typesense to provide fast and relevant search results for frequently asked questions.

## Tech Stack

- <a href="https://github.com/typesense/typesense" target="_blank">Typesense</a> - Fast, typo-tolerant search engine
- React - Frontend framework
- TypeScript - Type-safe JavaScript
- Tailwind CSS - Utility-first CSS framework
- Vite
- Docker

## Project Structure

```bash
├── src/
│   ├── data/
│   │   └── faqData.jsonl # FAQ data in JSONL format
│   ├── components/
│   │   └── ChatMessage.tsx # Message component for Q&A display
│   ├── lib/
│   │   ├── searchFAQ.ts # FAQ search functionality
│   │   └── typesense.ts # Typesense client configuration
│   └── App.tsx # Main application component
```

## Development

To run this project locally:

1. Start Typesense server:

```shell
npm run start:typesense # or: docker compose up
```

or

```shell
docker compose up
```

2. Index FAQ data into Typesense:

```shell
npm run index:typesense
```

3. Start the development server:

```shell
npm run dev
```

Open http://localhost:5173 to see the app 🚀

## Features

- Natural language search for FAQs
- Fast and typo-tolerant search powered by Typesense
- Clean and responsive UI
- Markdown support in answers
- Real-time search results

## Environment Variables

See [.env.example](.env.example) for required environment variables:

```env
TYPESENSE_API_KEY=your_api_key
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
```

## Created By

This project was created by <a href="https://github.com/ajoysrju" target="_blank">Ajoy Sarker</a>, a Full Stack Web Developer specializing in:

- Frontend: React.js, TypeScript, React Native
- Backend: Django, Node.js, NestJS
- Database: MongoDB
- Programming: Python
