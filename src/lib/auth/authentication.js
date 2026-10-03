import {auth} from "./server";

export async function createUser(email, password, name)
{
    const {data, error} = await auth.signUp.email({
        email,
        password,
        name
    });

    if (error) {
        if (error.status === 422) {
            throw new Error("Email already exists");
        }
        throw new Error(error.message || "Couldn't create the account. Try again.");
    }

    return data;
}

export async function loginUser(email, password)
{
    const { error } = await auth.signIn.email({
        email,
        password
    });

    if(error)
    {
        throw new Error(error.message ||'Failed to sign in');
    }
}