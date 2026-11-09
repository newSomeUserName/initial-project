import {getSbpOffers, parseFiat} from "@/lib/bybit";

const money = new Intl.NumberFormat("ru-RU", {maximumFractionDigits: 3});
const usdt = new Intl.NumberFormat("ru-RU", {maximumFractionDigits: 4});

const BYBIT_LINK = "https://www.bybit.com/fiat/trade/otc/?actionType=1&token=USDT";

export default async function OffersTable({searchParams})
{
    const params = await searchParams;
    const fiat = parseFiat(params.fiat);
    const amount = Number(params.amount) || undefined;
    const sbpOnly = params.sbpOnly === "1";

    let data;
    try {
        data = await getSbpOffers({fiat, amount, sbpOnly});
    }
    catch (error)
    {
        return (
            <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
                Couldn’t load offers from Bybit: {error.message}
            </p>
        );
    }

    const {offers, fetchedAt, sbpIds, scanned} = data;

    return (
        <section>
            <p className="mb-3 flex flex-wrap justify-between gap-2 text-sm text-stone-500">
                <span>
                    {offers.length} {offers.length === 1 ? "offer" : "offers"}
                    {amount ? ` that accept ${money.format(amount)} ${fiat}` : ""} · {scanned} ads scanned
                </span>
                <span>
                    Updated {new Date(fetchedAt).toLocaleTimeString("ru-RU")} ·{" "}
                    <a
                        href={`${BYBIT_LINK}&fiat=${fiat}&paymentMethod=${sbpIds[0]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-4 hover:text-stone-900"
                    >
                        open on Bybit
                    </a>
                </span>
            </p>

            {offers.length === 0 ? (
                <p className="rounded-xl border border-dashed border-stone-300 p-10 text-center text-stone-600">
                    No СБП offers for {fiat} right now.
                    {fiat === "RUB" && " Bybit only shows RUB ads to some regions, so the server must run from a location where RUB P2P is available."}
                </p>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">Seller</th>
                                <th className="px-4 py-3 text-right font-medium">Price, {fiat}</th>
                                {amount && <th className="px-4 py-3 text-right font-medium">You get, USDT</th>}
                                <th className="px-4 py-3 text-right font-medium">Available, USDT</th>
                                <th className="px-4 py-3 text-right font-medium">Limits, {fiat}</th>
                                <th className="px-4 py-3 font-medium">Payment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {offers.map((offer) => (
                                <OfferRow key={offer.id} offer={offer} amount={amount}/>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

function OfferRow({offer, amount})
{
    return (
        <tr className="align-top hover:bg-stone-50">
            <td className="px-4 py-3">
                <div className="flex items-center gap-2 font-medium text-stone-900">
                    <span
                        aria-label={offer.isOnline ? "online" : "offline"}
                        className={`size-2 rounded-full ${offer.isOnline ? "bg-emerald-500" : "bg-stone-300"}`}
                    />
                    {offer.nickName}
                </div>
                <div className="mt-0.5 text-xs text-stone-500">
                    {offer.orders} orders · {offer.completionRate}% completed
                </div>
            </td>
            <td className="px-4 py-3 text-right text-base font-semibold tabular-nums text-stone-950">
                {money.format(offer.price)}
            </td>
            {amount && (
                <td className="px-4 py-3 text-right tabular-nums text-stone-900">
                    {usdt.format(amount / offer.price)}
                </td>
            )}
            <td className="px-4 py-3 text-right tabular-nums text-stone-700">
                {usdt.format(offer.available)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-stone-700">
                {money.format(offer.minAmount)} – {money.format(offer.maxAmount)}
            </td>
            <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                    {offer.payments.map((p) => (
                        <span
                            key={p.id}
                            className={`rounded px-1.5 py-0.5 text-xs ${p.isSbp ? "bg-amber-100 font-medium text-amber-900" : "bg-stone-100 text-stone-600"}`}
                        >
                            {p.name}
                        </span>
                    ))}
                    {offer.sbpSource === "remark" && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-900">
                            СБП in description
                        </span>
                    )}
                </div>
                {offer.remark && (
                    <details className="mt-2 max-w-md text-xs text-stone-600" open={offer.sbpSource === "remark"}>
                        <summary className="cursor-pointer select-none text-stone-500 hover:text-stone-900">
                            Description
                        </summary>
                        <p className="mt-1 whitespace-pre-wrap break-words leading-5">
                            <Highlighted text={offer.remark}/>
                        </p>
                    </details>
                )}
            </td>
        </tr>
    );
}

const SBP_WORDS = /([сc]бп|sbp|быстрых\s+платеж\S*)/gi;

function Highlighted({text})
{
    return text.split(SBP_WORDS).map((part, i) =>
        i % 2 === 1
            ? <mark key={i} className="rounded bg-amber-200 px-0.5 text-amber-950">{part}</mark>
            : part
    );
}
