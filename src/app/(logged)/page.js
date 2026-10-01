import {auth} from "../../../lib/auth/server";


export default async function HomePage()
{
    const {data} = await auth.getSession();
    return <>
        <h1 className={"text-center"}>Hello {data.user.email}</h1>
    </>
}