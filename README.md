# HSP Foods - One page makhana store (React + Vite + Firebase)

Customers order through WhatsApp (no payment gateway). The owner edits price,
packs, offer, photo and contact from `/#/admin`.

## Run locally
    npm install
    npm run dev
    npm run build

Without Firebase keys the site still works using defaults in `src/config.js`.

## Admin panel setup (one time, about 10 minutes, free plan)
1. Go to https://console.firebase.google.com > Add project (any name).
2. Build > Firestore Database > Create database > Production mode > pick a region (asia-south1 Mumbai).
3. Build > Authentication > Get started > Sign-in method > enable Email/Password.
   Then Users tab > Add user: enter the client's email and a strong password.
   Settings > User actions > turn ON "Disable user sign-up" (so nobody else can register).
4. Firestore > Rules tab: paste `firestore.rules`, replace ADMIN_EMAIL_HERE with the client's email, Publish.
5. Project settings (gear) > General > Your apps > Web (</>) > register app. Copy the
   firebaseConfig values into a new file `.env` (copy `.env.example`):
       VITE_FIREBASE_API_KEY=...
       VITE_FIREBASE_AUTH_DOMAIN=...
       VITE_FIREBASE_PROJECT_ID=...
       VITE_FIREBASE_APP_ID=...
6. Restart `npm run dev`, open http://localhost:5173/#/admin, log in, press "Save changes" once.
   The first save creates the data; after that the website reads from it live.

## Deploy on Vercel
Push to GitHub > Vercel > New Project > import. In Settings > Environment Variables add the
same 4 VITE_FIREBASE_* values, then redeploy. Admin link: https://your-site.com/#/admin
Also add your Vercel domain in Firebase > Authentication > Settings > Authorized domains.

## What the admin can change
Product name and line, product photo, pack sizes, price and old (strike-through) price,
shipping note, free-delivery limit, offer on/off with banner text and discount %, WhatsApp number, phone, email, location.
