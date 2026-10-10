import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { supabase } from "../services/supabase";
import { useTheme } from "../context/useTheme";
import Footer from "../components/Footer";
import logoLight from "../assets/logo/logo-light.svg";
import logoDark from "../assets/logo/logo-dark.svg";

function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [email, setEmail] = useState(
    import.meta.env.VITE_ADMIN_LOGIN_EMAIL || "",
  );
  const [password, setPassword] = useState(
    import.meta.env.VITE_ADMIN_LOGIN_PASSWORD || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#F8FAFC] transition-colors duration-300 dark:bg-[#0B1120]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl sm:h-[500px] sm:w-[500px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl"
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
            <img
              src={isDarkMode ? logoDark : logoLight}
              alt="RestaurantOS"
              className="mb-6 h-auto max-h-16 w-full max-w-[230px] object-contain"
            />

            <div className="mb-4 flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold tracking-[0.12em] text-emerald-700 uppercase dark:text-emerald-400">
                Restaurant Management
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
              Welcome back
            </h1>

            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-500 dark:text-gray-400">
              Sign in to your workspace and keep your restaurant running
              smoothly.
            </p>
          </div>

          <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] sm:p-8 dark:border-white/[0.08] dark:bg-[#111827] dark:shadow-[0_20px_60px_-25px_rgba(0,0,0,0.5)]">
            <div className="mb-7">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Sign in to your account
              </h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Enter your credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email address
                </label>

                <div className="group relative">
                  <HiOutlineEnvelope
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-600 dark:text-gray-500 dark:group-focus-within:text-emerald-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@company.com"
                    required
                    disabled={isLoading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3.5 pr-4 pl-11 text-sm text-gray-900 transition outline-none placeholder:text-gray-400 hover:border-gray-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#374151] dark:bg-[#0B1120] dark:text-white dark:placeholder:text-gray-600 dark:hover:border-gray-600 dark:focus:border-emerald-500 dark:focus:bg-[#0B1120]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>

                <div className="group relative">
                  <HiOutlineLockClosed
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-600 dark:text-gray-500 dark:group-focus-within:text-emerald-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3.5 pr-4 pl-11 text-sm text-gray-900 transition outline-none placeholder:text-gray-400 hover:border-gray-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#374151] dark:bg-[#0B1120] dark:text-white dark:placeholder:text-gray-600 dark:hover:border-gray-600 dark:focus:border-emerald-500 dark:focus:bg-[#0B1120]"
                  />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm shadow-emerald-950/10 transition duration-200 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{isLoading ? "Signing in..." : "Sign in"}</span>

                {!isLoading && (
                  <HiOutlineArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="mt-6 flex items-start gap-2.5 border-t border-gray-100 pt-5 dark:border-white/[0.08]">
              <HiOutlineShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

              <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                Your account is protected by secure authentication. Only
                authorized users can access their workspace.
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default Login;
