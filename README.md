# Diamond Academy — Ota-onalar kabineti (alohida Next.js loyiha)

## O'rnatish

```bash
npx create-next-app@latest parent-portal
# TypeScript: Yes, Tailwind: Yes, ESLint: Yes, src/ directory: Yes, App Router: Yes, alias: @/*

cd parent-portal
npm i axios @tanstack/react-query lucide-react
```

1. Shu arxivdagi `src/` papkasini loyihangizdagi `src/` ustiga ko'chiring (almashtiring).
2. `src/app/globals.css` ni almashtiring:
   - **Tailwind v4**:
     ```css
     @import "tailwindcss";
     body { background: #f9fafb; color: #111827; }
     ```
   - **Tailwind v3**:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     body { background: #f9fafb; color: #111827; }
     ```
3. `.env.local` yarating:
   ```
   NEXT_PUBLIC_API_URL=https://SIZNING-BACKEND.up.railway.app
   ```
4. Backend `main.ts` dagi CORS ga yangi frontend manzilini (Vercel domeni va `http://localhost:3000`) qo'shing.
5. `npm run dev` → http://localhost:3000

## Vercel
Yangi repo → Vercel'ga import → Environment Variables: `NEXT_PUBLIC_API_URL`.

## Sahifalar
- `/login` — kirish / ro'yxatdan o'tish
- `/parent` — farzandlar ro'yxati va so'rov holati
- `/parent/add` — guruh → o'quvchi → so'rov yuborish
- `/parent/child/[studentId]` — statistika (davomat, olmos, to'lov, imtihon)

## Eslatma
Backend `POST /parent/register` akkaunt yo'q bo'lsa avtomatik yaratadi. Kirish rejimida
noto'g'ri telefon kiritilsa, yangi akkaunt ochilib ketishi mumkin. Xohlasangiz backendga
alohida `POST /parent/login` qo'shib, `parentApi.ts` ni shunga o'tkazish mumkin.
Token 1 kunlik: muddati tugasa avtomatik `/login` ga qaytariladi.
