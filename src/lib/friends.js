

import {neon} from "@neondatabase/serverless";
import {auth} from "@/lib/auth/server";

const sql = neon(process.env.DATABASE_URL);

export async function getFriends(userId)
{




    //TODO
    // i want to throw or handle error here if user not found

    return sql`SELECT * FROM get_friends(${userId})`;

}
// const {data: session} = await auth.getSession();

// const userId = session?.user?.id;