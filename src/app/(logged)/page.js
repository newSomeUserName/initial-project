import {Suspense} from "react";
import OfferFilters from "@/components/offers/offer-filters";
import OffersTable from "@/components/offers/offers-table";

export default function HomePage({searchParams})
{
    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
            <header className="mb-8 border-b border-stone-200 pb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Bybit P2P · RUB → USDT
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                    Offers payable via СБП
                </h1>
                <p className="mt-3 max-w-2xl text-stone-600">
                    Every online ad where you buy USDT for rubles and can pay through
                    Система быстрых платежей. Cheapest first.
                </p>
            </header>

            <Suspense fallback={null}>
                <OfferFilters searchParams={searchParams}/>
            </Suspense>

            <Suspense fallback={<p className="py-12 text-center text-stone-500">Loading offers from Bybit…</p>}>
                <OffersTable searchParams={searchParams}/>
            </Suspense>
        </main>
    );
}
