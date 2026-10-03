import Link from "next/link";
import SignOutButton from "./auth/sign-out-button";


const links = [
    {href : "/chats" , text : "Chats"},
    {href : "/gallery" , text : "Gallery"},
    {href : "/contact" , text : "Contact"},
];

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
            <nav aria-label="Main navigation">
                <ul className="flex items-center divide-x divide-neutral-300">
                    {links.map((link) => (
                        <li key={link.href} className="px-4 first:pl-0 last:pr-0">
                            <Link
                                href={link.href}
                                className="text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-4"
                            >
                                {link.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <SignOutButton/>
        </div>
    </header>
}