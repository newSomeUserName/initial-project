import Posts from "../../components/homepage/posts";




export default async function HomePage()
{
    return (
        <>
            <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
                <Posts/>
            </main>
    </>);
}