"use client";

import {client} from "../../lib/auth/client";
import {useRouter} from "next/navigation";

export default function SignOutButton()
{
    const router = useRouter();

    async function signOut()
    {
        const { error } = await client.signOut();
        if (error) {
            console.error('Sign out error:', error.message);
            return;
        }
        router.push("/auth");
        router.refresh();
    }
    return <button
        type="button"
        onClick={signOut}
        className="text-sm font-semibold text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-950 hover:decoration-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-4"
    >
        Log out
    </button>
}