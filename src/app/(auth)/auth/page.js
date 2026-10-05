import AuthForm from "../../../components/auth/auth-forms";
import {Suspense} from "react";

export default async function AuthPage({searchParams}) {
    return (
    <>
      <main className="flex min-h-screen items-center justify-center  px-6 py-16 text-[#e8e6e3]">
        <section className="w-full max-w-sm rounded-xl border border-[#3d4349] bg-[#2b2f33] p-6 sm:p-8">
            <Suspense fallback={null}>
                <AuthFormWrapper searchParams={searchParams}/>
            </Suspense>
        </section>
      </main>
    </>
  );
}
async function AuthFormWrapper({searchParams})
{
    let mode = (await searchParams).mode;
    if(!mode)
    {
        mode = "login";
    }
    return <AuthForm mode={mode}/>
}