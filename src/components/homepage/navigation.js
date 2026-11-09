"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";

const links = [
    {href : "/" , text : "Offers"},
    {href : "/api/offers" , text : "JSON"},
];


export default function Navigation()
{
    const path = usePathname();
    return <nav aria-label="Main navigation">
        <ul className="flex items-center divide-x divide-neutral-300">
            {links.map((link) => (
                <li key={link.href} className="px-4 first:pl-0 last:pr-0">
                    <Link
                        href={link.href}
                        prefetch={false}
                        className={`text-md font-medium transition-colors hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-4  ${path === link.href ? 'text-neutral-950 underline underline-offset-4' : 'text-neutral-700'}`}
                    >
                        {link.text}
                    </Link>
                </li>
            ))}
        </ul>
    </nav>;
}
