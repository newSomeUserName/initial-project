import {getFriends} from "../../../lib/friends";
import {Suspense} from "react";
import Link from "next/link";
import {auth} from "../../../lib/auth/server";
const profile = {
    name: "Your Name",
    email: "you@example.com",
    image: null, // Add an image URL when available
};

const posts = [
    {
        id: 1,
        image: "null",
        title: "A new beginning",
        content: `I’ve been thinking about how every new beginning looks ordinary at first. There’s no music in the background and no clear sign that life is about to change. Usually, it starts with a small decision: getting up a little earlier, taking a different route home, or finally making time for something that matters.

Lately, I’ve been trying to pay more attention to those small choices. I started keeping a notebook by the window and writing down a few thoughts each morning. Some days the page stays almost empty. Other days, one idea leads to another, and before I know it, I’ve filled a page.

I don’t have a perfect plan for what comes next, and that feels okay. For now, I’m glad to be starting, curious about what I’ll learn, and grateful for the people who have encouraged me along the way.`,
    },
    {
        id: 2,
        image: null,
        title: "A day worth remembering",
        content: `Yesterday was one of those days that didn’t seem especially important while it was happening. The weather was mild, the streets were busy, and I had a list of small errands to finish. But somewhere between the first cup of coffee and the walk home, the day became one I want to remember.

I met an old friend for lunch. We traded stories about work, family, and all the little things that had changed since we last had a proper conversation. Neither of us was in a hurry, so we stayed longer than planned. It was comforting to pick up where we left off without needing to explain everything.

On the way home, I took the long route through the park. The trees were beginning to change color, and the late afternoon light made everything feel quieter. I took a few photos, though I know they won’t quite capture how peaceful it felt to be there.

Nothing extraordinary happened. I think that’s why the day stayed with me. It reminded me that a good life is often made up of simple moments: an unhurried conversation, a familiar path, and enough time to notice where you are.`,
    },
];
const MOBILE_LIMIT = 3;

async function FriendsList({userId}) {
    const friends = await getFriends(userId);

    return (
        <section className="mt-7 border-t border-stone-200 pt-5 lg:mt-8 lg:pt-6">
            <h2 className="text-sm font-semibold text-stone-900 lg:text-base">
                Friends
                <span className="ml-2 font-normal text-stone-500">{friends.length}</span>
            </h2>

            {friends.length === 0 ? (
                <p className="mt-3 text-sm text-stone-500 lg:mt-4">No friends yet.</p>
            ) : (
                <>
                    <ul className="mt-3 space-y-3 lg:mt-4 lg:space-y-4">
                        {friends.map((friend, index) => (
                            <li
                                key={friend.id}
                                className={`items-center gap-3 lg:gap-4 ${
                                    index >= MOBILE_LIMIT ? 'hidden lg:flex' : 'flex'
                                }`}
                            >
                                {friend.image ? (
                                    <img
                                        src={friend.image}
                                        alt=""
                                        className="size-8 rounded-full object-cover lg:size-10"
                                    />
                                ) : (
                                    <span
                                        aria-hidden="true"
                                        className="flex size-8 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-600 lg:size-10 lg:text-sm"
                                    >
                    {friend.name.charAt(0).toUpperCase()}
                  </span>
                                )}
                                <span className="text-sm text-stone-700 lg:text-base">{friend.name}</span>
                            </li>
                        ))}
                    </ul>

                    {friends.length > MOBILE_LIMIT && (
                        <Link
                            href="/friends"
                            className="mt-3 inline-block text-sm text-stone-500 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900 hover:decoration-stone-900 lg:hidden"
                        >
                            See all {friends.length} friends
                        </Link>
                    )}
                </>
            )}
        </section>
    );
}

//TODO i need to cache friends count and revalidate it when user will add or delete a friend
//also i need to cache static user info like name or email

//TODO delete this after i will study about caching
export const dynamic = 'force-dynamic';

async function AsideUserInfo()
{
    const {data: session} = await auth.getSession();
    const userId = session?.user?.id;

    return <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 lg:p-8">
        <div className="flex items-center gap-4 lg:flex-col lg:items-start">
            {profile.image ? (
                <img
                    src={profile.image}
                    alt={`${profile.name}'s profile`}
                    className="size-20 rounded-full object-cover ring-4 ring-stone-100 lg:size-24"
                />
            ) : (
                <div
                    aria-label={`${profile.name}'s profile`}
                    className="flex size-20 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl font-semibold text-amber-900 ring-4 ring-stone-100 lg:size-24 lg:text-3xl"
                >
                    {profile.name.charAt(0)}
                </div>
            )}

            <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-stone-950 lg:text-2xl">
                    {session.user.name}
                </h1>
                <p className="mt-1 break-all text-sm text-stone-500 lg:text-base">
                    {session.user.email}
                </p>
            </div>
        </div>

        <Suspense fallback={<h1>LOADING FRIENDS</h1>}>
            <FriendsList userId={userId} />
        </Suspense>
    </aside>
}

export default function ProfilePage() {
    return (
        <main className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
            <Suspense fallback={<><h1>Loading Info</h1></>}>
                <AsideUserInfo/>
            </Suspense>
            <section aria-labelledby="posts-heading">
                <div className="mb-6 flex items-end justify-between border-b border-stone-200 pb-4">
                    <div>
                        <p className="text-sm font-medium text-amber-700">Your activity</p>
                        <h2
                            id="posts-heading"
                            className="mt-1 text-3xl font-semibold tracking-tight text-stone-950"
                        >
                            My posts
                        </h2>
                    </div>
                    <span className="pb-1 text-sm text-stone-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
                </div>

                {posts.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-stone-600">
                        You haven’t shared a post yet.
                    </p>
                ) : (
                    <div className="space-y-5">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
                            >
                                <h3 className="text-xl font-semibold tracking-tight text-stone-950">
                                    {post.title}
                                </h3>
                                {post.image && (
                                    <img
                                        src={"https://www.duunddastier.de/wp-content/uploads/2018/09/Kaenguru_HdK_c_imageBROKER-Alamy-Stock-Photo_DUDT-3-18_Beitragsbild.jpg"}
                                        alt=""
                                        className="mt-5 max-h-[28rem] w-full rounded-lg object-cover"
                                    />
                                )}
                                <p className="mt-3 whitespace-pre-wrap leading-7 text-stone-700">
                                    {post.content}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}