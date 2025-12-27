# FlowSuit - ProfitEngine

> Professional project management and invoicing platform for freelancers and agencies.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Auth:** Supabase
- **Icons:** Lucide React
- **Utils:** clsx, tailwind-merge

## Getting Started

First, install dependencies:

```bash
npm install
```

Configure your environment variables:

```bash
cp .env.local.example .env.local
# Add your Supabase credentials
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/src
  /app          - Next.js App Router pages
  /components   - React components
  /lib          - Utility functions & Supabase clients
  /types        - TypeScript type definitions
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
