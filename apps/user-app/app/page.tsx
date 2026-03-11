import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./lib/auth";
import Link from "next/link";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <nav className="relative z-10 flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          FinPay
        </h1>

        <div className="flex gap-6 items-center">
          <Link
            href="/Signin"
            className="text-gray-400 hover:text-white transition"
          >
            Sign In
          </Link>

          <Link
            href="/Signup"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition font-semibold shadow-lg"
          >
            Create Account
          </Link>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-24">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl">
          Move Money <span className="text-blue-400">Smarter</span>,
          <br />
          Faster & Securely.
        </h2>

        <p className="mt-6 text-gray-300 max-w-2xl text-lg leading-relaxed">
          A modern digital wallet built for instant transfers, seamless bank
          integration, and complete transaction visibility.
        </p>

        <div className="mt-10">
          <Link
            href="/Signup"
            className="px-8 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="relative z-10 flex justify-center gap-16 text-center pb-20">
        <Stat number="10K+" label="Transactions Processed" />
        <Stat number="98.6%" label="System Uptime" />
        <Stat number="256-bit" label="Encrypted Security" />
      </section>

      <section className="relative z-10 grid md:grid-cols-3 gap-10 px-10 pb-28">
        <Feature
          title="Instant Transfers"
          desc="Send and receive payments in real time with minimal latency."
        />
        <Feature
          title="Secure On-Ramp"
          desc="Add funds securely with server-verified bank integration."
        />
        <Feature
          title="Full Transparency"
          desc="Monitor balances and transaction statuses with live updates."
        />
      </section>

      <section className="relative z-10 pb-20 text-center px-6">
        <h3 className="text-3xl font-bold">Security & Reliability First</h3>

        <p className="mt-6 max-w-3xl mx-auto text-gray-400 leading-relaxed">
          FinPay is built with server-side validation, encrypted credential
          handling, transaction integrity checks, and session-based
          authentication to ensure every transaction remains protected.
        </p>
      </section>

      <footer className="text-center pb-10 text-gray-500 dark:text-gray-300 text-sm border-t border-slate-800 dark:border-slate-700 pt-8">
        © {new Date().getFullYear()} FinPay. Built for modern payments.
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-[#1e293b] rounded-2xl p-8 border border-slate-700 dark:border-slate-700 hover:border-blue-500 transition shadow-lg">
      <h3 className="text-xl font-semibold text-blue-400">{title}</h3>
      <p className="mt-4 text-gray-300 leading-relaxed">{desc}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <h4 className="text-3xl font-bold text-blue-400">{number}</h4>
      <p className="text-gray-400 mt-2">{label}</p>
    </div>
  );
}
