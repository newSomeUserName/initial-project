import {auth} from "../../../../lib/auth/server";
import {redirect} from "next/navigation";
import AuthForm from "../../../../components/auth/auth-forms";
import {connection} from "next/server";

export default async function AuthPage({searchParams}) {
    await connection();
    const {data} = await auth.getSession();
    if (data)
    {
        redirect("/");
    }

    let mode = (await searchParams).mode;
    if(!mode)
    {
        mode = "login";
    }

    return (
    <>
      <main className="flex min-h-screen items-center justify-center  px-6 py-16 text-[#e8e6e3]">
        <section className="w-full max-w-sm rounded-xl border border-[#3d4349] bg-[#2b2f33] p-6 sm:p-8">
                <AuthForm mode={mode}/>
        </section>
      </main>
    </>
  );
}
