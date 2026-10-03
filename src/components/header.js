import Link from "next/link";
import SignOutButton from "./auth/sign-out-button";
import Navigation from "./homepage/navigation";

export default function Header()
{
    return <header className="flex flex-wrap items-center justify-between gap-4  px-6 py-4 sm:px-10">
        <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-neutral-950"
        >
            My Life Blog
        </Link>
        <div className="flex items-center gap-5">
            <Navigation/>
            <SignOutButton/>
        </div>
    </header>
}