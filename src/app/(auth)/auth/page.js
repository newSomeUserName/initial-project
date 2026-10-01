import SignUpForm from "../../../../components/auth/sign-up-form";

export default function AuthPage() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center  px-6 py-16 text-[#e8e6e3]">
        <section className="w-full max-w-sm rounded-xl border border-[#3d4349] bg-[#2b2f33] p-6 sm:p-8">

              <SignUpForm/>
        </section>
      </main>
    </>
  );
}
