# Deva AI (Next.js)

This project is now migrated to a Next.js app with:

- `/` login page (Firebase Auth)
- `/app` user chat app
- `/admin` admin dashboard (Firestore-backed)
- `/api/chat` secure server route using Google AI Studio (Gemini)

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Create local env file

```bash
cp .env.example .env.local
```

3. Fill `.env.local` values
- Set `GOOGLE_AI_STUDIO_API_KEY`
- Set `NEXT_PUBLIC_FIREBASE_*` values
- Set `NEXT_PUBLIC_DEVA_ADMIN_EMAIL`

4. Run dev server

```bash
npm run dev
```

Open: `http://localhost:3000`

## Deploy (Vercel)

1. Push to GitHub
2. Import the repo in Vercel
3. Add the same env vars in Vercel Project Settings
4. Redeploy
