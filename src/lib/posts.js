
import {neon} from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function getPosts()
{
    const response = await sql`SELECT   p.id AS post_id,
                                        p.title,
                                        p.content,
                                        p.created_at,
                                        u.name AS author_name FROM posts p
                                JOIN neon_auth.user u ON u.id = p.user_id`;

    return response;

}