import {getPosts} from "../../lib/posts";


export default async function Posts()
{
    const posts =  await getPosts();
    return <>
        <header className="mb-12 border-b-2 border-amber-200 pb-8 sm:mb-16 sm:pb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Notes & stories
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Life Blog
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                Thoughts, moments, and things worth remembering.
            </p>
        </header>

        <div className="space-y-5 sm:space-y-7">
            {posts.map((post) => (
                <article
                    key={post.post_id}
                    className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
                >
                    <p className="text-sm font-medium text-stone-500">
                        <time dateTime={new Date(post.created_at).toISOString()}>
                            {new Date(post.created_at).toLocaleDateString("en", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </time>

                        {post.author_name && (
                            <>
                                <span aria-hidden="true" className="mx-2 text-amber-600">·</span>
                                <span className="text-stone-700">{post.author_name}</span>
                            </>
                        )}
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-3xl">
                        {post.title}
                    </h2>

                    <p className="mt-4 max-w-3xl whitespace-pre-wrap text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
                        {post.content}
                    </p>
                </article>
            ))}
        </div>
    </>;
}

