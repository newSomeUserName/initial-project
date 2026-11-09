export default async function OfferFilters({searchParams})
{
    const params = await searchParams;

    return (
        <form method="get" className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div>
                <label htmlFor="amount" className="mb-1 block text-sm text-stone-600">
                    I want to spend (RUB)
                </label>
                <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="numeric"
                    placeholder="e.g. 10000"
                    defaultValue={params.amount ?? ""}
                    className="w-44 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                />
            </div>

            <label className="flex items-center gap-2 pb-2 text-sm text-stone-700">
                <input
                    type="checkbox"
                    name="sbpOnly"
                    value="1"
                    defaultChecked={params.sbpOnly === "1"}
                    className="size-4 accent-stone-900"
                />
                Only ads where СБП is the only way to pay
            </label>

            <button
                type="submit"
                className="ml-auto rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
                Search / refresh
            </button>
        </form>
    );
}
