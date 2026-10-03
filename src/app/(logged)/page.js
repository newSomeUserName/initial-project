import {connection} from "next/server";
import Header from "../../components/header";
import {auth} from "../../lib/auth/server";




export default async function HomePage()
{
    await connection();
    const {data} = await auth.getSession();
    return (
        <div className="flex min-h-screen flex-col bg-white  text-gray-900">

            <Header/>
            <main className="flex flex-1 p-3 sm:p-6">

            </main>
        </div>
    );
}