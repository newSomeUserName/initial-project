"use client";

import {useActionState} from "react";
import {login, signUp} from "../../actions/auth-actions";
import {useFormStatus} from "react-dom";
import Link from "next/link";

export default function AuthForm({mode})
{
    return mode === "login" ? <LoginForm/> : <AuthForms/>;
}

export  function AuthForms() {
    const [state, formAction] = useActionState(signUp,{});
    return (
            <>
                <header className="mb-5">
                    <h1 className="text-2xl font-medium tracking-tight">
                        Create an account
                    </h1>
                </header>
                <form className="space-y-5" action={formAction} noValidate>
                    <Field id="name" label="Name" type="text" defaultValue={state?.values?.name}/>
                    <Field id="email" label="Email" type="email" defaultValue={state?.values?.email}/>
                    {state?.errors?.email && (
                        <p id="email-error" className="-mt-3 text-xs text-[#f28b82]">
                            {state.errors.email}
                        </p>
                    )}
                    <Field
                        id="password"
                        label="Password"
                        type="password"
                        defaultValue={state?.values?.password}
                    />
                    {state?.errors?.password && (
                        <p id="password-error" className="-mt-3 text-xs text-[#f28b82]">
                            {state.errors.password}
                        </p>
                    )}
                    <SubmitButton text={"Creat"}/>
                </form>
                <p className="mt-6 text-center text-sm text-[#9aa0a6]">
                    Already have an account?{" "}
                    <Link
                        href="/auth?mode=login"
                        className="rounded-sm text-[#e8e6e3] underline decoration-[#5a6066] underline-offset-4 transition-colors hover:decoration-[#e8e6e3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a9096]"
                    >
                        Sign in
                    </Link>
                </p>
            </>
    );
}

export  function LoginForm()
{
    const [state, formAction] = useActionState(login ,{});
    return (
        <>
            <header className="mb-5">
                <h1 className="text-2xl font-medium tracking-tight">
                    Login account
                </h1>
            </header>
            <form className="space-y-5" action={formAction} noValidate>
                <Field id="email" label="Email" type="email" defaultValue={state?.values?.email}/>
                <Field
                    id="password"
                    label="Password"
                    type="password"
                    defaultValue={state?.values?.password}
                />
                {state?.error && (
                    <p id="password-error" className="-mt-3 text-xs text-[#f28b82]">
                        {state.error}
                    </p>
                )}
                <SubmitButton text={"Login"}/>
            </form>
            <p className="mt-6 text-center text-sm text-[#9aa0a6]">
                No account yet?{" "}
                <Link
                    href="/auth?mode=register"
                    className="rounded-sm text-[#e8e6e3] underline decoration-[#5a6066] underline-offset-4 transition-colors hover:decoration-[#e8e6e3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a9096]"
                >
                    Create one
                </Link>
            </p>
        </>
    );
}

function Field({ id, label , type, defaultValue}) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm text-[#c4c7ca]">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                defaultValue={defaultValue}
                className="w-full rounded-md border border-[#3d4349] bg-[#1f2225] px-3 py-2.5 text-sm text-[#e8e6e3] outline-none focus:border-[#8a9096] focus:ring-1 focus:ring-[#8a9096]"
            />
        </div>
    );
}


function SubmitButton({text})
{
    const {pending} = useFormStatus();
    return (
        <button
            disabled={pending}
            type="submit"
            className="mt-3 w-full rounded-md bg-[#e8e6e3] px-4 py-2.5 text-sm font-medium text-[#1f2225] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8e6e3]"
        >
            {pending ? "Processing..." : `${text} account`}
        </button>
    );
}


