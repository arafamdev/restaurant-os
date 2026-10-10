import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../../services/supabase";

function AcceptInvite() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      navigate("/dashboard");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#0B1120]">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-[#111827]">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome to RestaurantOS
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your password to finish setting up your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={isLoading}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 transition outline-none placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-[#1F2937] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-400 dark:focus:ring-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={isLoading}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 transition outline-none placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-[#1F2937] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-400 dark:focus:ring-gray-700"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus:ring-offset-[#111827]"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AcceptInvite;
