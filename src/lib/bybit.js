import {cacheLife} from "next/cache";

const API = "https://api2.bybit.com/fiat/otc";
const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
};

// Bybit's historical paymentType id for "SBP" (Система быстрых платежей).
// Used only if the id can't be found by name in Bybit's payment list.
export const SBP_FALLBACK_ID = "382";

// Matches a payment method NAME that is SBP.
const SBP_NAME = /(^|[^a-z])sbp([^a-z]|$)|сбп|быстрых платежей|fast payment system/i;

// Matches SBP mentioned in the ad's description (remark). "[сc]" also catches a Latin "C".
export const SBP_IN_REMARK = /[сc]бп|(^|[^a-z])sbp([^a-z]|$)|быстрых\s+платеж/i;

// Remarks that mention SBP only to say it is NOT accepted: "без СБП", "не СБП", "СБП не принимаю".
const SBP_REFUSED =
    /(без|не|кроме|no|not|without)\s+(через\s+|по\s+)?([сc]бп|sbp)|([сc]бп|sbp)\s*[-—:]?\s*(не\s|нет|no\b)/i;

// Remarks saying SBP is the only way to pay: "только СБП", "только по СБП", "only SBP".
const SBP_ONLY_IN_REMARK = /(только|only)\s+(через\s+|по\s+)?([сc]бп|sbp)|([сc]бп|sbp)\s+(только|only)/i;

export const PAGE_SIZE = 100;
const MAX_PAGES = 30;

async function post(path, body)
{
    const response = await fetch(`${API}${path}`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(body),
        cache: "no-store",
    });

    if (!response.ok)
        throw new Error(`Bybit responded with HTTP ${response.status}`);

    const json = await response.json();
    if (json.ret_code !== 0)
        throw new Error(`Bybit error ${json.ret_code}: ${json.ret_msg}`);

    return json.result;
}

/**
 * Map of paymentType id -> human readable name. Changes rarely, so cache it.
 */
export async function getPaymentNames()
{
    "use cache";
    cacheLife("hours");

    const result = await post("/configuration/queryAllPaymentList", {});
    const names = {};
    for (const p of result.paymentConfigVo ?? [])
        names[String(p.paymentType)] = p.paymentName || `#${p.paymentType}`;
    return names;
}

/**
 * Every paymentType id whose name looks like SBP / СБП.
 */
export function findSbpIds(paymentNames)
{
    const ids = Object.entries(paymentNames)
        .filter(([, name]) => SBP_NAME.test(name))
        .map(([id]) => id);

    if (!ids.includes(SBP_FALLBACK_ID))
        ids.push(SBP_FALLBACK_ID);

    return ids;
}

async function getOffersPage({amount, page})
{
    return post("/item/online", {
        userId: "",
        tokenId: "USDT",
        currencyId: "RUB",
        // No payment filter: many sellers pick "Bank Transfer" and write "СБП"
        // in the description, so we load everything and filter ourselves.
        payment: [],
        // "1" = ads where the advertiser SELLS USDT, i.e. you buy USDT for RUB
        side: "1",
        size: String(PAGE_SIZE),
        page: String(page),
        amount: amount ? String(amount) : "",
        authMaker: false,
        canTrade: false,
    });
}

/**
 * Where an ad says it accepts SBP:
 *  "payment" - SBP is one of the ad's payment methods
 *  "remark"  - SBP is mentioned in the ad's description
 *  null      - no SBP (or the description says SBP is not accepted)
 */
export function sbpSource(payments, remark, sbpSet)
{
    if (SBP_REFUSED.test(remark))
        return null;
    if (payments.some((id) => sbpSet.has(id)))
        return "payment";
    if (SBP_IN_REMARK.test(remark))
        return "remark";
    return null;
}

/**
 * All online ads where you can buy USDT with RUB and pay via SBP.
 *
 * @param {object}  options
 * @param {number}  [options.amount]   RUB you want to spend; ads whose limits don't fit are dropped
 * @param {boolean} [options.sbpOnly]  keep only ads where SBP is the only way to pay
 */
export async function getSbpOffers({amount, sbpOnly = false} = {})
{
    const paymentNames = await getPaymentNames().catch(() => ({}));
    const sbpIds = findSbpIds(paymentNames);

    const items = [];
    let total = 0;
    for (let page = 1; page <= MAX_PAGES; page++)
    {
        const result = await getOffersPage({amount, page});
        total = Number(result.count ?? 0);
        items.push(...(result.items ?? []));
        if (items.length >= total || (result.items ?? []).length < PAGE_SIZE)
            break;
    }

    const sbpSet = new Set(sbpIds);
    const offers = items
        .map((item) => toOffer(item, paymentNames, sbpSet))
        .filter((offer) => offer.sbpSource !== null)
        .filter((offer) => !sbpOnly || offer.sbpExclusive)
        .filter((offer) => !amount || (amount >= offer.minAmount && amount <= offer.maxAmount))
        .sort((a, b) => a.price - b.price);

    return {offers, total, scanned: items.length, sbpIds, fetchedAt: new Date().toISOString()};
}

function toOffer(item, paymentNames, sbpSet)
{
    const payments = (item.payments ?? []).map(String);
    const remark = item.remark ?? "";
    const price = Number(item.price);
    const available = Number(item.lastQuantity);

    return {
        id: item.id,
        nickName: item.nickName,
        isOnline: Boolean(item.isOnline),
        price,
        available,
        minAmount: Number(item.minAmount),
        maxAmount: Math.min(Number(item.maxAmount), available * price),
        orders: Number(item.recentOrderNum ?? 0),
        completionRate: Number(item.recentExecuteRate ?? 0),
        payments: payments.map((id) => ({
            id,
            name: paymentNames[id] ?? (id === SBP_FALLBACK_ID ? "SBP" : `#${id}`),
            isSbp: sbpSet.has(id),
        })),
        sbpSource: sbpSource(payments, remark, sbpSet),
        sbpExclusive:
            (payments.length > 0 && payments.every((id) => sbpSet.has(id))) ||
            SBP_ONLY_IN_REMARK.test(remark),
        remark,
    };
}
