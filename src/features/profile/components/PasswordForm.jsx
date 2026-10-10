import { useState } from "react";
import { HiOutlineLockClosed, HiOutlinePencilSquare } from "react-icons/hi2";

import Modal from "../../../ui/Modal";
import { useUpdatePassword } from "../hooks/useUpdatePassword";

function PasswordForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { changePassword, isPending } = useUpdatePassword();

  function handleOpenModal() {
    setPassword("");
    setConfirmPassword("");
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    if (isPending) return;
    setIsModalOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8 || password !== confirmPassword) return;

    changePassword(password, {
      onSuccess: () => {
        setPassword("");
        setConfirmPassword("");
        setIsModalOpen(false);
      },
    });
  }

  const passwordsDoNotMatch =
    Boolean(confirmPassword) && password !== confirmPassword;

  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8 dark:border-gray-700/80 dark:bg-[#111827]">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Security
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage the password used to access your RestaurantOS account.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <HiOutlinePencilSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Change password</span>
            <span className="sm:hidden">Change</span>
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700/70 dark:bg-[#1F2937]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <HiOutlineLockClosed className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Password
            </p>
            <p className="mt-1 text-sm tracking-[0.2em] text-gray-500 dark:text-gray-400">
              ••••••••••••
            </p>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          size="medium"
          closeOnOverlayClick={!isPending}
          closeOnEscape={!isPending}
        >
          <div className="text-gray-900 dark:text-gray-100">
            <div className="flex items-start justify-between border-b border-gray-200 pb-5 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Change password
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Choose a new password for your account.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isPending}
                aria-label="Close modal"
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 py-6">
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <HiOutlineLockClosed className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                    <input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={isPending}
                      autoFocus
                      required
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:bg-gray-100 dark:border-gray-700 dark:bg-[#0B1120] dark:text-gray-100 dark:placeholder:text-gray-500 dark:disabled:bg-gray-800"
                      placeholder="At least 8 characters"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Use at least 8 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm new password
                  </label>

                  <div className="relative">
                    <HiOutlineLockClosed className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      disabled={isPending}
                      required
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:bg-gray-100 dark:border-gray-700 dark:bg-[#0B1120] dark:text-gray-100 dark:placeholder:text-gray-500 dark:disabled:bg-gray-800"
                      placeholder="Repeat your new password"
                    />
                  </div>
                </div>

                {password && password.length < 8 && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Password must contain at least 8 characters.
                  </p>
                )}

                {passwordsDoNotMatch && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Passwords do not match.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 bg-gray-50/50 pt-4 dark:border-gray-700 dark:bg-transparent">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isPending}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isPending ||
                    password.length < 8 ||
                    password !== confirmPassword
                  }
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "Updating..." : "Update password"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}

export default PasswordForm;
