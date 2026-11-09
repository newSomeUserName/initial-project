import {getSbpOffers, parseFiat} from "@/lib/bybit";

// GET /api/offers?fiat=USD&amount=100&sbpOnly=1
export async function GET(request)
{
    const params = request.nextUrl.searchParams;
    const fiat = parseFiat(params.get("fiat"));
    const amount = Number(params.get("amount")) || undefined;
    const sbpOnly = params.get("sbpOnly") === "1";

    try {
        return Response.json(await getSbpOffers({fiat, amount, sbpOnly}));
    }
    catch (error)
    {
        return Response.json({error: error.message}, {status: 502});
    }
}
