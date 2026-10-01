import {auth} from "./server";


export async function createUser(email, password, name)
{
    const {data, error} = await auth.signUp.email({
        email,
        password,
        name
    });
    console.log("error: " + error);
}