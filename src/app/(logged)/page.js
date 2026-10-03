import {connection} from "next/server";
import Header from "../../components/header";
import {auth} from "../../lib/auth/server";
import Posts from "../../components/homepage/posts";




export default async function HomePage()
{
    await connection();
    const {data} = await auth.getSession();
    return (
        <div className="flex min-h-screen flex-col bg-white  text-gray-900">

            <Header/>
            <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
                <Posts/>
            </main>
        </div>
    );
}