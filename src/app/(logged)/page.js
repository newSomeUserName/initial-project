import {auth} from "../../../lib/auth/server";
import {connection} from "next/server";


export default async function HomePage()
{
    await connection();
    const {data} = await auth.getSession();
    return <>
        <h1 className={"text-center"}>Hello {data.user.email}</h1>
    </>
}