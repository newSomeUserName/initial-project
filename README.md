# Bybit P2P · СБП offers

Shows every online Bybit P2P ad where you can **buy USDT with USD** (or RUB, selectable) and **pay via
Система быстрых платежей (СБП / SBP)**, sorted cheapest first.

- Filter by how much you want to spend: ads whose limits don't fit are hidden,
  and you see how much USDT you'd get from each one.
- Optional "СБП only" toggle: keep only ads whose *sole* payment method is СБП.
- `GET /api/offers?fiat=USD&amount=100&sbpOnly=1` returns the same data as JSON.

## How it works

`src/lib/bybit.js` calls Bybit's public P2P endpoints (no API key needed):

- `POST https://api2.bybit.com/fiat/otc/configuration/queryAllPaymentList` to get payment
  method names. The SBP id is found by name (SBP / СБП / "быстрых платежей"), with `382`
  as a fallback.
- `POST https://api2.bybit.com/fiat/otc/item/online` with `tokenId=USDT`, `currencyId=USD` (or `RUB`),
  `side=1` (sellers' ads, so you buy), paging until all ads are loaded.
- An ad counts as СБП if SBP is one of its payment methods **or** its description mentions
  СБП / SBP / "быстрых платежей". Descriptions like "без СБП" or "СБП не принимаю" are excluded.

Bybit only shows RUB ads to some regions. If the list is empty, run the server from a
location where RUB P2P is available on Bybit.

## Running

Auth uses Neon Auth, so `.env.local` needs `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET`.

```bash
npm install
npm run dev
```

Open http://localhost:3000.
