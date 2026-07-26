## FashionHub internship exercise

FashionHub **mobile UI aligned to the provided design reference** (onboarding → Explore + bottom nav → product details → cart → checkout), on **React 19.2**, **Next.js 16.1+**, **TypeScript 5.9**, **Tailwind CSS 4.x**. Primary accent **`#FF7A00`**.

### Navigation Flow

- `/` → Onboarding
- `/explore` → Product listing
- `/products/:id` → Product details
- `/cart` → Cart
- `/checkout` → Checkout

### State Management

Cart and order state are handled via an in-memory store using Next.js Route Handlers.
State is scoped per session using an `httpOnly` cookie and trusted header (`x-fh-session-id`) set in `middleware.ts`.

### UI Design System

- Primary color: `#FF7A00`
- Rounded corners: `16px` to `24px` (with larger hero radii where required by the reference)
- Typography: clean, minimal, mobile-first
- Layout: 2-column product grid on Explore
- Spacing rhythm: `16px` and `24px` sections

### Responsiveness

The UI is built mobile-first and optimized for `360px` to `390px` widths.
Tested with Chrome DevTools mobile emulation (e.g., iPhone 13 / Pixel 5 class widths).

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for **onboarding** (bear art). **Sign In** / **Sign Up** both navigate to **Explore** (`/explore`) with categories, product grid, **`+` quick add**, and bottom navigation. Continue to product details, **Cart** (quantity ±, delete, Shipping line), and **Checkout** (address, payment radios, orange note, **Pay Now**).

### Production build

```bash
npm run build
npm run start
```

### Seeded data

[`src/lib/products-data.ts`](src/lib/products-data.ts). Primary detail reference: **`premium-tagerine-shirt`** (`/products/premium-tagerine-shirt`).

Cart + orders use an in-memory store per session; restarting the server clears carts/orders.

### Images

JPEG/PNG under [`public/images`](public/images) (onboarding bear, product shots, map thumb). No remote CDN required.

### API surface (Next.js Route Handlers)

| Method & path | Behaviour |
| --- | --- |
| `GET /api/products` | Lightweight list for cards/JSON clients. |
| `GET /api/products/:id` | Full `Product` payload. |
| `GET /api/cart` | Items + delivery math (UI helper). |
| `POST /api/cart` | Body: `{ productId, colorId?, size, quantity? }` — merges lines; persists size/color. |
| `PATCH /api/cart` | Body: `{ productId, colorId, size, quantity }` — set quantity (use `0` to remove the line). |
| `POST /api/orders` | Drains cart, simulates paid success, returns `{ orderId, paid: true }`. |

Session: `middleware.ts` sets an `httpOnly` cookie plus a sanitized `x-fh-session-id` header so the first `POST /api/cart` succeeds. See [`env.example`](env.example) for optional overrides.

### Deployment (Vercel)

Import repo → default build (`npm run build`) → deploy. No env vars required unless you rename session cookies/headers.

### Demo screencast (1–3 min)

- Open onboarding screen
- Navigate to Explore
- Select **Premium Tangerine Shirt**
- Add to cart
- Adjust quantity / remove item
- Proceed to checkout
- Select payment method
- Click **Pay Now** → order success

### Limitations

- Cart and orders are stored in-memory (reset on server restart)
- Payment is simulated (no real payment gateway integration)
- No full user authentication system (session-based test flow only)

### Optional Improvements

- Loading skeletons for async screens
- More toast feedback coverage
- Additional interaction polish (micro-animations / pressed states)

### Shortcuts

- Labels like “Shipping” / “Tangerine” follow the latest reference image; product `id` strings stay stable for URLs.
