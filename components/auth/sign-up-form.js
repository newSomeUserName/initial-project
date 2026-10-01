"use client";

import {useActionState} from "react";
import {signUp} from "../../actions/auth-actions";
import {useFormStatus} from "react-dom";

export default function SignUpForm() {
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
                        <p id="email-error" className="-mt-3 text-xs text-[#f28b82]">
                            {state.errors.password}
                        </p>
                    )}
                    <SubmitButton/>
                </form>
            </>
    );
}

function SubmitButton()
{
    const {pending} = useFormStatus();
    return (
        <button
            disabled={pending}
            type="submit"
            className="mt-3 w-full rounded-md bg-[#e8e6e3] px-4 py-2.5 text-sm font-medium text-[#1f2225] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8e6e3]"
        >
            {pending ? "Creating account..." : "Create account"}
        </button>
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
