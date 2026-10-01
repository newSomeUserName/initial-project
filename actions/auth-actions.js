"use server";

import {redirect} from "next/navigation";
import {createUser} from "../lib/auth/authentication";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUp(prevState, formData)
{
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const errors = validateCredentials(email, password);
    if (Object.keys(errors).length > 0)
        return { errors , values: {name, email}};

    try {
        const result = await createUser(email,password,name);
    }
    catch (error)
    {
        errors.email = error.message;
        return { errors , values: {name, email}};
    }

    redirect('/');
}

function validateCredentials(email, password)
{
    let errors = {};
    if (!emailRegex.test(email))
    {
        errors.email = "Inserted email is invalid";
    }
    if (password.length < 8)
    {
        errors.password = "Inserted password is less than 8 characters";
    }
    return errors;
}