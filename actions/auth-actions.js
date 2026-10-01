"use server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUp(prevState, formData)
{
    const email = formData.get("email");
    const password = formData.get("password");

    const errors = validateCredentials(email, password);
    if (Object.keys(errors).length > 0)
        return { errors };


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