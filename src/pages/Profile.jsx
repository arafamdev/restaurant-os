import { HiOutlineCheckCircle } from "react-icons/hi2";
import {
  HiOutlineBuildingStorefront,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
} from "react-icons/hi2";

import PageHeader from "../ui/PageHeader";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";

import AvatarUpload from "../features/profile/components/AvatarUpload";
import ProfileAvatar from "../features/profile/components/ProfileAvatar";
import ProfileInformation from "../features/profile/components/ProfileInformation";
import PasswordForm from "../features/profile/components/PasswordForm";

import { useProfile } from "../features/profile/hooks/useProfile";
import { useAvatarUrl } from "../features/profile/hooks/useAvatarUrl";

function formatRole(roleName, isPlatformAdmin) {
  if (isPlatformAdmin) {
    return "Platform Admin";
  }

  if (!roleName) {
    return "Not assigned";
  }

  return roleName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Profile() {
  const { profile, isLoading, error } = useProfile();

  const { avatarUrl, isLoading: isAvatarLoading } = useAvatarUrl(
    profile?.avatar_path,
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.message}
        backLabel="Back to Dashboard"
        backTo="/dashboard"
      />
    );
  }

  const isPlatformAdmin = Boolean(profile?.is_platform_admin);
  const roleLabel = formatRole(profile?.role_name, isPlatformAdmin);

  const restaurantLabel =
    profile?.restaurant_name ||
    (isPlatformAdmin ? "Platform Account" : "Not assigned");

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      {/* Page heading */}

      <PageHeader
        icon={HiOutlineUserCircle}
        title="My Profile"
        description="Manage your personal information, profile photo and account security."
      />

      {/* Profile hero */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700/80 dark:bg-[#111827]">
        {/* Profile banner */}
        <div className="relative isolate h-40 overflow-hidden border-b border-gray-200 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 sm:h-44 dark:border-gray-700/80 dark:from-[#0B1120] dark:via-[#111827] dark:to-[#172033]">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-28 right-8 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-400/[0.08]" />

            <div className="absolute -right-16 -bottom-36 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/[0.07]" />

            {/* Decorative geometric rings */}
            <div className="absolute -top-28 right-8 h-64 w-64 rounded-full border border-gray-400/20 dark:border-white/[0.07]" />

            <div className="absolute -top-16 right-20 h-48 w-48 rounded-full border border-gray-400/20 dark:border-white/[0.07]" />

            <div className="absolute -top-4 right-32 h-32 w-32 rounded-full border border-emerald-600/15 dark:border-emerald-400/10" />

            {/* Fine decorative lines */}
            <div className="absolute top-0 right-0 h-full w-1/2 bg-[linear-gradient(135deg,transparent_49.8%,rgba(148,163,184,0.12)_50%,transparent_50.2%)]" />

            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent dark:from-white/[0.02]" />
          </div>

          {/* Banner content */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 sm:p-6">
            {/* Full name */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1 w-5 rounded-full bg-emerald-500 dark:bg-emerald-400" />

                <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-500 uppercase dark:text-gray-400">
                  Personal account
                </p>
              </div>

              <h2 className="max-w-2xl text-xl leading-tight font-bold tracking-tight break-words text-gray-950 sm:text-2xl md:text-3xl dark:text-white">
                {profile?.full_name?.trim() || "User"}
              </h2>
            </div>

            {/* Account identity */}
            <div className="hidden shrink-0 items-center gap-2 rounded-full border border-gray-300/70 bg-white/70 px-3.5 py-2 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-xl sm:inline-flex dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              </span>
              RestaurantOS Account
            </div>
          </div>
        </div>

        {/* User information */}
        <div className="px-5 pb-6 sm:px-7 sm:pb-7 md:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:gap-5">
            {/* Avatar */}
            <div className="relative w-fit shrink-0 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-gray-200 dark:bg-[#111827] dark:ring-gray-700">
              <ProfileAvatar
                name={profile?.full_name}
                avatarUrl={isAvatarLoading ? null : avatarUrl}
                size="large"
              />

              <span
                className="absolute right-2 bottom-2 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500 dark:border-[#111827] dark:bg-emerald-400"
                aria-label="Active account"
                title="Active account"
              />
            </div>

            {/* Name, email and role */}
            <div className="min-w-0 flex-1 pb-1">
              <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-gray-500 uppercase dark:text-gray-400">
                Personal account
              </p>

              <h2 className="text-2xl font-bold tracking-tight break-words text-gray-900 sm:text-3xl dark:text-gray-100">
                {profile?.full_name || "User"}
              </h2>

              <p className="mt-1 text-sm break-all text-gray-600 dark:text-gray-400">
                {profile?.email || "No email available"}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {/* Role */}
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  <HiOutlineUserCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {roleLabel}
                </span>

                {/* Account status */}
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  Active account
                </span>
              </div>
            </div>
          </div>

          {/* Account overview */}
          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-200 pt-5 sm:grid-cols-2 dark:border-gray-700">
            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-700/80 dark:bg-gray-800/40">
              <div className="flex items-center gap-2">
                <HiOutlineBuildingStorefront className="h-4 w-4 text-gray-500 dark:text-gray-400" />

                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Workspace
                </p>
              </div>

              <p className="mt-2 text-sm font-semibold break-words text-gray-900 dark:text-gray-100">
                {restaurantLabel}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-700/80 dark:bg-gray-800/40">
              <div className="flex items-center gap-2">
                <HiOutlineShieldCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />

                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Account type
                </p>
              </div>

              <p className="mt-2 text-sm font-semibold break-words text-gray-900 dark:text-gray-100">
                {isPlatformAdmin ? "Platform Administrator" : roleLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile photo */}
      {!isAvatarLoading && (
        <AvatarUpload profile={profile} avatarUrl={avatarUrl} />
      )}

      {/* Personal information */}
      <ProfileInformation
        profile={profile}
        roleLabel={roleLabel}
        restaurantLabel={restaurantLabel}
      />

      {/* Account information */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8 dark:border-gray-700/80 dark:bg-[#111827]">
        <div className="border-b border-gray-200 pb-5 dark:border-gray-700">
          <h2 className="text-lg font-semibold tracking-tight text-gray-950 dark:text-gray-100">
            Account
          </h2>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Information about your RestaurantOS account.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {/* Account status */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700/80 dark:bg-gray-800/40">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Account status
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                Your account is currently active.
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              <HiOutlineCheckCircle className="h-4 w-4" />
              Active
            </span>
          </div>

          {/* Workspace */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700/80 dark:bg-gray-800/40">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Workspace
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                Your current RestaurantOS workspace.
              </p>
            </div>

            <span className="max-w-full text-sm font-medium break-words text-gray-700 sm:max-w-48 sm:text-right dark:text-gray-300">
              {restaurantLabel}
            </span>
          </div>
        </div>
      </section>

      {/* Account security */}
      <PasswordForm />
    </div>
  );
}

export default Profile;
