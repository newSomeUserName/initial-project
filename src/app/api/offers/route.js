import {getSbpOffers} from "@/lib/bybit";

// GET /api/offers?amount=10000&sbpOnly=1
export async function GET(request)
{
    const params = request.nextUrl.searchParams;
    const amount = Number(params.get("amount")) || undefined;
    const sbpOnly = params.get("sbpOnly") === "1";

    try {
        return Response.json(await getSbpOffers({amount, sbpOnly}));
    }
    catch (error)
    {
        return Response.json({error: error.message}, {status: 502});
    }
}
